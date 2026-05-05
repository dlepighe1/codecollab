import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, ChevronDown, Check } from 'lucide-react';

export const SessionSetupModal = ({ type, onClose, onConfirm, onBack, styles }: any) => {
    const [name, setName] = useState('');
    const [lang, setLang] = useState('javascript');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = ['javascript', 'python', 'java', 'cpp'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(name || `${type} Session`, lang);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className={`relative border rounded-2xl p-6 w-full max-w-md animate-fade-in ${styles.modalBg} ${styles.cardBorder}`}>
                 <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button onClick={onBack} className={`p-1 hover:bg-white/10 rounded-full transition ${styles.subtext} hover:text-white`}>
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <h3 className={`text-xl font-bold ${styles.heading}`}>Setup {type} Session</h3>
                    </div>
                    <button onClick={onClose} className={`p-1 hover:bg-white/10 rounded-full transition ${styles.subtext}`}><X className="w-5 h-5" /></button>
                 </div>
                 <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                         <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${styles.subtext}`}>Session Name</label>
                         <input
                            type="text"
                            className={`w-full rounded-xl px-4 py-3 outline-none transition ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                            placeholder="e.g., Algorithm Practice"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoFocus
                        />
                     </div>
                     <div>
                         <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${styles.subtext}`}>Language</label>
                         <div className="relative" ref={dropdownRef}>
                             <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`w-full rounded-xl px-4 py-3 outline-none transition flex items-center justify-between cursor-pointer border ${styles.inputBg} ${styles.inputBorder} ${styles.inputText}`}
                             >
                                 <span className="capitalize">{lang === 'cpp' ? 'C++' : lang}</span>
                                 <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''} ${styles.subtext}`} />
                             </button>

                             {isDropdownOpen && (
                                 <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-2xl overflow-hidden z-50 flex flex-col ${styles.modalBg} ${styles.cardBorder}`}>
                                     {languages.map(opt => (
                                         <button
                                            key={opt}
                                            type="button"
                                            onClick={() => { setLang(opt); setIsDropdownOpen(false); }}
                                            className={`w-full text-left px-4 py-3 text-sm transition border-b last:border-0 border-white/5 hover:bg-white/5 capitalize flex items-center justify-between ${lang === opt ? styles.highlight : styles.heading}`}
                                         >
                                            {opt === 'cpp' ? 'C++' : opt}
                                            {lang === opt && <Check className="w-4 h-4" />}
                                         </button>
                                     ))}
                                 </div>
                             )}
                         </div>
                     </div>
                     <div className="pt-4">
                         <button type="submit" className={`w-full py-3 rounded-xl font-bold transition ${styles.buttonPrimary}`}>
                             Start Coding
                         </button>
                     </div>
                 </form>
            </div>
        </div>
    );
};
