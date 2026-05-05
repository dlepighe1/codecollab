import React, { useState } from 'react';
import { X, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export const JoinSessionModal = ({ onClose, onJoin, onBack, styles }: any) => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleJoin = async () => {
        if(!code) return;
        setError(null);
        setIsLoading(true);
        try {
            await onJoin(code);
        } catch (e) {
            setError('Failed to join room. Please check the ID.');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={!isLoading ? onClose : undefined} />
            <div className={`relative border rounded-2xl p-6 w-full max-w-sm animate-fade-in ${styles.modalBg} ${styles.cardBorder}`}>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        {onBack && !isLoading && (
                            <button onClick={onBack} className={`p-1 hover:bg-white/10 rounded-full transition ${styles.subtext} hover:text-white`}>
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <h3 className={`text-xl font-bold ${styles.heading}`}>Join Session</h3>
                    </div>
                    {!isLoading && <button onClick={onClose} className={`p-1 hover:bg-white/10 rounded-full transition ${styles.subtext}`}><X className="w-5 h-5" /></button>}
                </div>
                <div className="space-y-4">
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${styles.subtext}`}>Room ID / Code</label>
                        <input
                            type="text"
                            className={`w-full rounded-xl px-4 py-3 outline-none transition font-mono ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                            placeholder="e.g. MyRoom-1234-5678"
                            value={code}
                            onChange={e => { setCode(e.target.value); setError(null); }}
                            autoFocus
                            disabled={isLoading}
                            onKeyDown={e => e.key === 'Enter' && handleJoin()}
                        />
                    </div>
                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}
                    <button
                        onClick={handleJoin}
                        disabled={!code || isLoading}
                        className={`w-full py-3 disabled:opacity-50 rounded-xl font-bold transition flex items-center justify-center gap-2 ${styles.buttonPrimary}`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Joining...
                            </>
                        ) : (
                            'Join Room'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
