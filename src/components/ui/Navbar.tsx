import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Code2, Menu, X } from 'lucide-react';
import AuthSlider from "./AuthSlider";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [authSliderOpen, setAuthSliderOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
    const navigate = useNavigate();
    const location = useLocation();

    const handleAuthClick = (mode: 'signin' | 'signup') => {
        setAuthMode(mode);
        setAuthSliderOpen(true);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/80 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left side of the Navbar */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                                <Code2 className="w-6 h-6 text-white"/>
                            </div>
                            <span className="logo-text text-lg sm:text-xl">CodeCollab</span>
                        </div>

                        {/* Desktop Navigation - Right side */}
                        <div className="hidden md:flex items-center gap-8">
                            <div className="flex items-center gap-6">
                                <a href="#features" className="text-slate-300 hover:text-white font-medium transition-colors text-sm">Features</a>
                                <a href="#pricing" className="text-slate-300 hover:text-white font-medium transition-colors text-sm">Pricing</a>
                            </div>
                            <div className="w-px h-5 bg-white/10"></div>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => handleAuthClick('signin')}
                                    className="text-slate-300 hover:text-white font-medium transition-colors text-sm"
                                >
                                    Log In
                                </button>
                                <button 
                                    onClick={() => handleAuthClick('signup')}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110 px-5 py-2.5 rounded-full font-bold transition shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] text-sm"
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            className="md:hidden text-slate-300 hover:text-white transition-colors p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden animate-slide-in-down border-t border-white/10">
                            <div className="px-2 pt-4 pb-6 space-y-3">
                                {/* Mobile Navigation Links */}
                                <a 
                                    href="#features" 
                                    className="block px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg font-medium transition-all text-sm"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Features
                                </a>
                                <a 
                                    href="#pricing" 
                                    className="block px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg font-medium transition-all text-sm"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Pricing
                                </a>
                                
                                {/* Mobile Auth Buttons */}
                                <div className="pt-3 space-y-2">
                                    <button 
                                        onClick={() => handleAuthClick('signin')}
                                        className="w-full text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-all text-sm px-4 py-2.5 rounded-lg"
                                    >
                                        Log In
                                    </button>
                                    <button 
                                        onClick={() => handleAuthClick('signup')}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110 px-5 py-2.5 rounded-full font-bold transition shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] text-sm"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Auth Slider Component */}
            <AuthSlider 
                isOpen={authSliderOpen}
                onClose={() => setAuthSliderOpen(false)}
                initialMode={authMode}
            />
        </>
    );
}