import './OrbLoader.css';

interface OrbLoaderProps {
    size?: number; /* CSS scale factor, default 1 = 100px */
}

export const OrbLoader = ({ size = 1 }: OrbLoaderProps) => {
    return (
        <div className="orb-loader" style={{ '--size': size } as React.CSSProperties}>
            <svg width="100" height="100" viewBox="0 0 100 100">
                <defs>
                    <mask id="orb-clipping">
                        <polygon points="0,0 100,0 100,100 0,100" fill="black" />
                        <polygon points="25,25 75,25 50,75" fill="white" />
                        <polygon points="50,25 75,75 25,75" fill="white" />
                        <polygon points="35,35 65,35 50,65" fill="white" />
                        <polygon points="35,35 65,35 50,65" fill="white" />
                        <polygon points="35,35 65,35 50,65" fill="white" />
                        <polygon points="35,35 65,35 50,65" fill="white" />
                    </mask>
                </defs>
            </svg>
            <div className="orb-box" />
        </div>
    );
};
