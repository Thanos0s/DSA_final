import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { login, signInWithGoogle } from '../services/authService';
import { Code2, AlertCircle, Target, Zap, Brain } from 'lucide-react';
import { OrbLoader } from '../components/OrbLoader';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await login(email, password);
            setAuth(data);
            navigate('/home');
        } catch (err: any) {
            setError(err.message || 'Login failed');
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
                {/* Decorative circles */}
                <div style={{
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                    top: '-100px',
                    right: '-100px',
                }} />
                <div style={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(201, 106, 53, 0.08) 0%, transparent 70%)',
                    bottom: '-50px',
                    left: '-50px',
                }} />

                <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    {/* Orb Loader as decorative centerpiece */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                        <OrbLoader size={1.3} />
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        marginBottom: '2rem',
                    }}>
                        <Code2 size={40} style={{ color: 'var(--accent-burnt-orange)' }} />
                        <span style={{
                            fontSize: '2.5rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, var(--accent-burnt-orange), var(--accent-earth-green))',
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
                        Master Data Structures & Algorithms with an AI tutor that guides your thinking — not gives you answers.
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '2rem',
                        marginTop: '2.5rem',
                        justifyContent: 'center',
                    }}>
                        {[
                            { label: 'Socratic Method', value: <Target size={24} color="var(--accent-amber)" /> },
                            { label: 'Code Execution', value: <Zap size={24} color="var(--accent-burnt-orange)" /> },
                            { label: 'AI Powered', value: <Brain size={24} color="var(--accent-earth-green)" /> },
                        ].map((item) => (
                            <div key={item.label} style={{ textAlign: 'center' }}>
                                <div style={{ marginBottom: '0.25rem' }}>{item.value}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.label}</div>
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
                <div className="animate-slide-up" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                            width: '100%',
                            maxWidth: '400px'
                        }}>
                            <AlertCircle size={16} />
                            {error.toString()}
                        </div>
                    )}

                    <form className="uiverse-form" onSubmit={handleSubmit}>
                        <p>
                            Welcome,<span>sign in to continue</span>
                        </p>
                        
                        <button 
                            type="button" 
                            className="uiverse-oauthButton"
                            disabled={loading}
                            onClick={async () => {
                                setLoading(true);
                                setError('');
                                try {
                                    const data = await signInWithGoogle();
                                    setAuth(data);
                                    navigate('/home');
                                } catch (err: any) {
                                    setError(err.message || 'Google Sign-In failed');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            <svg className="icon" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                <path d="M1 1h22v22H1z" fill="none"></path>
                            </svg>
                            Continue with Google
                        </button>
                        
                        <button 
                            type="button" 
                            className="uiverse-oauthButton"
                            onClick={() => setError('GitHub Login is not configured yet. Please use Google or Email.')}
                        >
                            <svg className="icon" viewBox="0 0 24 24" fill="var(--text-primary)">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                            </svg>
                            Continue with Github
                        </button>
                        
                        <div className="uiverse-separator">
                            <div></div>
                            <span>OR</span>
                            <div></div>
                        </div>
                        
                        <input 
                            type="email" 
                            placeholder="Email" 
                            name="email" 
                            className="uiverse-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                        
                        <input 
                            type="password" 
                            placeholder="Password" 
                            name="password" 
                            className="uiverse-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                        
                        <button type="submit" className="uiverse-oauthButton email-btn" disabled={loading}>
                            {loading ? 'Continuing...' : 'Continue'}
                            {!loading && (
                                <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 17 5-5-5-5"></path><path d="m13 17 5-5-5-5"></path></svg>
                            )}
                        </button>
                        
                        <p style={{
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            color: 'var(--text-muted)',
                            marginTop: '10px'
                        }}>
                            Don't have an account?{' '}
                            <Link to="/register" style={{
                                color: 'var(--accent-burnt-orange)',
                                textDecoration: 'none',
                                fontWeight: 700,
                            }}>Create one</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
