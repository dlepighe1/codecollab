import React, { useState } from 'react';
import { Layers, X, FolderTree, Terminal, Bot } from 'lucide-react';

interface FABProps {
    isOpen: boolean;
    onToggle: () => void;
    panels: {
        explorer: boolean;
        terminal: boolean;
        aiChat: boolean;
    };
    onTogglePanel: (panel: 'explorer' | 'terminal' | 'aiChat') => void;
    colorMode: 'colorful' | 'theme';
    accentColor: string;
    isAiOpen: boolean;
}

const PANEL_BUTTONS = [
    { key: 'explorer' as const, icon: FolderTree, label: 'File Explorer', activeColor: 'bg-blue-500' },
    { key: 'terminal' as const, icon: Terminal, label: 'Terminal', activeColor: 'bg-emerald-500' },
    { key: 'aiChat' as const, icon: Bot, label: 'AI Chat', activeColor: 'bg-purple-500' },
];

export const FAB: React.FC<FABProps> = ({ isOpen, onToggle, panels, onTogglePanel, colorMode, accentColor, isAiOpen }) => {
    const [isHovered, setIsHovered] = useState(false);

    const isColorful = colorMode === 'colorful';
    const fabBg = isColorful
        ? 'bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500'
        : '';

    // Fade FAB when AI panel is open and user isn't hovering it
    const rightOffset = isAiOpen ? 'right-[340px] md:right-[424px]' : 'right-6';

    // Fade FAB when AI panel is open and user isn't hovering it
    const opacityClass = isAiOpen && !isHovered && !isOpen
        ? 'opacity-30 hover:opacity-100'
        : 'opacity-100';

    return (
        <div
            className={`fixed z-50 flex flex-col items-center gap-3 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] bottom-6 ${rightOffset} ${opacityClass}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Panel buttons — always rendered for smooth layout/transform animations */}
            <div className={`flex flex-col gap-2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-50 pointer-events-none'}`}>
                {PANEL_BUTTONS.map((btn, index) => {
                    const Icon = btn.icon;
                    const isActive = panels[btn.key];

                    // Specific override for terminal in colorful mode
                    let currentActiveColor = btn.activeColor;
                    if (isColorful && btn.key === 'terminal') {
                        currentActiveColor = 'bg-black border-slate-700 text-white';
                    }

                    return (
                        <button
                            key={btn.key}
                            onClick={() => onTogglePanel(btn.key)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border transition-all duration-300 ${isActive
                                    ? `${currentActiveColor} text-white border-white/20 shadow-xl scale-105`
                                    : 'bg-slate-800/90 text-slate-400 border-white/10 hover:bg-slate-700 hover:text-white'
                                }`}
                            style={{ transitionDelay: isOpen ? `${(2 - index) * 50}ms` : '0ms' }}
                            title={btn.label}
                        >
                            <Icon className="w-5 h-5" />
                        </button>
                    );
                })}
            </div>

            {/* Main FAB button */}
            <button
                onClick={onToggle}
                className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border border-white/20 transition-all duration-500 hover:scale-110 ${isOpen ? 'bg-slate-800' : fabBg
                    }`}
                style={colorMode === 'theme' && !isOpen ? { backgroundColor: accentColor } : undefined}
                title={isOpen ? 'Close menu' : 'Open panel controls'}
            >
                <div className={`absolute transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}>
                    <Layers className="w-6 h-6 text-white" />
                </div>
                <div className={`absolute transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'}`}>
                    <X className="w-6 h-6 text-white" />
                </div>
            </button>
        </div>
    );
};
