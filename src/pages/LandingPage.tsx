import { Play, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import AuthSlider from '../components/ui/AuthSlider';
import gsap from 'gsap';

export default function LandingPage() {
    const [authSliderOpen, setAuthSliderOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
    const rootRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });

            // 1. Fade in the background blobs first
            tl.from(".bg-blob", {
                opacity: 0,
                scale: 0.8,
                duration: 2,
                stagger: 0.2
            })
            // 2. Staggered entrance for text content
            .from(".animate-step", {
                y: 30,
                opacity: 0,
                stagger: 0.15,
            }, "-=1.5") // Overlay with previous animation for fluidity
            // 3. Slide in the visual asset from the right
            .from(".visual-asset", {
                x: 50,
                opacity: 0,
                duration: 1.2
            }, "-=1");
        }, rootRef);

        return () => ctx.revert(); // Cleanup to prevent memory leaks
    }, []);

    const handleStartCoding = () => {
        setAuthMode('signup');
        setAuthSliderOpen(true);
    };

    return (
        <div ref={rootRef}>
            <div className="min-h-screen lg:h-screen flex flex-col bg-slate-950 overflow-y-auto lg:overflow-hidden lg:no-scrollbar box-border relative">
                
                {/* Background Blobs - Added 'bg-blob' class */}
                <div className="bg-blob fixed top-[-20%] left-[-15%] w-[60%] h-[60%] bg-blue-500/30 rounded-full blur-[150px] pointer-events-none opacity-70" />
                <div className="bg-blob fixed bottom-[-20%] right-[-15%] w-[60%] h-[60%] bg-purple-500/30 rounded-full blur-[150px] pointer-events-none opacity-70" />

                <div className="h-16 w-full shrink-0" />

                <section className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
                    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-4">
                        
                        {/* Left Content */}
                        <div className="flex flex-col space-y-6 text-center lg:text-left p-6 rounded-xl">
                            {/* Added 'animate-step' to items we want staggered */}
                            <div className="animate-step inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 self-center lg:self-start w-fit">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-green-300 text-xs font-bold uppercase tracking-widest">Live Collaboration</span>
                            </div>

                            <h1 className="animate-step text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight text-white text-glow">
                                Code Together. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                    Build Faster.
                                </span>
                            </h1>

                            <p className="animate-step text-sm sm:text-base md:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 font-light">
                                The ultimate collaborative workspace. Pair program, run technical interviews, and learn with friends—all in real-time.
                            </p>

                            <div className="animate-step flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                                <button onClick={handleStartCoding} className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20">
                                    Start Coding <ArrowRight className="w-5 h-5" />
                                </button>
                                <button className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-800/40 hover:bg-slate-800/80 text-white font-medium border border-slate-700 flex items-center justify-center gap-2 transition-all">
                                    <Play className="w-5 h-5" /> Watch Demo
                                </button>
                            </div>
                        </div>

                        {/* Right Content - Visual Asset */}
                        <div className="visual-asset hidden lg:flex h-full min-h-[350px] max-h-[450px] rounded-2xl border border-purple-500/30 bg-slate-900/50 items-center justify-center relative overflow-hidden glass-panel">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10"></div>
                            <p className="text-slate-600 font-mono italic">{"<Visual Asset / Code Preview />"}</p>
                        </div>
                    </div>
                </section>

                <footer className="animate-step relative w-full h-16 flex items-center justify-center shrink-0 z-10">
                    <p className="text-slate-500 text-sm">© 2024 CodeCollab. All rights reserved.</p>
                </footer>
            </div>

            <AuthSlider 
                isOpen={authSliderOpen}
                onClose={() => setAuthSliderOpen(false)}
                initialMode={authMode}
            />
        </div>
    );
}