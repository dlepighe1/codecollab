import React from 'react';
import { X, Rocket } from 'lucide-react';

export const ComingSoonModal = ({ onClose, styles }: any) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className={`relative border rounded-2xl p-8 w-full max-w-sm animate-fade-in text-center ${styles.modalBg} ${styles.cardBorder}`}>
                <button onClick={onClose} className={`absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full transition ${styles.subtext}`}><X className="w-5 h-5" /></button>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${styles.iconContainer}`}>
                    <Rocket className={`w-8 h-8 ${styles.highlight}`} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${styles.heading}`}>Coming Soon</h3>
                <p className={`text-sm mb-6 ${styles.subtext}`}>We are working hard to bring this feature to life. Stay tuned for updates!</p>
                <button onClick={onClose} className={`w-full py-2.5 rounded-xl font-bold transition ${styles.buttonPrimary}`}>
                    Got it
                </button>
            </div>
        </div>
    );
};
