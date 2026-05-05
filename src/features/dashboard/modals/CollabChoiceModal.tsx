import React from 'react';
import { X, Plus, LogIn } from 'lucide-react';

export const CollabChoiceModal = ({ onClose, onCreate, onJoin, styles }: any) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
        <div className={`relative border rounded-2xl p-6 w-full max-w-sm animate-fade-in ${styles.modalBg} ${styles.cardBorder}`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold ${styles.heading}`}>Multiplayer Session</h3>
                <button onClick={onClose} className={`p-1 hover:bg-white/10 rounded-full transition ${styles.subtext}`}><X className="w-5 h-5" /></button>
            </div>
            <div className="grid gap-4">
                <button
                    onClick={onCreate}
                    className="flex items-center gap-4 p-4 rounded-xl bg-blue-600/10 border border-blue-500/50 hover:bg-blue-600/20 hover:border-blue-500 transition group text-left"
                >
                    <div className="p-3 rounded-lg bg-blue-500 text-white shadow-lg group-hover:scale-110 transition-transform"><Plus className="w-5 h-5"/></div>
                    <div>
                        <h4 className={`font-bold ${styles.heading}`}>Create New Room</h4>
                        <p className={`text-xs ${styles.subtext}`}>Host a session and invite others</p>
                    </div>
                </button>
                <button
                    onClick={onJoin}
                    className="flex items-center gap-4 p-4 rounded-xl bg-purple-600/10 border border-purple-500/50 hover:bg-purple-600/20 hover:border-purple-500 transition group text-left"
                >
                    <div className="p-3 rounded-lg bg-purple-500 text-white shadow-lg group-hover:scale-110 transition-transform"><LogIn className="w-5 h-5"/></div>
                    <div>
                        <h4 className={`font-bold ${styles.heading}`}>Join Existing Room</h4>
                        <p className={`text-xs ${styles.subtext}`}>Enter a code to join a team</p>
                    </div>
                </button>
            </div>
        </div>
    </div>
);
