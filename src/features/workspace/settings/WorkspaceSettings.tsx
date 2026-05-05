import React, { useState } from 'react';
import { X, Code2, LayoutTemplate, ToggleLeft, ToggleRight, Layers } from 'lucide-react';
import { WorkspaceTheme } from '../../../types';
import { WORKSPACE_THEME_CONFIG } from '../../../constants';

const PaletteIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
);

interface WorkspaceSettingsProps {
    onClose: () => void;
    theme: WorkspaceTheme;
    setTheme: (theme: WorkspaceTheme) => void;
    fontSize: number;
    setFontSize: (size: number) => void;
    themeConfig: any;
    layoutMode: 'connected' | 'separated';
    setLayoutMode: (mode: 'connected' | 'separated') => void;
    minimapEnabled: boolean;
    setMinimapEnabled: (enabled: boolean) => void;
    terminalFontSize: number;
    setTerminalFontSize: (size: number) => void;
    executionMeta: boolean;
    setExecutionMeta: (enabled: boolean) => void;
    showStatusBar: boolean;
    setShowStatusBar: (show: boolean) => void;
    fabEnabled: boolean;
    setFabEnabled: (enabled: boolean) => void;
    fabColor: 'colorful' | 'theme';
    setFabColor: (color: 'colorful' | 'theme') => void;
    toastSounds: boolean;
    setToastSounds: (enabled: boolean) => void;
}

const WorkspaceSettings = ({
    onClose, theme, setTheme, fontSize, setFontSize, themeConfig, layoutMode, setLayoutMode,
    minimapEnabled, setMinimapEnabled, terminalFontSize, setTerminalFontSize, executionMeta, setExecutionMeta,
    showStatusBar, setShowStatusBar,
    fabEnabled, setFabEnabled, fabColor, setFabColor, toastSounds, setToastSounds
}: WorkspaceSettingsProps) => {
    const [activeSection, setActiveSection] = useState<'theme' | 'layout' | 'editor' | 'accessories'>('theme');
    const sliderBg = theme === 'Snow White' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <style>{`
                .settings-slider { -webkit-appearance: none; width: 100%; height: 4px; background: ${sliderBg}; border-radius: 2px; outline: none; }
                .settings-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #3b82f6; cursor: pointer; transition: all 0.15s ease; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3); border: 2px solid white; }
                .settings-slider::-webkit-slider-thumb:hover { transform: scale(1.1); box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.4); }
            `}</style>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative border rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in flex flex-col h-[600px] overflow-hidden" style={{ backgroundColor: themeConfig.ui.menuBg, borderColor: themeConfig.ui.border, color: themeConfig.ui.text }}>
                <div className="flex h-full">
                    <div className="w-1/3 border-r p-4 flex flex-col gap-2" style={{ borderColor: themeConfig.ui.border, backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        <div className="mb-4 px-2"><h3 className="text-xl font-bold tracking-tight">Settings</h3></div>
                        <button onClick={() => setActiveSection('theme')} className={`text-left px-4 py-3 rounded-xl transition-all font-medium text-sm flex items-center gap-3 ${activeSection === 'theme' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'hover:bg-white/5 opacity-70 hover:opacity-100'}`}><PaletteIcon className="w-4 h-4" /> Theme</button>
                        <button onClick={() => setActiveSection('layout')} className={`text-left px-4 py-3 rounded-xl transition-all font-medium text-sm flex items-center gap-3 ${activeSection === 'layout' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'hover:bg-white/5 opacity-70 hover:opacity-100'}`}><LayoutTemplate className="w-4 h-4" /> Layout</button>
                        <button onClick={() => setActiveSection('editor')} className={`text-left px-4 py-3 rounded-xl transition-all font-medium text-sm flex items-center gap-3 ${activeSection === 'editor' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'hover:bg-white/5 opacity-70 hover:opacity-100'}`}><Code2 className="w-4 h-4" /> Editor & Console</button>
                        <button onClick={() => setActiveSection('accessories')} className={`text-left px-4 py-3 rounded-xl transition-all font-medium text-sm flex items-center gap-3 ${activeSection === 'accessories' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'hover:bg-white/5 opacity-70 hover:opacity-100'}`}><Layers className="w-4 h-4" /> Accessories</button>
                    </div>
                    <div className="w-2/3 flex flex-col relative">
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition z-10"><X className="w-5 h-5 opacity-70" /></button>
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {activeSection === 'theme' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h4 className="font-bold text-lg mb-4">Workspace Theme</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {(Object.keys(WORKSPACE_THEME_CONFIG) as WorkspaceTheme[]).map(t => {
                                            const config = WORKSPACE_THEME_CONFIG[t].ui;
                                            return (
                                                <button key={t} onClick={() => setTheme(t)} className={`group relative rounded-xl border-2 transition-all overflow-hidden text-left h-24 shadow-lg ${theme === t ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-transparent hover:border-white/20'}`}>
                                                    <div className="absolute inset-0 flex">
                                                        <div className="w-1/3 h-full" style={{ background: config.sidebar }}></div>
                                                        <div className="w-2/3 h-full flex flex-col">
                                                            <div className="h-6 w-full" style={{ background: config.header }}></div>
                                                            <div className="flex-1" style={{ background: config.bg }}></div>
                                                        </div>
                                                    </div>
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                                                        <span className="font-bold text-white text-sm drop-shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">Apply</span>
                                                    </div>
                                                    <div className={`absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${theme === t ? 'bg-blue-500 text-white' : 'bg-black/60 text-white backdrop-blur-sm'}`}>{WORKSPACE_THEME_CONFIG[t].name}</div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            {activeSection === 'layout' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h4 className="font-bold text-lg mb-4">Interface Layout</h4>
                                    <div className="grid gap-4">
                                        <button onClick={() => setLayoutMode('connected')} className={`p-4 rounded-xl border-2 transition-all text-left flex gap-4 items-center ${layoutMode === 'connected' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20'}`}>
                                            <div className="w-24 h-16 border border-white/20 rounded bg-slate-900 flex">
                                                <div className="w-6 border-r border-white/20 bg-slate-800"></div>
                                                <div className="flex-1 bg-slate-900"></div>
                                            </div>
                                            <div>
                                                <div className="font-bold mb-1">Connected (Classic)</div>
                                                <p className="text-xs opacity-60">Traditional IDE layout with seamlessly connected panels.</p>
                                            </div>
                                        </button>
                                        <button onClick={() => setLayoutMode('separated')} className={`p-4 rounded-xl border-2 transition-all text-left flex gap-4 items-center ${layoutMode === 'separated' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20'}`}>
                                            <div className="w-24 h-16 rounded bg-transparent flex gap-1 p-1">
                                                <div className="w-6 rounded-sm bg-slate-800 border border-white/20"></div>
                                                <div className="flex-1 rounded-sm bg-slate-900 border border-white/20"></div>
                                            </div>
                                            <div>
                                                <div className="font-bold mb-1">Separated (Modern)</div>
                                                <p className="text-xs opacity-60">Floating panels with rounded corners and spacing.</p>
                                            </div>
                                        </button>
                                    </div>
                                    <div className="h-px bg-white/10 my-2" />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-sm">Status Bar</div>
                                            <p className="text-xs opacity-60">Show language, cursor position, and AI toggle</p>
                                        </div>
                                        <button onClick={() => setShowStatusBar(!showStatusBar)} className={`text-2xl transition-colors ${showStatusBar ? 'text-blue-500' : 'text-slate-500'}`}>
                                            {showStatusBar ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                                        </button>
                                    </div>
                                </div>
                            )}
                            {activeSection === 'editor' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h4 className="font-bold text-lg mb-4">Editor Configuration</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-sm font-medium">Editor Font Size</label>
                                                <span className="text-xs font-bold opacity-60 bg-white/10 px-2 py-0.5 rounded">{fontSize}px</span>
                                            </div>
                                            <input type="range" min="10" max="24" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="settings-slider" />
                                        </div>
                                        <div className="h-px bg-white/10 my-2" />
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-sm font-medium">Terminal Font Size</label>
                                                <span className="text-xs font-bold opacity-60 bg-white/10 px-2 py-0.5 rounded">{terminalFontSize}px</span>
                                            </div>
                                            <input type="range" min="10" max="20" value={terminalFontSize} onChange={(e) => setTerminalFontSize(parseInt(e.target.value))} className="settings-slider" />
                                        </div>
                                        <div className="h-px bg-white/10 my-2" />
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium text-sm">Minimap</div>
                                                <p className="text-xs opacity-60">Show code overview on the right</p>
                                            </div>
                                            <button onClick={() => setMinimapEnabled(!minimapEnabled)} className={`text-2xl transition-colors ${minimapEnabled ? 'text-blue-500' : 'text-slate-500'}`}>
                                                {minimapEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                                            </button>
                                        </div>
                                        <div className="h-px bg-white/10 my-2" />
                                        <div>
                                            <div className="mb-3">
                                                <div className="font-medium text-sm">Execution Output</div>
                                                <p className="text-xs opacity-60">Choose console output verbosity</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button onClick={() => setExecutionMeta(false)} className={`relative rounded-xl border-2 transition-all overflow-hidden text-left h-28 flex flex-col ${!executionMeta ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/5' : 'border-transparent bg-black/10 hover:border-white/10'}`}>
                                                    <div className="flex-1 p-3 font-mono text-[10px] opacity-70 overflow-hidden leading-relaxed" style={{ color: themeConfig.ui.text }}>
                                                        <div className="flex gap-2"><span className="font-bold opacity-50">OUT</span> Hello World</div>
                                                    </div>
                                                    <div className={`p-2 px-3 border-t border-white/5 text-xs font-bold flex items-center justify-between ${!executionMeta ? 'text-blue-500' : 'opacity-50'}`} style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                                                        <span>Clean</span>
                                                        {!executionMeta && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />}
                                                    </div>
                                                </button>
                                                <button onClick={() => setExecutionMeta(true)} className={`relative rounded-xl border-2 transition-all overflow-hidden text-left h-28 flex flex-col ${executionMeta ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/5' : 'border-transparent bg-black/10 hover:border-white/10'}`}>
                                                    <div className="flex-1 p-3 font-mono text-[10px] opacity-70 overflow-hidden leading-relaxed" style={{ color: themeConfig.ui.text }}>
                                                        <div className="flex gap-2 italic opacity-50"><span className="font-bold">SYS</span> [Running]...</div>
                                                        <div className="flex gap-2"><span className="font-bold opacity-50">OUT</span> Hello World</div>
                                                        <div className="flex gap-2 italic opacity-50"><span className="font-bold">SYS</span> [Done] 0.1s</div>
                                                    </div>
                                                    <div className={`p-2 px-3 border-t border-white/5 text-xs font-bold flex items-center justify-between ${executionMeta ? 'text-blue-500' : 'opacity-50'}`} style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                                                        <span>Verbose</span>
                                                        {executionMeta && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />}
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeSection === 'accessories' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h4 className="font-bold text-lg mb-4">Accessories</h4>

                                    {/* FAB Toggle */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-sm">FAB Panel Controller</div>
                                            <p className="text-xs opacity-60">Floating button to toggle panels (Ctrl+Shift+F)</p>
                                        </div>
                                        <button onClick={() => setFabEnabled(!fabEnabled)} className={`text-2xl transition-colors ${fabEnabled ? 'text-blue-500' : 'text-slate-500'}`}>
                                            {fabEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                                        </button>
                                    </div>

                                    {/* FAB Color — only visible when FAB is enabled */}
                                    {fabEnabled && (
                                        <>
                                            <div className="h-px bg-white/10 my-2" />
                                            <div>
                                                <div className="font-medium text-sm mb-3">FAB Color</div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={() => setFabColor('colorful')}
                                                        className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${fabColor === 'colorful' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20'}`}
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 shrink-0" />
                                                        <div>
                                                            <div className="font-bold text-sm">Colorful</div>
                                                            <p className="text-[10px] opacity-60">Gradient accent</p>
                                                        </div>
                                                    </button>
                                                    <button
                                                        onClick={() => setFabColor('theme')}
                                                        className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${fabColor === 'theme' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20'}`}
                                                    >
                                                        <div className="w-8 h-8 rounded-full shrink-0" style={{ backgroundColor: themeConfig.ui.accent }} />
                                                        <div>
                                                            <div className="font-bold text-sm">Follow Theme</div>
                                                            <p className="text-[10px] opacity-60">Match workspace</p>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="h-px bg-white/10 my-2" />

                                    {/* Toast Sounds */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-sm">Toast Notification Sounds</div>
                                            <p className="text-xs opacity-60">Play sounds for join/leave notifications</p>
                                        </div>
                                        <button onClick={() => setToastSounds(!toastSounds)} className={`text-2xl transition-colors ${toastSounds ? 'text-blue-500' : 'text-slate-500'}`}>
                                            {toastSounds ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkspaceSettings;
