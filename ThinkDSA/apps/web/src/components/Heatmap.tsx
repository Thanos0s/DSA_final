import React from 'react';

interface ActivityData {
    date: string; // YYYY-MM-DD
    count: number;
}

interface HeatmapProps {
    data: ActivityData[];
}

export const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
    // Generate the last 365 days of data
    const today = new Date();
    const days = [];
    const numDays = 365;
    
    // Map dates to counts for quick lookup
    const activityMap = new Map<string, number>();
    data.forEach(d => activityMap.set(d.date, d.count));

    for (let i = numDays - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const count = activityMap.get(dateStr) || 0;
        days.push({ date: dateStr, count });
    }

    // Split into weeks (cols)
    const weeks: { date: string, count: number }[][] = [];
    let currentWeek: { date: string, count: number }[] = [];
    
    // Ensure the first week aligns with the right day of the week
    const firstDayOfWeek = new Date(days[0].date).getDay();
    for(let i=0; i<firstDayOfWeek; i++) {
        currentWeek.push({ date: '', count: 0 }); // padding
    }

    days.forEach(day => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });
    
    if (currentWeek.length > 0) {
        while(currentWeek.length < 7) {
            currentWeek.push({ date: '', count: 0 });
        }
        weeks.push(currentWeek);
    }

    // Function to determine color/shadow intensity based on count
    const getStyles = (count: number) => {
        if (count === 0) {
            return {
                background: 'var(--bg-input)', // Recessed look
                boxShadow: 'var(--shadow-3d-in)',
                border: '1px solid rgba(10, 8, 7, 0.3)'
            };
        }
        
        // Activity detected! Pop it out using 3D Outset and give it the accent color
        // The more activity, the brighter it gets
        let opacity = 0.4;
        if (count == 1) opacity = 0.5;
        if (count == 2) opacity = 0.7;
        if (count >= 3) opacity = 1.0;

        return {
            background: `color-mix(in srgb, var(--accent-burnt-orange) ${opacity * 100}%, var(--bg-card))`,
            boxShadow: 'var(--shadow-3d-out)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transform: 'translateZ(2px)' // Small push out
        };
    };

    return (
        <div className="clay-card" style={{ padding: '1.5rem', width: '100%', overflowX: 'auto' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-earth-green)' }}>●</span> Activity History
            </h3>
            
            <div style={{ display: 'flex', gap: '4px' }}>
                {weeks.map((week, wIndex) => (
                    <div key={wIndex} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {week.map((day, dIndex) => {
                            if (!day.date) return <div key={dIndex} style={{ width: '12px', height: '12px' }} />; // Empty placeholder
                            
                            return (
                                <div 
                                    key={day.date}
                                    title={`${day.count} submissions on ${day.date}`}
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '3px',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer',
                                        ...getStyles(day.count)
                                    }}
                                    onMouseOver={(e) => {
                                        (e.target as HTMLDivElement).style.transform = day.count > 0 ? 'scale(1.2) translateZ(4px)' : 'scale(1.1)';
                                    }}
                                    onMouseOut={(e) => {
                                        (e.target as HTMLDivElement).style.transform = day.count > 0 ? 'translateZ(2px)' : 'none';
                                    }}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Less
                <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, ...getStyles(0) }} />
                    <div style={{ width: 12, height: 12, borderRadius: 3, ...getStyles(1) }} />
                    <div style={{ width: 12, height: 12, borderRadius: 3, ...getStyles(2) }} />
                    <div style={{ width: 12, height: 12, borderRadius: 3, ...getStyles(4) }} />
                </div>
                More
            </div>
        </div>
    );
};
