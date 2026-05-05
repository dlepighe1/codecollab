import React, { useState, useEffect, useRef } from 'react';
import { Bot, Crown, ArrowUpRight, PanelRightClose, User } from 'lucide-react';

interface AIChatPanelProps {
    themeConfig: any;
    isOpen: boolean;
    onClose: () => void;
    user: any;
    roomType: string;
    isSeparated: boolean;
}

const AIChatPanel = ({ themeConfig, isOpen, onClose, user, roomType, isSeparated }: AIChatPanelProps) => {
    const hasAccess = (user.tier === 'Team') || (user.tier === 'Pro' && (roomType === 'Playground' || roomType === 'Interview'));

    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: 'Hello! I am your Antigravity AI coding assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsgs = [...messages, { role: 'user' as const, text: input }];
        setMessages(newMsgs);
        setInput('');
        setLoading(true);

        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', text: "That's an interesting question! Based on your code, I suggest refactoring the loop to use a map function for better readability and memory management." }]);
            setLoading(false);
        }, 1500);
    };

    return (
        <div
            className={`flex flex-col transition-all duration-300 ease-in-out shrink-0 min-w-0 min-h-0 ${isOpen ? 'w-80 md:w-[400px] opacity-100' : 'w-0 opacity-0 pointer-events-none'} ${isSeparated ? 'rounded-2xl border shadow-2xl z-40' : 'border-l h-full z-40'}`}
            style={{
                backgroundColor: themeConfig.ui.panelBg,
                borderColor: themeConfig.ui.border,
                overflow: 'hidden'
            }}
        >
            {/* Chat Header */}
            <div className={`h-[48px] flex items-center justify-between px-4 border-b shrink-0 min-w-[320px] ${isSeparated ? 'bg-transparent' : ''}`} style={{ borderColor: themeConfig.ui.border, background: isSeparated ? undefined : themeConfig.ui.header }}>
                <div className="flex items-center gap-3">
                    <div className="p-1 rounded-md bg-gradient-to-tr from-purple-500 to-indigo-600 shadow-sm border border-white/10">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <div className="text-xs font-bold tracking-wide opacity-90">Antigravity AI</div>
                    </div>
                </div>
                <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-md transition opacity-50 hover:opacity-100"><PanelRightClose className="w-4 h-4" /></button>
            </div>

            {!hasAccess ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-5 min-w-[320px]">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl animate-float">
                        <Crown className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Upgrade to Access</h3>
                        <p className="text-sm opacity-60 leading-relaxed max-w-[200px] mx-auto">
                            Unlock AI Chat with <strong>Pro</strong> or <strong>Team</strong> plans.
                        </p>
                    </div>
                    <button className="px-8 py-3 bg-white text-black text-xs font-bold rounded-xl shadow-lg hover:scale-105 transition hover:shadow-xl">
                        View Plans
                    </button>
                </div>
            ) : (
                <div className="flex flex-col flex-1 min-w-[320px] overflow-hidden relative">
                    <div className="flex-1 flex flex-col overflow-y-auto p-5 custom-scrollbar pb-28">
                        {messages.map((msg, idx) => (
                            <div key={idx} className="animate-fade-in mb-6 group">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 w-7 h-7 rounded-md flex items-center justify-center shrink-0 border border-white/5 shadow-sm ${msg.role === 'user' ? 'bg-slate-700' : 'bg-gradient-to-b from-purple-500 to-indigo-600'}`}>
                                        {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-xs mb-1 opacity-50 tracking-wide uppercase">
                                            {msg.role === 'user' ? 'You' : 'Antigravity AI'}
                                        </div>
                                        <div className="text-[13px] leading-relaxed opacity-90 break-words" style={{ color: themeConfig.ui.text }}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-start gap-3 mb-6">
                                <div className="mt-0.5 w-7 h-7 rounded-md flex items-center justify-center shrink-0 border border-white/5 shadow-sm bg-gradient-to-b from-purple-500 to-indigo-600">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex items-center h-8">
                                    <div className="flex items-center gap-1 opacity-70">
                                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-75"></div>
                                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area - Floating Pill */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className={`relative flex items-center p-1.5 rounded-full border shadow-2xl backdrop-blur-xl transition-all focus-within:ring-2 ring-blue-500/30 ${themeConfig.name === 'Snow White' ? 'bg-white/90 border-slate-200' : 'bg-black/40 border-white/10'}`}>
                            <div className="pl-3 pr-2 py-1.5 flex-1">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask AI anything..."
                                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                                    style={{ color: themeConfig.ui.text }}
                                />
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-700 transition-all shadow-lg hover:shadow-blue-500/30 shrink-0"
                            >
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIChatPanel;
