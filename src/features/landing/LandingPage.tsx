import React, { useState, useEffect } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { MarketingLayout } from '../../components/ui/Layout';
import { useAuth } from '../auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from './sections/AuthModal';
import { FEATURES, FeatureVisual } from './sections/FeatureVisual';
import { FeaturesSection } from './sections/FeaturesSection';
import { PricingSection } from './sections/PricingSection';
import { CTABanner } from './sections/CTABanner';

export const LandingPage = () => {
    const [showAuth, setShowAuth] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isPaused || document.hidden) return;

        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % FEATURES.length);
        }, 4000);

        const handleVisibility = () => {
            setResetKey((k) => k + 1);
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [isPaused, resetKey]);

    const handleLogin = async (username: string, password?: string) => {
        await login(username, password);
        navigate('/dashboard');
    };

    return (
        <MarketingLayout onOpenAuth={() => setShowAuth(true)}>
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto px-6 gap-12 lg:gap-24 py-12 md:py-0 min-h-[calc(100vh-5rem)]">

                {/* Left Content */}
                <div className="flex-1 space-y-8 text-center md:text-left z-20 max-w-2xl">
                     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur text-blue-300 text-xs font-bold uppercase tracking-widest shadow-lg animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]"></span>
                        Live Collaboration Platform
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] text-glow">
                        <span className="block whitespace-nowrap">Code Together.</span>
                        <span className="block whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                            Build Faster.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed mx-auto md:mx-0 font-light">
                        The ultimate collaborative workspace. Pair program, run technical interviews, and learn with friends—all in real-time.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
                        <button
                            onClick={() => setShowAuth(true)}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-lg shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] transition transform hover:-translate-y-1 flex items-center justify-center gap-2 hover:brightness-110"
                        >
                            Start Coding <ArrowRight className="w-5 h-5" />
                        </button>
                         <button
                            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-bold text-lg backdrop-blur-sm transition flex items-center justify-center gap-2"
                        >
                            <Play className="w-4 h-4 fill-current" /> Watch Demo
                        </button>
                    </div>
                </div>

                {/* Right Visual / Carousel - Fixed Size Container to prevent layout shifts */}
                <div
                    className="flex-1 w-full max-w-[480px] h-[520px] relative hidden md:flex items-center justify-center"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                     <div className="w-full h-full glass-panel p-1 rounded-3xl bg-gradient-to-br from-white/10 to-white/0 border border-white/20 shadow-2xl relative z-10 backdrop-blur-3xl flex flex-col">
                         <div className="bg-[#0f172a]/80 rounded-[20px] p-6 lg:p-8 flex-1 flex flex-col relative overflow-hidden transition-all">

                             {/* Floating Elements Background */}
                             <div className="absolute inset-0 opacity-30 pointer-events-none">
                                 <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
                                 <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
                             </div>

                             {/* Active Feature Content - Centered Layout with Fixed Dimensions */}
                             <div
                                 key={activeFeature}
                                 className="relative z-10 flex-1 flex flex-col h-full"
                                 style={{ animation: 'carouselIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
                             >
                                  {/* Icon & Title Group - Fixed Height to prevent jitter. Added Padding Top for spacing */}
                                  <div className="flex flex-col items-center text-center gap-3 mb-6 h-[110px] shrink-0 justify-end pt-6">
                                    <div className={`w-14 h-14 rounded-2xl ${FEATURES[activeFeature].bg} flex items-center justify-center transition-all duration-500 ring-1 ring-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)] shrink-0`}>
                                        {React.cloneElement(FEATURES[activeFeature].icon as React.ReactElement<any>, { className: `w-7 h-7 ${FEATURES[activeFeature].color}` })}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                                            {FEATURES[activeFeature].title}
                                        </h3>
                                        <p className="text-slate-400 text-sm max-w-[300px] mx-auto leading-relaxed line-clamp-2 h-10">
                                            {FEATURES[activeFeature].desc}
                                        </p>
                                    </div>
                                  </div>

                                  {/* Dynamic Visual Area */}
                                  <div className="flex-1 w-full relative min-h-[200px] flex flex-col">
                                      <FeatureVisual activeFeature={activeFeature} />
                                  </div>
                             </div>

                             {/* Indicators */}
                             <div className="flex justify-center gap-3 mt-6 pt-2 shrink-0">
                                 {FEATURES.map((_, idx) => (
                                     <button
                                        key={idx}
                                        onClick={() => {
                                            setActiveFeature(idx);
                                            setResetKey((k) => k + 1);
                                        }}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${activeFeature === idx ? 'w-8 bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'w-2 bg-slate-700 hover:bg-slate-600'}`}
                                     />
                                 ))}
                             </div>
                         </div>
                     </div>
                </div>

            </div>

            {/* Scroll sections — full width */}
            <FeaturesSection />
            <PricingSection />
            <CTABanner onOpenAuth={() => setShowAuth(true)} />

            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onLogin={handleLogin} />
            <style>{`
    @keyframes carouselIn {
        from { opacity: 0; transform: scale(0.92); }
        to   { opacity: 1; transform: scale(1); }
    }
`}</style>
        </MarketingLayout>
    );
};
