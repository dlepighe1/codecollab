import React, { useState, useEffect, useRef } from 'react';
import { MousePointer2, ChevronDown, Check } from 'lucide-react';

export const RoleCursorPicker = ({ label, role, currentColor, mapping, onUpdate, theme }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Updated Available colors: Blue, Red, Green, Orange, Pink
    const ALL_COLORS = [
        { name: 'Blue', hex: '#3b82f6' },
        { name: 'Red', hex: '#ef4444' },
        { name: 'Green', hex: '#10b981' },
        { name: 'Orange', hex: '#f59e0b' },
        { name: 'Pink', hex: '#ec4899' }
    ];

    // Filter used colors (except current)
    const usedColors = Object.values(mapping || {}).filter(c => c !== currentColor);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`px-4 py-3 rounded-xl border flex items-center justify-between gap-4 ${theme.cardBg} ${theme.cardBorder}`}>
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5">
                    <MousePointer2 className="w-4 h-4" style={{ fill: currentColor, color: currentColor }} />
                </div>
                <div className={`text-sm font-bold ${theme.textPrimary}`}>{label}</div>
            </div>

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${theme.inputBg} ${theme.panelBorder} ${theme.textPrimary}`}
                >
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: currentColor }} />
                    <ChevronDown className="w-3 h-3 opacity-50" />
                </button>

                {isOpen && (
                    <div className={`absolute top-full right-0 mt-2 p-2 rounded-xl shadow-2xl border z-50 flex gap-2 ${theme.appBg === 'bg-slate-50' ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/10'}`}>
                        {ALL_COLORS.map(c => {
                            const isTaken = usedColors.includes(c.hex);
                            return (
                                <button
                                    key={c.hex}
                                    onClick={() => { if(!isTaken) { onUpdate(role, c.hex); setIsOpen(false); } }}
                                    disabled={isTaken}
                                    className={`w-8 h-8 rounded-full border-2 transition-all relative group flex items-center justify-center ${
                                        isTaken
                                            ? 'opacity-30 cursor-not-allowed border-transparent'
                                            : currentColor === c.hex
                                                ? 'border-white shadow-lg scale-110'
                                                : 'border-transparent hover:scale-110'
                                    }`}
                                    style={{ backgroundColor: c.hex }}
                                    title={isTaken ? `${c.name} (Taken)` : c.name}
                                >
                                    {currentColor === c.hex && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
