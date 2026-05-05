import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CTABannerProps {
    onOpenAuth: () => void;
}

export const CTABanner: React.FC<CTABannerProps> = ({ onOpenAuth }) => {
    return (
        <section className="py-24 px-6 relative">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-12 text-center relative overflow-hidden">
                    {/* Glow effects */}
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                            Ready to code together?
                        </h2>
                        <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                            Join thousands of developers collaborating in real-time.
                        </p>
                        <button
                            onClick={onOpenAuth}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-lg shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] transition transform hover:-translate-y-1 inline-flex items-center gap-2 hover:brightness-110"
                        >
                            Get Started Free <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
