import { useEffect, useState } from 'react';
import api from '../services/api';
import { Heatmap } from '../components/Heatmap';
import { PageLoader } from '../components/PageLoader';
import { Trophy, Star, Target, Flame, Medal, Swords } from 'lucide-react';
import * as Icons from 'lucide-react';

interface UserProfileData {
    user: { name: string, email: string, createdAt: string };
    stats: { totalSolved: number, currentStreak: number, maxStreak: number, rank: string };
    badges: { id: string, name: string, description: string, icon: string }[];
    recentActivity: { id: string, createdAt: string, problem: { title: string, difficulty: string }}[];
}

const IconComponent = ({ name, size = 24, color = "currentColor" }: { name: string, size?: number, color?: string }) => {
    // Dynamically grab the lucide icon, default to Trophy if not found
    const LucideIcon = (Icons as any)[name] || Trophy; 
    return <LucideIcon size={size} color={color} />;
};

export const Profile = () => {
    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [heatmapData, setHeatmapData] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);
            const [profileRes, heatmapRes] = await Promise.all([
                api.get('/users/me/profile'),
                api.get('/users/me/heatmap')
            ]);
            setProfile(profileRes.data);
            setHeatmapData(heatmapRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) return <PageLoader />;

    if (!profile) return <div>Failed to load profile.</div>;

    const { stats, badges, recentActivity } = profile;

    return (
        <div className="animate-fade-in stagger-children" style={{ 
            padding: '2rem', 
            maxWidth: '1200px', 
            margin: '0 auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '2rem' 
        }}>
            
            {/* Header / Stats Panel */}
            <div className="clay-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {/* Avatar Circle */}
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'var(--bg-elevated)',
                        boxShadow: 'var(--shadow-3d-out)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        border: '2px solid var(--accent-earth-green)'
                    }}>
                        <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                            {(profile.user.name || profile.user.email || 'U').charAt(0).toUpperCase()}
                        </span>
                    </div>

                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>{profile.user.name || profile.user.email}</h1>
                        <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-secondary)' }}>Member since {new Date(profile.user.createdAt).getFullYear()}</p>
                    </div>
                </div>

                {/* Scorecards */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="clay-inset" style={{ padding: '1rem 1.5rem', textAlign: 'center', minWidth: '120px' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.3rem', display: 'flex', alignItems:'center', justifyContent: 'center', gap: '0.3rem' }}>
                            <Star size={14} color="var(--accent-amber)" /> Rank
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-amber)' }}>{stats.rank}</div>
                    </div>
                    
                    <div className="clay-inset" style={{ padding: '1rem 1.5rem', textAlign: 'center', minWidth: '120px' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.3rem', display: 'flex', alignItems:'center', justifyContent: 'center', gap: '0.3rem' }}>
                            <Target size={14} color="var(--accent-earth-green)" /> Solved
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalSolved}</div>
                    </div>

                    <div className="clay-inset" style={{ padding: '1rem 1.5rem', textAlign: 'center', minWidth: '120px' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.3rem', display: 'flex', alignItems:'center', justifyContent: 'center', gap: '0.3rem' }}>
                            <Flame size={14} color="var(--accent-burnt-orange)" /> Streak
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.currentStreak} <span style={{fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal'}}>/ {stats.maxStreak} max</span></div>
                    </div>
                </div>
            </div>

            {/* Heatmap Row */}
            <Heatmap data={heatmapData} />

            {/* Bottom Row (Badges & Recent) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '2rem' }}>
                
                {/* Badges Panel */}
                <div className="clay-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Medal color="var(--accent-amber)" /> Achievements
                        </h3>
                    </div>

                    {badges.length === 0 ? (
                        <div className="clay-inset" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No badges earned yet. Time to start solving!
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                            {badges.map(badge => (
                                <div key={badge.id} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    gap: '0.8rem'
                                }}>
                                    <div className="clay-panel" style={{
                                        width: '80px', height: '80px',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        borderRadius: '25%', // Squircle shape!
                                        background: 'linear-gradient(135deg, var(--bg-card), var(--bg-secondary))',
                                    }}>
                                        <IconComponent name={badge.icon} size={36} color="var(--accent-amber)" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{badge.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{badge.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Activity Panel */}
                <div className="clay-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Swords color="var(--accent-burnt-orange)" /> Recent Activity
                    </h3>

                    {recentActivity.length === 0 ? (
                        <div className="clay-inset" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No recent activity found.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {recentActivity.map(attempt => (
                                <div key={attempt.id} className="clay-inset" style={{ 
                                    padding: '1rem', 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center' 
                                }}>
                                    <div>
                                        <div style={{ fontWeight: '500', marginBottom: '0.2rem' }}>{attempt.problem.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {new Date(attempt.createdAt).toLocaleDateString()} at {new Date(attempt.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                    <span className={`badge-${attempt.problem.difficulty.toLowerCase()}`} style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                        {attempt.problem.difficulty}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
