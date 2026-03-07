import './PageLoader.css';

export const PageLoader = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '30vh', width: '100%' }}>
        <div className="page-loader">
            <span className="page-loader-text">loading</span>
            <span className="page-load"></span>
        </div>
    </div>
);
