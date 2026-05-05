import React, { useState } from 'react';
import { Github, Loader2, User, Mail, Lock, X, Zap } from 'lucide-react';

interface AuthModalContentProps {
    onClose: () => void;
    onLogin: (username: string, password?: string) => Promise<void>;
    onSocialLogin?: (provider: 'google' | 'github') => void;
    isDevMode: boolean;
}

export const AuthModalContent: React.FC<AuthModalContentProps> = ({
    onClose, onLogin, onSocialLogin, isDevMode
}) => {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [showDevInput, setShowDevInput] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [devName, setDevName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onLogin(email || username, password);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDevLogin = async () => {
        if (!devName.trim()) return;
        setIsLoading(true);
        try {
            await onLogin(devName);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#0f172a]/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl p-8 w-full max-w-md relative">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition p-2 rounded-full hover:bg-white/10"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                    {mode === 'login' ? 'Welcome Back' : 'Get Started'}
                </h2>
                <p className="text-slate-400">
                    {mode === 'login' ? 'Continue your coding journey.' : 'Join the community today.'}
                </p>
            </div>

            {/* Social login buttons */}
            <div className="space-y-3 mb-6">
                <button
                    onClick={() => onSocialLogin?.('google')}
                    className="w-full bg-white text-slate-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-100 transition shadow-lg"
                >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                        <path d="M20.1004 12.308c0-.623-.053-1.22-.156-1.802H12.0004v3.408h4.545c-.196 1.056-.793 1.95-1.69 2.55v2.118h2.735c1.6-1.472 2.51-3.642 2.51-6.274Z" fill="#4285F4"/>
                        <path d="M12.0003 20.45c2.2783 0 4.19-1.2766 5.5867-2.5666l-2.735-2.1183c-.755.5067-1.7217.8067-2.8517.8067-2.1983 0-4.06-1.485-4.7233-3.4834H4.417v2.1884C5.8087 18.0383 8.7087 20.45 12.0003 20.45Z" fill="#34A853"/>
                        <path d="M7.277 13.0883c-.1684-.505-.265-1.045-.265-1.6033 0-.5584.0966-1.0984.265-1.6034V7.6933H4.417c-.5884 1.1717-.925 2.4934-.925 3.8767 0 1.3833.3366 2.705.925 3.8766l2.86-2.3583Z" fill="#FBBC05"/>
                        <path d="M12.0003 6.9c1.2383 0 2.35.4267 3.225 1.2617l2.42-2.42C16.1837 4.3667 14.272 3.55 12.0003 3.55c-3.2916 0-6.1916 2.4117-7.5833 5.1433l2.86 2.3584c.6633-1.9984 2.525-3.4834 4.7233-3.4834Z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </button>
                <button
                    onClick={() => onSocialLogin?.('github')}
                    className="w-full bg-[#24292e] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-[#2f363d] transition shadow-lg border border-white/10"
                >
                    <Github className="w-5 h-5" />
                    Continue with GitHub
                </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-[#0f172a] text-slate-500 uppercase tracking-wide font-semibold text-xs">
                        Or with email
                    </span>
                </div>
            </div>

            {/* Email/password form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full bg-slate-900/50 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 pl-11 text-white outline-none transition-all placeholder:text-slate-600"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-slate-900/50 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 pl-11 text-white outline-none transition-all placeholder:text-slate-600"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                {mode === 'signup' && (
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-slate-900/50 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 pl-11 text-white outline-none transition-all placeholder:text-slate-600"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</>
                    ) : (
                        mode === 'login' ? 'Log In' : 'Create Account'
                    )}
                </button>
            </form>

            {/* Toggle login/signup */}
            <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                    {mode === 'login' ? "New here? " : "Already have an account? "}
                    <button
                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                        className="text-blue-400 hover:text-blue-300 font-bold ml-1 hover:underline"
                    >
                        {mode === 'login' ? 'Create an account' : 'Log in'}
                    </button>
                </p>
            </div>

            {/* Dev Access — only when VITE_DEV_MODE=true and no Clerk */}
            {isDevMode && (
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                    {!showDevInput ? (
                        <button
                            onClick={() => setShowDevInput(true)}
                            className="w-full flex items-center justify-center gap-2 text-amber-400/70 hover:text-amber-400 text-sm font-medium transition py-2"
                        >
                            <Zap className="w-4 h-4" />
                            Dev Access
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                                <Zap className="w-3 h-3" />
                                Dev Mode — No Authentication
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter any username"
                                    className="flex-1 bg-amber-500/10 border border-amber-500/30 focus:border-amber-500 rounded-xl px-4 py-2.5 text-white outline-none transition-all placeholder:text-amber-500/40 text-sm"
                                    value={devName}
                                    onChange={(e) => setDevName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleDevLogin()}
                                    autoFocus
                                />
                                <button
                                    onClick={handleDevLogin}
                                    disabled={!devName.trim() || isLoading}
                                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition disabled:opacity-50 text-sm"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Go'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
