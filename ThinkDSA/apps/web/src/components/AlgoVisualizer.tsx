import { useEffect } from 'react';
import { AlgoVisualization, AlgoStep } from '../services/algoService';
import { X, RotateCcw, GitBranch, ArrowDown, Circle, CornerDownRight } from 'lucide-react';
import './AlgoVisualizer.css';

interface AlgoVisualizerProps {
    visualization: AlgoVisualization | null;
    loading: boolean;
    error: string | null;
    onClose: () => void;
}

const TYPE_ICONS: Record<AlgoStep['type'], React.ReactNode> = {
    init:      <Circle size={16} />,
    loop:      <RotateCcw size={16} />,
    condition: <GitBranch size={16} />,
    process:   <CornerDownRight size={16} />,
    return:    <ArrowDown size={16} />,
};

const TYPE_LABELS: Record<AlgoStep['type'], string> = {
    init:      'Start',
    loop:      'Loop',
    condition: 'Branch',
    process:   'Process',
    return:    'End',
};

export const AlgoVisualizer = ({ visualization, loading, error, onClose }: AlgoVisualizerProps) => {
    // Close on Escape key
    useEffect(() => {
        const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handle);
        return () => window.removeEventListener('keydown', handle);
    }, [onClose]);

    // Prevent body scroll while open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return (
        <div
            className="algo-modal-backdrop"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="algo-modal">
                {/* ── Modal Header ── */}
                <div className="algo-modal-header">
                    <div className="algo-modal-title-group">
                        <span className="algo-modal-label">Algorithm Breakdown</span>
                        <h2 className="algo-modal-name">
                            {visualization?.title ?? 'Generating...'}
                        </h2>
                    </div>
                    <button className="algo-modal-close" onClick={onClose} aria-label="Close">
                        <X size={16} />
                    </button>
                </div>

                {/* ── Complexity Bar ── */}
                {visualization && (
                    <div className="algo-complexity-bar">
                        <span className="algo-complexity-label">Complexity:</span>
                        <span className="algo-badge algo-badge-time">
                            Time {visualization.complexity.time}
                        </span>
                        <span className="algo-badge algo-badge-space">
                            Space {visualization.complexity.space}
                        </span>
                    </div>
                )}

                {/* ── Body ── */}
                {loading && (
                    <div className="algo-loading-state">
                        <div className="algo-loading-dots">
                            <span /><span /><span />
                        </div>
                        <p>Generating algorithm visualization...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="algo-error-state">
                        <p>{error}</p>
                        {error.includes('log out') && (
                            <a href="/login" className="algo-error-link">Go to Login →</a>
                        )}
                    </div>
                )}

                {visualization && !loading && (
                    <div className="algo-visualizer">
                        <div className="algo-steps">
                            {visualization.steps.map((step, index) => (
                                <div
                                    key={step.id}
                                    style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                                >
                                    {/* Step card */}
                                    <div
                                        className="algo-step"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className={`algo-step-card shape-${step.type}`}>
                                            <div className="algo-step-icon">
                                                {TYPE_ICONS[step.type]}
                                            </div>
                                            <div className="algo-step-content">
                                                <p className="algo-step-title">{step.title}</p>
                                                <p className="algo-step-desc">{step.description}</p>
                                            </div>
                                            <span className="algo-step-type">
                                                {TYPE_LABELS[step.type]}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Connector */}
                                    {index < visualization.steps.length - 1 && (
                                        <div className="algo-connector">
                                            <div className="algo-connector-line" />
                                            <div className="algo-connector-arrow" />
                                            {step.type === 'loop' && (
                                                <span className="algo-loop-badge">↺ repeat</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
