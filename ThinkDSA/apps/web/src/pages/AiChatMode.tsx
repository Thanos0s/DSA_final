import { ChatInterface } from '../components/ChatInterface';
import { Bot } from 'lucide-react';
import { useState } from 'react';
import { TorchCheckbox } from '../components/TorchCheckbox';

export const AiChatMode = () => {
    const [socraticMode, setSocraticMode] = useState(true);
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 61px)', // Account for navbar
            padding: '2rem',
            background: 'var(--bg-primary)',
        }}>
            <div className="clay-panel animate-fade-in" style={{
                width: '100%',
                maxWidth: '800px',
                height: '100%',
                minHeight: 'calc(100vh - 100px)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: 'var(--radius-xl)',
            }}>
                <div className="mobile-col" style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: 'var(--bg-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                }}>
                     <div className="clay-inset" style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--bg-input)',
                    }}>
                        <Bot size={24} style={{ color: 'var(--accent-earth-green)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            margin: 0,
                            lineHeight: 1.2,
                        }}>AI Tutor Workspace</h1>
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                            margin: 0,
                        }}>Ask complex DSA questions and get guided Socratic help.</p>
                    </div>
                    <div style={{ 
                        paddingRight: '1rem', 
                        paddingTop: '1rem',
                        alignSelf: 'stretch',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <TorchCheckbox checked={socraticMode} onChange={setSocraticMode} label={socraticMode ? "Socratic Mode" : "Direct Answers"} />
                    </div>
                </div>
                
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    {/* We pass a generic problemId if backend requires it, or undefined */}
                    <ChatInterface />
                </div>
            </div>
        </div>
    );
};
