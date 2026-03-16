import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { sendMessage } from '../services/conversationService';
import { AILoader } from '../components/AILoader';

interface ChatInterfaceProps {
    problemId?: string;
    code?: string;
    language?: string;
}

export const ChatInterface = ({ problemId, code, language }: ChatInterfaceProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | undefined>(undefined);
    const [selectedModel, setSelectedModel] = useState<'groq' | 'ollama'>('groq');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const { message, conversationId: newConvId } = await sendMessage(input, problemId, conversationId, selectedModel, code, language);
            setConversationId(newConvId);
            setMessages((prev) => [...prev, message]);
        } catch (error) {
            console.error('Failed to send message', error);
            setMessages((prev) => [...prev, {
                id: 'err-' + Date.now(),
                role: 'assistant',
                content: 'Sorry, something went wrong. Please try again.',
                createdAt: new Date().toISOString(),
            }]);
        } finally {
            setLoading(false);
        }
    };

    // Simple markdown renderer for bold, code, lists
    const renderContent = (content: string) => {
        const lines = content.split('\n');
        return lines.map((line, i) => {
            // Bold
            let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-primary);font-weight:600">$1</strong>');
            // Inline code
            processed = processed.replace(/`([^`]+)`/g, '<code style="background:var(--bg-primary);padding:0.1em 0.35em;border-radius:4px;font-family:JetBrains Mono,monospace;font-size:0.85em;color:#e2e8f0">$1</code>');
            // List items
            if (processed.match(/^[\-\*]\s/)) {
                processed = '• ' + processed.substring(2);
            }

            return <span key={i} dangerouslySetInnerHTML={{ __html: processed + (i < lines.length - 1 ? '<br/>' : '') }} />;
        });
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
        }}>
            {/* Header */}
            <div style={{
                padding: '1rem',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'rgba(234, 230, 223, 0.03)',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '100px' }}>
                    <Sparkles size={18} style={{ color: 'var(--accent-burnt-orange)' }} />
                    <span style={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: 'var(--text-primary)',
                    }}>AI Tutor</span>
                </div>

                {/* Model Selector Pill Toggle */}
                <div style={{
                    display: 'flex',
                    background: 'var(--bg-primary)',
                    borderRadius: '9999px',
                    padding: '3px',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-3d-in)',
                    gap: '2px',
                }}>
                    {(['groq', 'ollama'] as const).map((m) => (
                        <button
                            key={m}
                            onClick={() => setSelectedModel(m)}
                            style={{
                                padding: '0.2rem 0.7rem',
                                borderRadius: '9999px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                transition: 'all 0.2s ease',
                                background: selectedModel === m
                                    ? m === 'groq' ? '#f97316' : '#22c55e'
                                    : 'transparent',
                                color: selectedModel === m ? '#fff' : 'var(--text-muted)',
                                boxShadow: selectedModel === m ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                            }}
                        >
                            {m === 'groq' ? '⚡ Groq' : '🦙 Ollama'}
                        </button>
                    ))}
                </div>

                <span style={{
                    fontSize: '0.7rem',
                    padding: '0.1rem 0.6rem',
                    borderRadius: '9999px',
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                    fontWeight: 500,
                    boxShadow: 'var(--shadow-3d-in)',
                }}>Socratic</span>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
            }}>
                {messages.length === 0 && (
                    <div className="animate-fade-in" style={{
                        textAlign: 'center',
                        marginTop: '1rem',
                        padding: '0.5rem',
                    }}>
                        <div className="clay-card" style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem',
                            background: 'var(--bg-elevated)',
                        }}>
                            <Bot size={24} style={{ color: 'var(--accent-earth-green)' }} />
                        </div>
                        <p style={{
                            color: 'var(--text-primary)',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            marginBottom: '0.35rem',
                        }}>Hi! I'm your AI Tutor</p>
                        <p style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.8rem',
                            lineHeight: 1.5,
                        }}>I'll guide your thinking with questions and hints. I won't give you the answer unless you really need it!</p>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            marginTop: '1.25rem',
                        }}>
                            {['How should I approach this problem?', "What data structure should I use?", "I'm stuck, can you give me a hint?"].map((q) => (
                                <button
                                    key={q}
                                    className="clay-card card-hover"
                                    onClick={() => { setInput(q); }}
                                    style={{
                                        padding: '0.55rem 0.85rem',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        border: 'none',
                                    }}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={msg.role === 'user' ? 'animate-slide-right' : 'animate-slide-left'}
                        style={{
                            display: 'flex',
                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        }}
                    >
                        <div style={{
                            maxWidth: '90%',
                            display: 'flex',
                            gap: '0.75rem',
                            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                            alignItems: 'flex-start',
                        }}>
                            {/* Avatar */}
                            <div className="clay-inset" style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                background: 'var(--bg-elevated)',
                            }}>
                                {msg.role === 'user' 
                                    ? <User size={16} style={{ color: 'var(--accent-burnt-orange)' }} /> 
                                    : <Bot size={16} style={{ color: 'var(--accent-earth-green)' }} />}
                            </div>

                            {/* Bubble */}
                            <div className={msg.role === 'user' ? 'clay-card' : 'clay-inset'} style={{
                                padding: '0.85rem 1.15rem',
                                borderRadius: msg.role === 'user'
                                    ? 'var(--radius-lg) var(--radius-lg) 4px var(--radius-lg)'
                                    : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) 4px',
                                background: msg.role === 'user'
                                    ? 'var(--accent-burnt-orange)'
                                    : 'var(--bg-input)',
                                color: msg.role === 'user' ? '#FFF2E8' : 'var(--text-primary)',
                                fontSize: '0.9rem',
                                lineHeight: 1.6,
                                boxShadow: msg.role === 'user' ? 'var(--shadow-3d-out)' : 'var(--shadow-3d-in)',
                            }}>
                                {msg.role === 'user' ? msg.content : <div className="prose-dark">{renderContent(msg.content)}</div>}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                    <div className="animate-slide-left" style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                    }}>
                        <div className="clay-inset" style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            background: 'var(--bg-elevated)',
                        }}>
                            <Bot size={16} style={{ color: 'var(--accent-earth-green)' }} />
                        </div>
                        <div style={{ marginLeft: '-2.5rem', marginTop: '-1rem' }}>
                            <AILoader />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} style={{
                padding: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                background: 'rgba(234, 230, 223, 0.03)',
                display: 'flex',
                gap: '0.75rem',
            }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="input-field"
                    disabled={loading}
                    style={{ flex: 1, padding: '0.85rem 1.15rem' }}
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="btn-primary"
                    style={{
                        padding: '0.6em 1em',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 'var(--radius-md)',
                    }}
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};
