import './TorchCheckbox.css';

interface TorchCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
}

export const TorchCheckbox = ({ checked, onChange, label = 'Light Torch' }: TorchCheckboxProps) => {
    return (
        <label className="torch-container" style={{ margin: '0', padding: '0' }}>
            <div className="simple-text">{label}</div>
            <input 
                type="checkbox" 
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <div className="checkmark"></div>
            <div className="torch">
                <div className="head">
                    <div className="face top">
                        <div></div><div></div><div></div><div></div>
                    </div>
                    <div className="face left">
                        <div></div><div></div><div></div><div></div>
                    </div>
                    <div className="face right">
                        <div></div><div></div><div></div><div></div>
                    </div>
                </div>
                <div className="stick">
                    <div className="side side-left">
                        {Array.from({ length: 16 }).map((_, i) => <div key={i}></div>)}
                    </div>
                    <div className="side side-right">
                        {Array.from({ length: 16 }).map((_, i) => <div key={i}></div>)}
                    </div>
                </div>
            </div>
        </label>
    );
};
