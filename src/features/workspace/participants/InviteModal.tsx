import React, { useState } from 'react';
import { X, Copy, Check, Info } from 'lucide-react';

interface InviteModalProps {
    onClose: () => void;
    themeConfig: any;
    roomId: string;
}

const InviteModal = ({ onClose, themeConfig, roomId }: InviteModalProps) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative border rounded-2xl p-6 w-full max-w-2xl animate-fade-in shadow-2xl" style={{ backgroundColor: themeConfig.ui.menuBg, borderColor: themeConfig.ui.border, color: themeConfig.ui.text }}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Invite Collaborators</h3>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition opacity-70 hover:opacity-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold opacity-60 uppercase tracking-widest mb-2">Session ID</label>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 font-mono text-lg font-bold tracking-wider select-all">{roomId}</div>
                            <button
                                onClick={handleCopy}
                                className={`px-6 rounded-xl font-bold transition flex items-center gap-2 shadow-lg ${copied ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                        <p className="mt-3 text-sm opacity-60 leading-relaxed">Share this ID with your team. They can join by entering it in their dashboard.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex gap-3">
                        <Info className="w-5 h-5 text-yellow-500 shrink-0" />
                        <div className="text-sm opacity-80">
                            <p className="font-bold text-yellow-500 mb-1">Security Note</p>
                            Anyone with this ID can access the session and edit code in real-time.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InviteModal;
