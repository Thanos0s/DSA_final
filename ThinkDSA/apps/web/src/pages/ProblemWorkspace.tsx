import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getProblem } from '../services/problemService';
import { runCode } from '../services/executionService';
import { Problem, ExecutionResult } from '../types';
import { ChatInterface } from '../components/ChatInterface';
import Editor from '@monaco-editor/react';
import {
    Play,
    Terminal,
    FileCode,
    X,
    Loader2,
    Sparkles,
} from 'lucide-react';
import { PageLoader } from '../components/PageLoader';
import { AlgoVisualizer } from '../components/AlgoVisualizer';
import { fetchAlgoVisualization, AlgoVisualization } from '../services/algoService';

const DEFAULT_CODE: Record<string, string> = {
    python: `# Write your solution here
def solve():
    pass

solve()
`,
    javascript: `// Write your solution here
function solve() {
    
}

solve();
`,
};

// Resizer handle between panels (hidden on mobile via CSS class)
const Resizer = ({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) => (
    <div
        className="panel-resizer"
        onMouseDown={onMouseDown}
        style={{
            width: '6px',
            cursor: 'col-resize',
            background: 'transparent',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,106,53,0.35)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
        <div style={{
            width: '2px',
            height: '40px',
            borderRadius: '2px',
            background: 'var(--border-subtle)',
            pointerEvents: 'none',
        }} />
    </div>
);

export const ProblemWorkspace = () => {
    const { slug } = useParams<{ slug: string }>();
    const [problem, setProblem] = useState<Problem | null>(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState<'python' | 'javascript'>('python');
    const [code, setCode] = useState(DEFAULT_CODE.python);
    const [running, setRunning] = useState(false);
    const [result, setResult] = useState<ExecutionResult | null>(null);
    const [showOutput, setShowOutput] = useState(false);
    const [customInput, setCustomInput] = useState('');
    const [visualization, setVisualization] = useState<AlgoVisualization | null>(null);
    const [algoLoading, setAlgoLoading] = useState(false);
    const [showVisualizer, setShowVisualizer] = useState(false);
    const [algoError, setAlgoError] = useState<string | null>(null);

    // Panel widths as percentages (problem | editor | chat)
    const [panelWidths, setPanelWidths] = useState([28, 42, 30]);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragging = useRef<{ index: number; startX: number; startWidths: number[] } | null>(null);

    const startResize = useCallback((index: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        dragging.current = { index, startX: e.clientX, startWidths: [...panelWidths] };
    }, [panelWidths]);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!dragging.current || !containerRef.current) return;
            const { index, startX, startWidths } = dragging.current;
            const containerWidth = containerRef.current.offsetWidth;
            const deltaPct = ((e.clientX - startX) / containerWidth) * 100;
            const newWidths = [...startWidths];
            const minPct = 15;
            newWidths[index] = Math.max(minPct, startWidths[index] + deltaPct);
            newWidths[index + 1] = Math.max(minPct, startWidths[index + 1] - deltaPct);
            // Clamp so total stays ~100
            const total = newWidths.reduce((a, b) => a + b, 0);
            setPanelWidths(newWidths.map(w => (w / total) * 100));
        };
        const onMouseUp = () => { dragging.current = null; };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    const handleVisualizeAlgo = async () => {
        if (!problem) return;
        setShowVisualizer(true);
        if (visualization) return;
        setAlgoLoading(true);
        setAlgoError(null);
        try {
            const data = await fetchAlgoVisualization(problem.id);
            setVisualization(data);
        } catch (e: any) {
            console.error('Failed to visualize algo', e);
            const status = e?.response?.status;
            if (status === 401) {
                setAlgoError('Session expired. Please log out and log in again to use this feature.');
            } else {
                setAlgoError('Failed to generate visualization. Please try again.');
            }
        } finally {
            setAlgoLoading(false);
        }
    };

    useEffect(() => {
        const fetchProblem = async () => {
            if (!slug) return;
            try {
                const data = await getProblem(slug);
                setProblem(data);
                const inputMatch = data.statement.match(/Input:\s*(.*?)\n/i);
                if (inputMatch && inputMatch[1]) {
                    let cleanInput = inputMatch[1]
                        .replace(/[a-zA-Z_]+\s*=\s*/g, '')
                        .replace(/[[\]",]/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
                    if (!cleanInput) cleanInput = inputMatch[1];
                    setCustomInput(cleanInput);
                }
            } catch (error) {
                console.error('Failed to fetch problem', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [slug]);

    const handleRun = async () => {
        setRunning(true);
        setResult(null);
        setShowOutput(true);
        try {
            const res = await runCode(language, code, customInput);
            setResult(res);
        } catch (error) {
            setResult({ stdout: '', stderr: 'Failed to execute code. Please try again.' });
        } finally {
            setRunning(false);
        }
    };

    const handleLanguageChange = (lang: 'python' | 'javascript') => {
        setLanguage(lang);
        setCode(DEFAULT_CODE[lang]);
    };

    const renderProblemStatement = (statement: string) => {
        const lines = statement.split('\n');
        return lines.map((line, i) => {
            if (line.startsWith('# ')) {
                return <h1 key={i} style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.75rem 0 0.5rem' }}>{line.substring(2)}</h1>;
            }
            if (line.startsWith('## ')) {
                return <h2 key={i} style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '1rem 0 0.35rem' }}>{line.substring(3)}</h2>;
            }
            if (line.startsWith('```')) return null;
            if (line.trim() === '') return <br key={i} />;
            let processed = line.replace(/`([^`]+)`/g, '<code style="background:var(--bg-primary);padding:0.1em 0.35em;border-radius:4px;font-family:JetBrains Mono,monospace;font-size:0.85em;color:#e2e8f0">$1</code>');
            processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>');
            processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
            return <p key={i} style={{ margin: '0.25rem 0', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: processed }} />;
        });
    };

    if (loading) return <PageLoader />;

    if (!problem) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)' }}>
                Problem not found
            </div>
        );
    }

    const getDifficultyClass = (d: string) => {
        if (d === 'Easy') return 'badge-easy';
        if (d === 'Medium') return 'badge-medium';
        return 'badge-hard';
    };

    return (
        <>
        <div
            ref={containerRef}
            className="mobile-col mobile-h-auto mobile-p-small"
            style={{
                display: 'flex',
                height: 'calc(100vh - 60px)',
                overflow: 'hidden',
                background: 'var(--bg-primary)',
                padding: '1rem',
                gap: '0',
                boxSizing: 'border-box',
                userSelect: dragging.current ? 'none' : 'auto',
            }}
        >
            {/* Problem Panel */}
            <div className="clay-panel workspace-panel-problem" style={{
                width: `${panelWidths[0]}%`,
                minWidth: '180px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                flexShrink: 0,
            }}>
                <div style={{
                    padding: '1rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    background: 'rgba(234, 230, 223, 0.03)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileCode size={18} style={{ color: 'var(--accent-burnt-orange)' }} />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Problem Description</span>
                    </div>
                    {problem.difficulty !== 'Easy' && (
                        <button
                            onClick={handleVisualizeAlgo}
                            disabled={algoLoading}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.3rem 0.75rem',
                                borderRadius: '999px',
                                border: '1.5px solid rgba(201, 106, 53, 0.4)',
                                background: 'rgba(201, 106, 53, 0.1)',
                                color: 'var(--accent-burnt-orange)',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                cursor: algoLoading ? 'wait' : 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease',
                                flexShrink: 0,
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,106,53,0.22)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(201,106,53,0.1)')}
                        >
                            <Sparkles size={12} />
                            {algoLoading ? 'Generating…' : 'Visualize Algo'}
                        </button>
                    )}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <span className={getDifficultyClass(problem.difficulty)} style={{ padding: '0.2rem 0.7rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>{problem.difficulty}</span>
                            <span style={{ padding: '0.2rem 0.7rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500, background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>{problem.topic}</span>
                        </div>
                        <div className="prose-dark" style={{ fontSize: '0.9rem' }}>
                            {renderProblemStatement(problem.statement)}
                        </div>
                    </div>
                </div>
            </div>

            <Resizer onMouseDown={startResize(0)} />

            {/* Editor Panel */}
            <div className="clay-panel workspace-panel-editor" style={{
                width: `${panelWidths[1]}%`,
                minWidth: '220px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                flexShrink: 0,
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1.25rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: 'rgba(234, 230, 223, 0.03)',
                }}>
                    <div className="clay-inset" style={{ display: 'flex', gap: '0.25rem', padding: '0.25rem', borderRadius: 'var(--radius-lg)' }}>
                        {(['python', 'javascript'] as const).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => handleLanguageChange(lang)}
                                style={{
                                    padding: '0.35rem 0.85rem',
                                    borderRadius: 'calc(var(--radius-lg) - 4px)',
                                    border: 'none',
                                    background: language === lang ? 'var(--bg-elevated)' : 'transparent',
                                    color: language === lang ? 'var(--text-primary)' : 'var(--text-muted)',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-fast)',
                                    fontFamily: "'JetBrains Mono', monospace",
                                    boxShadow: language === lang ? 'var(--shadow-3d-out)' : 'none',
                                }}
                            >
                                {lang === 'python' ? 'Python' : 'JavaScript'}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleRun}
                        disabled={running}
                        className="btn-success"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1.25rem', borderRadius: '9999px' }}
                    >
                        {running ? (
                            <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Running...</>
                        ) : (
                            <><Play size={15} /> Run Code</>
                        )}
                    </button>
                </div>

                <div style={{ flex: showOutput ? 0.65 : 1, minHeight: 0, transition: 'flex var(--transition-base)', padding: '1rem' }}>
                    <div className="clay-inset" style={{ height: '100%', overflow: 'hidden' }}>
                        <Editor
                            height="100%"
                            language={language}
                            value={code}
                            theme="vs-dark"
                            onChange={(value) => setCode(value || '')}
                            options={{
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', monospace",
                                padding: { top: 16, bottom: 16 },
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                lineNumbersMinChars: 3,
                                renderLineHighlight: 'all',
                                smoothScrolling: true,
                                cursorBlinking: 'smooth',
                                cursorSmoothCaretAnimation: 'on',
                            }}
                        />
                    </div>
                </div>

                {showOutput && (
                    <div className="animate-slide-up" style={{
                        flex: 0.35,
                        borderTop: '1px solid var(--border-subtle)',
                        background: 'rgba(234, 230, 223, 0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>
                                <Terminal size={14} />
                                Output
                            </div>
                            <button onClick={() => setShowOutput(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem', borderRadius: '4px', display: 'flex' }}>
                                <X size={14} />
                            </button>
                        </div>
                        <div className="clay-inset" style={{ flex: 1, margin: '0.5rem', overflowY: 'auto', padding: '0.75rem 1rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', lineHeight: 1.6 }}>
                            {running ? (
                                <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                                    Executing...
                                </div>
                            ) : result ? (
                                <>
                                    {result.stdout && <pre style={{ margin: 0, color: '#34d399', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{result.stdout}</pre>}
                                    {result.stderr && <pre style={{ margin: result.stdout ? '0.5rem 0 0' : 0, color: '#f87171', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{result.stderr}</pre>}
                                    {!result.stdout && !result.stderr && <span style={{ color: 'var(--text-muted)' }}>No output</span>}
                                </>
                            ) : null}
                        </div>
                        <div style={{ padding: '0.5rem 1rem 0.5rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 500, marginBottom: '0.35rem' }}>
                                Custom Input (stdin)
                            </div>
                            <textarea
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                placeholder="Enter input here..."
                                className="clay-input"
                                style={{ width: '100%', minHeight: '60px', maxHeight: '120px', resize: 'vertical', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', padding: '0.5rem', borderRadius: '4px', background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <Resizer onMouseDown={startResize(1)} />

            {/* Chat Panel */}
            <div className="clay-panel workspace-panel-chat" style={{
                width: `${panelWidths[2]}%`,
                minWidth: '200px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                flexShrink: 0,
            }}>
                <ChatInterface problemId={problem.id} code={code} language={language} />
            </div>
        </div>

        {showVisualizer && (
            <AlgoVisualizer
                visualization={visualization}
                loading={algoLoading}
                error={algoError}
                onClose={() => setShowVisualizer(false)}
            />
        )}
        </>
    );
};
