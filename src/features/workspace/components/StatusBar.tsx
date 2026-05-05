import React from 'react';
import { AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';

interface StatusBarProps {
    themeConfig: any;
    language: string;
    cursorPosition: { lineNumber: number; column: number };
    errorCount: number;
    onToggleAI: () => void;
    isAiOpen: boolean;
}

const StatusBar = ({ themeConfig, language, cursorPosition, errorCount, onToggleAI, isAiOpen }: StatusBarProps) => {
    return (
        <div className="h-7 w-full flex items-center justify-between px-3 text-[10px] font-medium border-t select-none shrink-0" style={{ backgroundColor: themeConfig.ui.accent, color: '#fff', borderColor: themeConfig.ui.border }}>
            <div className="flex items-center gap-4 opacity-90">
                <div className="flex items-center gap-1.5 cursor-pointer hover:bg-black/10 px-2 py-0.5 rounded transition">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_lime]"></div>
                    <span>main</span>
                </div>
                <div className="flex items-center gap-1.5 hover:bg-black/10 px-2 py-0.5 rounded cursor-pointer transition">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{errorCount} Errors</span>
                </div>
                <div className="flex items-center gap-1.5 hover:bg-black/10 px-2 py-0.5 rounded cursor-pointer transition">
                    <CheckCircle className="w-3 h-3" />
                    <span>Prettier</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-3 hover:bg-black/10 px-2 py-0.5 rounded cursor-pointer transition opacity-80">
                    <span>Ln {cursorPosition.lineNumber}, Col {cursorPosition.column}</span>
                    <span>UTF-8</span>
                    <span className="capitalize">{language}</span>
                </div>
                <div className="h-3 w-px bg-white/30 mx-1"></div>
                <button onClick={onToggleAI} className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full transition-all ${isAiOpen ? 'bg-white text-blue-600 font-bold shadow-sm' : 'hover:bg-white/20 text-white'}`}>
                    <Sparkles className="w-3 h-3" />
                    <span>AI Chat</span>
                </button>
            </div>
        </div>
    );
};

export default StatusBar;
