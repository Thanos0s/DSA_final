import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { LogOut, Code2, User, Bot, Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Navbar = () => {
    const { user, logout } = useAuthStore();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Hide navbar on auth pages
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    if (isAuthPage) return null;

    return (
        <nav className="glass" style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: '1px solid var(--border-subtle)',
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 1.5rem',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <Link to="/home" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none',
                    color: 'inherit',
                }}>
                    <Code2 size={24} style={{ color: 'var(--accent-burnt-orange)' }} />
                    <span style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, var(--accent-burnt-orange), var(--accent-earth-green))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.02em',
                    }}>
                        ThinkDSA
                    </span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {user ? (
                        <>
                            <Link to="/profile" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.4rem 0.8rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border-subtle)',
                                textDecoration: 'none',
                                transition: 'all var(--transition-fast)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-focus)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-3d-out)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--accent-burnt-orange), var(--accent-earth-green))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <User size={14} color="white" />
                                </div>
                                <span className="mobile-hidden" style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--text-secondary)',
                                    fontWeight: 500,
                                }}>
                                    {user.name || user.email}
                                </span>
                            </Link>

                            <div className="mobile-hidden" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.2rem 0.6rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'transparent',
                                border: '1px solid var(--border-default)',
                                color: 'var(--text-secondary)',
                                transition: 'all var(--transition-fast)',
                            }}>
                                <Palette size={14} style={{ color: 'var(--text-muted)' }} />
                                <select 
                                    value={theme} 
                                    onChange={(e) => setTheme(e.target.value as 'earthy' | 'ocean' | 'cyber')}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.85rem',
                                        outline: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <option value="earthy" style={{ background: 'var(--bg-primary)' }}>Earthy Theme</option>
                                    <option value="ocean" style={{ background: 'var(--bg-primary)' }}>Deep Ocean</option>
                                    <option value="cyber" style={{ background: 'var(--bg-primary)' }}>Cyber Clay</option>
                                </select>
                            </div>

                            <Link to="/chat" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.4rem 0.8rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'transparent',
                                border: '1px solid var(--border-default)',
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                fontSize: '0.85rem',
                                transition: 'all var(--transition-fast)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--accent-earth-green)';
                                e.currentTarget.style.color = 'var(--accent-earth-green)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-default)';
                                e.currentTarget.style.color = 'var(--text-secondary)';
                            }}>
                                <Bot size={14} />
                                <span className="mobile-hidden">Tutor Mode</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'transparent',
                                    border: '1px solid var(--border-default)',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    transition: 'all var(--transition-fast)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--accent-red)';
                                    e.currentTarget.style.color = 'var(--accent-red)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border-default)';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                }}
                            >
                                <LogOut size={14} />
                                <span className="mobile-hidden">Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                transition: 'color var(--transition-fast)',
                            }}>Login</Link>
                            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
