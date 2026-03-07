import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout = () => {
    const location = useLocation();
    const isWorkspace = location.pathname.startsWith('/problem/');
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-primary)',
        }}>
            <Navbar />
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                ...(isWorkspace ? {} : isAuthPage ? {} : {
                    maxWidth: '1400px',
                    width: '100%',
                    margin: '0 auto',
                    padding: '1.5rem',
                }),
            }}>
                <Outlet />
            </main>
        </div>
    );
};
