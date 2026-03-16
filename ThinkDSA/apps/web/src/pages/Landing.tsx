import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { useEffect, useRef, useState } from 'react';

const useScrollReveal = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return { ref, isVisible };
};

export const Landing = () => {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="dark min-h-screen selection:bg-primary/30" style={{ fontFamily: "'Inter', sans-serif", background: '#0A0A0C', color: '#FBE4D8' }}>

            <style>{`
                @font-face { font-family: 'Outfit'; src: url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap'); }
                
                .font-outfit { font-family: 'Outfit', sans-serif; }

                @keyframes orb-float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }

                @keyframes reveal-up {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .reveal { opacity: 0; }
                .reveal-active { animation: reveal-up 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }

                .bento-card {
                    background: rgba(22, 22, 25, 0.4);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(133, 79, 108, 0.2);
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .bento-card:hover {
                    border-color: rgba(133, 79, 108, 0.6);
                    background: rgba(26, 26, 30, 0.6);
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 20px rgba(133, 79, 108, 0.1);
                }

                .glow-mesh {
                    background-image: radial-gradient(circle at 2px 2px, rgba(133, 79, 108, 0.1) 1px, transparent 0);
                    background-size: 32px 32px;
                }

                .hero-gradient-text {
                    background: linear-gradient(135deg, #FBE4D8 30%, #DFB6B2 60%, #854F6C 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .magnetic-btn {
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                .magnetic-btn::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(251, 228, 216, 0.1), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.6s ease;
                }

                .magnetic-btn:hover::after {
                    transform: translateX(100%);
                }
            `}</style>

            {/* ─── Immersive Background Orbs ─── */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-[0.12] blur-[120px]" 
                     style={{ background: '#854F6C', animation: 'orb-float 15s infinite ease-in-out' }} />
                <div className="absolute bottom-[5%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[100px]" 
                     style={{ background: '#522B5B', animation: 'orb-float 18s infinite ease-in-out reverse' }} />
                <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[80px]" 
                     style={{ background: '#DFB6B2', animation: 'orb-float 20s infinite linear' }} />
                <div className="absolute inset-0 glow-mesh opacity-20" />
            </div>

            {/* ─── Navbar ─── */}
            <nav className="fixed top-0 w-full z-50 transition-all duration-300" 
                 style={{ background: 'rgba(10, 10, 12, 0.7)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(133, 79, 108, 0.1)' }}>
                <div className="flex justify-between items-center px-10 py-5 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" 
                             style={{ background: 'linear-gradient(135deg, #854F6C, #522B5B)', boxShadow: '0 8px 16px -4px rgba(133, 79, 108, 0.4)' }}>
                            <span className="material-symbols-outlined text-white text-base">psychology</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter font-outfit" style={{ color: '#FBE4D8' }}>ThinkDSA</span>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-10">
                        {['Features', 'Intelligence', 'Workspace'].map(item => (
                            <a key={item} href={`#${item.toLowerCase()}`}
                               className="text-sm font-medium tracking-tight transition-all duration-300 hover:text-primary relative group"
                               style={{ color: '#DFB6B2' }}>
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full" />
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/login')}
                                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-white/5"
                                style={{ color: '#DFB6B2' }}>Sign In</button>
                        <button onClick={() => navigate('/register')} 
                                className="magnetic-btn px-7 py-2.5 rounded-xl text-sm font-bold shadow-2xl"
                                style={{ background: '#854F6C', color: '#FBE4D8' }}>
                            Join Waitlist
                        </button>
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                {/* ─── Hero Section ─── */}
                <section className="min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
                    <div className="max-w-4xl mx-auto text-center" style={{ animation: 'reveal-up 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-10" 
                             style={{ background: 'rgba(133, 79, 108, 0.1)', border: '1px solid rgba(133, 79, 108, 0.3)' }}>
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#FBE4D8' }}>Powered by Anthropic Claude 3.5</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black font-outfit tracking-tight leading-[0.95] mb-8 hero-gradient-text">
                            Transcend <br /> Algorithmic Limit
                        </h1>

                        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed" style={{ color: '#DFB6B2' }}>
                            ThinkDSA is your cognitive accelerator. A Socratic AI mentor that doesn't just solve problems—it rewires how you think.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button onClick={() => navigate('/register')}
                                    className="magnetic-btn w-full sm:w-auto px-12 py-5 font-black rounded-2xl text-lg shadow-2xl transition-all active:scale-95"
                                    style={{ background: '#FBE4D8', color: '#0A0A0C' }}>
                                Start Accelerated Learning
                            </button>
                            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full sm:w-auto px-10 py-5 font-bold rounded-2xl flex items-center justify-center gap-3 border transition-all hover:bg-white/5 active:scale-95"
                                    style={{ color: '#FBE4D8', borderColor: 'rgba(251, 228, 216, 0.2)' }}>
                                Explore Intelligence
                                <span className="material-symbols-outlined text-xl">south</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* ─── Bento Features ─── */}
                <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px]">
                        
                        {/* Featured: Socratic AI */}
                        <div className="md:col-span-8 bento-card rounded-[32px] p-10 flex flex-col justify-end">
                            <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(at 100% 0%, #854F6C 0%, transparent 50%)' }} />
                            <div className="relative z-10 max-w-lg">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8" style={{ background: 'rgba(133, 79, 108, 0.2)', border: '1px solid rgba(133, 79, 108, 0.3)' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#854F6C', fontSize: '28px' }}>neurology</span>
                                </div>
                                <h3 className="text-4xl font-black font-outfit mb-6" style={{ color: '#FBE4D8' }}>Cognitive Nudge Engine</h3>
                                <p className="text-lg leading-relaxed mb-10" style={{ color: '#DFB6B2' }}>
                                    Instead of spoilers, ThinkDSA identifies the exact gap in your logic and asks the specific question required to bridge it.
                                </p>
                                <div className="flex gap-4">
                                    <div className="h-[2px] w-20 bg-primary/30 mt-4 rounded-full" />
                                    <div className="italic font-mono text-sm" style={{ color: '#854F6C' }}>
                                        "I noticed you're iterating from the start. What if the optimal solution lies in the relationship between both ends?"
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary: Live Runtime */}
                        <div className="md:col-span-4 bento-card rounded-[32px] p-10 flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8" style={{ background: 'rgba(223, 182, 178, 0.1)', border: '1px solid rgba(223, 182, 178, 0.2)' }}>
                                <span className="material-symbols-outlined text-2xl" style={{ color: '#DFB6B2' }}>terminal</span>
                            </div>
                            <h3 className="text-2xl font-black font-outfit mb-4" style={{ color: '#FBE4D8' }}>Polyglot Runtime</h3>
                            <p className="text-sm leading-relaxed mb-auto" style={{ color: '#DFB6B2' }}>
                                Zero-latency execution for Python and JS. Profile memory and time complexity in real-time.
                            </p>
                            <div className="w-full mt-10 rounded-2xl border aspect-[4/3] flex flex-col text-left overflow-hidden bg-black/40" style={{ borderColor: 'rgba(133, 79, 108, 0.15)' }}>
                                <div className="h-4 w-full bg-white/5 flex gap-1 px-3 items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                                </div>
                                <div className="p-4 font-mono text-[10px] leading-relaxed" style={{ color: '#DFB6B2' }}>
                                    <div><span className="text-primary">import</span> profile</div>
                                    <div className="opacity-50 mt-1"># Analyzing space complexity...</div>
                                    <div className="text-primary mt-2">Peak RAM: 14.2MB</div>
                                    <div className="text-primary">Exec Time: 42ms</div>
                                </div>
                            </div>
                        </div>

                        {/* Tertiary: Visual Intelligence */}
                        <div className="md:col-span-12 bento-card rounded-[32px] p-12 flex flex-col md:flex-row items-center gap-16 overflow-hidden">
                             <div className="flex-1">
                                <h3 className="text-4xl font-black font-outfit mb-6" style={{ color: '#FBE4D8' }}>Visual Memory Projection</h3>
                                <p className="text-lg leading-relaxed" style={{ color: '#DFB6B2' }}>
                                    Watch your code manifest as a dynamic 3D graph. Visualize depth-first traversals, heap mutations, and pointer movements as they happen.
                                </p>
                             </div>
                             <div className="flex-1 relative w-full h-full min-h-[300px] flex items-center justify-center">
                                <div className="relative w-64 h-64">
                                    {/* Simulated Node Visual */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-4 border-primary bg-primary/10 flex items-center justify-center font-black text-2xl" 
                                         style={{ boxShadow: '0 0 60px rgba(133, 79, 108, 0.4)', color: '#FBE4D8' }}>7</div>
                                    <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-2 border-white/10 bg-white/5 flex items-center justify-center opacity-40">2</div>
                                    <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full border-2 border-white/10 bg-white/5 flex items-center justify-center opacity-40">9</div>
                                    <div className="absolute top-10 right-4 w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center opacity-20">4</div>
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                                        <line x1="50%" y1="50%" x2="15%" y2="15%" stroke="white" strokeWidth="2" />
                                        <line x1="50%" y1="50%" x2="85%" y2="85%" stroke="white" strokeWidth="2" />
                                    </svg>
                                </div>
                             </div>
                        </div>

                    </div>
                </section>

                {/* ─── Intelligence Section ─── */}
                <section id="intelligence" className="py-40 px-6">
                    <div className="max-w-7xl mx-auto text-center mb-32">
                        <h2 className="text-5xl md:text-7xl font-black font-outfit mb-8" style={{ color: '#FBE4D8' }}>Algorithmic DNA.</h2>
                        <p className="text-xl max-w-2xl mx-auto opacity-70">Your progress, quantified through logical consistency, spatial reasoning, and optimization intuition.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                        {[
                            { icon: 'share_reviews', title: 'Spatial Reasoning', score: 'Level 14' },
                            { icon: 'speed', title: 'Optimization Velocity', score: 'Top 2%' },
                            { icon: 'grid_view', title: 'Pattern Recognition', score: 'Platinum' }
                        ].map((metric, i) => (
                            <div key={i} className="bento-card rounded-3xl p-8 flex flex-col items-center">
                                <span className="material-symbols-outlined mb-6 text-primary text-4xl">{metric.icon}</span>
                                <h4 className="text-xl font-bold mb-2 uppercase tracking-tight" style={{ color: '#FBE4D8' }}>{metric.title}</h4>
                                <div className="text-3xl font-black hero-gradient-text">{metric.score}</div>
                                <div className="w-full h-1.5 bg-white/5 mt-8 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${80 - i * 15}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                
                {/* ─── Final CTA ─── */}
                <section className="py-40 px-6">
                    <div className="max-w-5xl mx-auto rounded-[48px] p-20 text-center relative overflow-hidden group"
                         style={{ background: 'linear-gradient(145deg, #111114, #070709)', border: '1px solid rgba(133, 79, 108, 0.3)' }}>
                        
                        <div className="absolute inset-0 opacity-[0.03] transition-opacity group-hover:opacity-[0.05]" 
                             style={{ background: 'radial-gradient(circle at center, #854F6C 0%, transparent 70%)' }} />
                        
                        <h2 className="text-5xl md:text-7xl font-black font-outfit mb-10 hero-gradient-text">
                            Don't just code. <br /> Architect.
                        </h2>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                            <button onClick={() => navigate('/register')}
                                    className="magnetic-btn w-full sm:w-auto px-16 py-6 font-black rounded-2xl text-xl shadow-2xl transition-all active:scale-95"
                                    style={{ background: '#854F6C', color: '#FBE4D8' }}>
                                Start Free Path
                            </button>
                            <div className="text-left">
                                <p className="text-sm font-medium" style={{ color: '#DFB6B2' }}>Legacy mindset ends here.</p>
                                <p className="text-xs opacity-40">Join 12k+ engineers scaling their thinking.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-20 px-10 border-t" style={{ borderColor: 'rgba(133, 79, 108, 0.1)', background: '#070709' }}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
                    <div className="max-w-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#854F6C' }}>
                                <span className="material-symbols-outlined text-white text-xs">psychology</span>
                            </div>
                            <span className="text-2xl font-black font-outfit" style={{ color: '#FBE4D8' }}>ThinkDSA</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-10" style={{ color: '#DFB6B2' }}>
                            The next evolution of technical preparation. Built for those who build the future.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-20">
                        {['Platform', 'Intelligence', 'Company'].map(cat => (
                            <div key={cat}>
                                <h5 className="text-[10px] font-black uppercase tracking-widest mb-8" style={{ color: '#854F6C' }}>{cat}</h5>
                                <ul className="space-y-4">
                                    {['Overview', 'Security', 'Enterprise', 'Terms'].slice(0, 4).map(item => (
                                        <li key={item} className="text-sm font-medium cursor-pointer transition-colors hover:text-white" style={{ color: '#9E7A8A' }}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};
