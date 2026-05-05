import React from 'react';
import { Terminal as TerminalIcon, Trash2, ChevronDown } from 'lucide-react';

interface TerminalLine {
    type: 'stdout' | 'stderr' | 'info' | 'system';
    text: string;
}

interface TerminalPanelProps {
    themeConfig: any;
    isObsidian: boolean;
    isLightMode: boolean;
    isSeparated: boolean;
    isConsoleOpen: boolean;
    consoleHeight: number;
    terminalOutput: TerminalLine[];
    terminalFontSize: number;
    onClearTerminal: () => void;
    onCloseConsole: () => void;
    onStartResizing: () => void;
}

const TerminalPanel = ({
    themeConfig,
    isObsidian,
    isLightMode,
    isSeparated,
    isConsoleOpen,
    consoleHeight,
    terminalOutput,
    terminalFontSize,
    onClearTerminal,
    onCloseConsole,
    onStartResizing
}: TerminalPanelProps) => {
    return (
        <div
            className={`flex flex-col min-h-0 shrink-0 overflow-hidden relative transition-all duration-300 ease-in-out ${isSeparated ? 'rounded-2xl border shadow-xl mb-1' : 'border-t shadow-[0_-10px_40px_rgba(0,0,0,0.3)]'}`}
            style={{
                height: isConsoleOpen ? `${consoleHeight}px` : '0px',
                opacity: isConsoleOpen ? 1 : 0,
                background: isObsidian ? '#000000' : (isSeparated ? themeConfig.ui.panelBg : themeConfig.ui.menuBg),
                borderColor: themeConfig.ui.border
            }}
        >
            <div className="absolute top-0 left-0 w-full h-1 cursor-row-resize hover:bg-blue-500/50 z-50 transition-colors" onMouseDown={(e) => { e.stopPropagation(); onStartResizing(); }} />
            <div
                className={`h-9 flex items-center justify-between px-4 border-b shrink-0 select-none ${isObsidian ? 'bg-black text-white' : (isLightMode ? 'bg-slate-100 text-slate-700' : 'bg-black/40')}`}
                style={{ borderColor: themeConfig.ui.border }}
            >
                <div className="flex items-center gap-2">
                    <TerminalIcon className="w-3.5 h-3.5 opacity-50" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Output Console</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={onClearTerminal} className="p-1.5 opacity-50 hover:opacity-100 hover:text-red-400 hover:bg-white/10 rounded transition" title="Clear Console">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button onClick={onCloseConsole} className="p-1.5 opacity-50 hover:opacity-100 hover:bg-white/10 rounded transition" title="Minimize Console">
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div
                className={`flex-1 p-3 font-mono overflow-auto custom-scrollbar ${isObsidian ? 'bg-black text-white' : (isLightMode ? 'bg-white' : 'bg-black/20')}`}
                style={{ fontSize: `${terminalFontSize}px` }}
            >
                {terminalOutput.map((line, i) => (
                    <div key={i} className={`mb-1.5 px-3 py-2 rounded-lg border-l-4 flex gap-3 shadow-sm ${isLightMode
                            ? (line.type === 'stderr' ? 'bg-red-50 border-red-500 text-red-900' : line.type === 'info' ? 'bg-blue-50 border-blue-500 text-blue-900' : line.type === 'system' ? 'bg-gray-100 border-gray-500 text-gray-700 font-bold italic' : 'bg-emerald-50 border-emerald-500 text-emerald-900')
                            : (line.type === 'stderr' ? 'bg-red-500/10 border-red-500 text-red-300' : line.type === 'info' ? 'bg-blue-500/10 border-blue-500 text-blue-300' : line.type === 'system' ? 'bg-white/5 border-slate-500 text-slate-400 italic' : 'bg-white/5 border-emerald-500 text-emerald-300')
                        }`}>
                        <span className="opacity-70 shrink-0 font-bold w-8 text-right">
                            {line.type === 'info' ? 'INF' : line.type === 'stderr' ? 'ERR' : line.type === 'system' ? 'SYS' : 'OUT'}
                        </span>
                        <span className="whitespace-pre-wrap font-bold leading-relaxed select-text">{line.text}</span>
                    </div>
                ))}
                {terminalOutput.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 gap-1">
                        <TerminalIcon className="w-6 h-6" />
                        <span className="text-[10px]">Ready to execute code...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TerminalPanel;
