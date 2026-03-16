import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProblems } from '../services/problemService';
import { Problem } from '../types';
import { useAuthStore } from '../context/authStore';
import { BookOpen, Zap, ChevronRight, Search } from 'lucide-react';
import { PageLoader } from '../components/PageLoader';
import { GenerateButton } from '../components/GenerateButton';

export const Home = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const data = await getProblems();
                setProblems(data);
            } catch (error) {
                console.error('Failed to fetch problems', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    const filteredProblems = problems.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.topic.toLowerCase().includes(search.toLowerCase())
    );

    const getDifficultyClass = (d: string) => {
        if (d === 'Easy') return 'badge-easy';
        if (d === 'Medium') return 'badge-medium';
        return 'badge-hard';
    };

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <div style={{
                marginBottom: '2.5rem',
                paddingTop: '1rem',
            }}>
                <div className="mobile-col" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 800,
                        marginBottom: '0.5rem',
                        color: 'var(--text-primary)',
                    }}>
                        Welcome back, <span style={{
                            background: 'linear-gradient(135deg, var(--accent-burnt-orange), var(--accent-earth-green))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>{user?.name || 'Learner'}</span>
                    </h1>
                    <GenerateButton onClick={() => console.log('Generate clicked!')} text="Generate Problem" />
                </div>
                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '1rem',
                }}>Pick a problem and start building your algorithmic thinking</p>

                {/* Stats Row */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginTop: '1.5rem',
                }}>
                    {[
                        { icon: <BookOpen size={18} />, label: 'Problems', value: problems.length, color: 'var(--accent-burnt-orange)' },
                        { icon: <Zap size={18} />, label: 'Topics', value: [...new Set(problems.map(p => p.topic))].length, color: 'var(--accent-emerald)' },
                    ].map((stat) => (
                        <div key={stat.label} className="card" style={{
                            padding: '1rem 1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                        }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: 'var(--radius-md)',
                                background: `${stat.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: stat.color,
                            }}>
                                {stat.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <Search size={18} style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                }} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field"
                    placeholder="Search problems by name or topic..."
                    style={{ paddingLeft: '2.75rem' }}
                />
            </div>

            {/* Problem List */}
            {loading ? (
                <PageLoader />
            ) : (
                <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filteredProblems.map((problem) => (
                        <Link
                            key={problem.id}
                            to={`/problem/${problem.slug}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="card card-hover" style={{
                                padding: '1.25rem 1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--bg-elevated)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        color: 'var(--accent-burnt-orange)',
                                        fontFamily: "'JetBrains Mono', monospace",
                                    }}>
                                        #{filteredProblems.indexOf(problem) + 1}
                                    </div>
                                    <div>
                                        <h3 style={{
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            color: 'var(--text-primary)',
                                            marginBottom: '0.25rem',
                                        }}>{problem.title}</h3>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span className={getDifficultyClass(problem.difficulty)} style={{
                                                padding: '0.15rem 0.6rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                            }}>{problem.difficulty}</span>
                                            <span style={{
                                                padding: '0.15rem 0.6rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.7rem',
                                                fontWeight: 500,
                                                background: 'var(--bg-elevated)',
                                                color: 'var(--text-muted)',
                                                border: '1px solid var(--border-subtle)',
                                            }}>{problem.topic}</span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
                            </div>
                        </Link>
                    ))}
                    {filteredProblems.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            color: 'var(--text-muted)',
                        }}>
                            {search ? 'No problems match your search.' : 'No problems available yet.'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
