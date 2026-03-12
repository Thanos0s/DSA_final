import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { register } from '../services/authService';
import { Code2, ArrowRight, AlertCircle } from 'lucide-react';

export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await register(email, password, name);
            setAuth(data);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
        }}>
            {/* Left Panel — Branding */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '3rem',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
                    top: '-100px',
                    left: '-100px',
                }} />
                <div style={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                    bottom: '-50px',
                    right: '-50px',
                }} />

                <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        marginBottom: '2rem',
                    }}>
                        <Code2 size={40} style={{ color: 'var(--accent-emerald)' }} />
                        <span style={{
                            fontSize: '2.5rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, var(--accent-earth-green), var(--accent-burnt-orange))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>ThinkDSA</span>
                    </div>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1.15rem',
                        maxWidth: '400px',
                        lineHeight: 1.7,
                    }}>
                        Join thousands of learners building real problem-solving skills through guided, AI-powered practice.
                    </p>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        marginTop: '2.5rem',
                        textAlign: 'left',
                        maxWidth: '320px',
                    }}>
                        {[
                            'Learn to think, not just memorize solutions',
                            'Get personalized hints based on your progress',
                            'Run code with instant feedback',
                        ].map((text) => (
                            <div key={text} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                color: 'var(--text-secondary)',
                                fontSize: '0.9rem',
                            }}>
                                <div style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: 'var(--accent-emerald)',
                                    flexShrink: 0,
                                }} />
                                {text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel — Form */}
            <div style={{
                width: '480px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '3rem',
                background: 'var(--bg-secondary)',
                borderLeft: '1px solid var(--border-subtle)',
            }}>
                <div className="animate-slide-up">
                    <h2 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        marginBottom: '0.5rem',
                        color: 'var(--text-primary)',
                    }}>Create your account</h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        marginBottom: '2rem',
                        fontSize: '0.95rem',
                    }}>Start your journey to algorithmic mastery</p>

                    {error && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            color: '#f87171',
                            fontSize: '0.85rem',
                            marginBottom: '1.5rem',
                        }}>
                            <AlertCircle size={16} />
                            {error.toString()}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                color: 'var(--text-secondary)',
                                marginBottom: '0.5rem',
                            }}>Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                                placeholder="Your name"
                            />
                        </div>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                color: 'var(--text-secondary)',
                                marginBottom: '0.5rem',
                            }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '1.75rem' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                color: 'var(--text-secondary)',
                                marginBottom: '0.5rem',
                            }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.8em',
                                fontSize: '0.95rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                background: 'linear-gradient(135deg, #587F5A, var(--accent-burnt-orange))',
                            }}
                        >
                            {loading ? 'Creating account...' : (
                                <>Get Started <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>

                    <p style={{
                        marginTop: '1.5rem',
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        color: 'var(--text-muted)',
                    }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{
                            color: 'var(--accent-burnt-orange)',
                            textDecoration: 'none',
                            fontWeight: 500,
                        }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
