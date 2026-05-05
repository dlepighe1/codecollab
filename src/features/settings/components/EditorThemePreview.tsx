import React from 'react';
import { Check } from 'lucide-react';
import { WorkspaceTheme } from '../../../types';
import { WORKSPACE_THEME_CONFIG } from '../../../constants';

export const EditorThemePreview = ({ theme, isActive, themeConfig }: any) => {
    const config = WORKSPACE_THEME_CONFIG[theme as WorkspaceTheme].ui;

    return (
        <div className={`relative w-full h-32 rounded-xl border-2 transition-all overflow-hidden flex flex-col ${isActive ? 'border-blue-500 shadow-xl' : `border-transparent ring-1 ring-white/10 opacity-80 hover:opacity-100 hover:ring-white/30`}`}>
            <div className="flex h-full text-[4px]" style={{ background: config.bg, color: config.text }}>
                {/* Mini Sidebar */}
                <div className="w-[15%] h-full border-r flex flex-col pt-2 items-center gap-1" style={{ background: config.sidebar, borderColor: config.border }}>
                    <div className="w-3 h-3 rounded opacity-20 bg-current"></div>
                    <div className="w-2 h-0.5 rounded opacity-20 bg-current"></div>
                    <div className="w-2 h-0.5 rounded opacity-20 bg-current"></div>
                </div>

                {/* Mini Editor */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <div className="h-[15%] border-b flex items-center px-2 gap-1" style={{ background: config.header, borderColor: config.border }}>
                        <div className="w-10 h-1.5 rounded-sm opacity-20 bg-current"></div>
                    </div>
                    {/* Code Area */}
                    <div className="flex-1 p-2 space-y-1">
                        <div className="flex gap-1"><div className="w-3 h-1 rounded-sm" style={{ background: config.accent }}></div><div className="w-10 h-1 rounded-sm opacity-40 bg-current"></div></div>
                        <div className="flex gap-1 pl-2"><div className="w-2 h-1 rounded-sm" style={{ background: config.secondaryAccent }}></div><div className="w-6 h-1 rounded-sm opacity-40 bg-current"></div></div>
                        <div className="flex gap-1"><div className="w-2 h-1 rounded-sm opacity-30 bg-current"></div></div>
                    </div>
                    {/* Terminal */}
                    <div className="h-[25%] border-t p-1" style={{ background: config.panelBg, borderColor: config.border }}>
                        <div className="flex gap-1 mb-0.5"><span className="opacity-50 text-[3px]">OUT</span> <span className="opacity-80">Hello World</span></div>
                    </div>
                </div>
            </div>
            <div className={`absolute bottom-0 inset-x-0 p-1.5 text-[10px] font-bold text-center backdrop-blur-md border-t bg-black/60 text-white border-white/5`}>
                {WORKSPACE_THEME_CONFIG[theme as WorkspaceTheme].name}
            </div>
            {isActive && <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5 z-10 shadow-sm"><Check className="w-3 h-3 text-white" /></div>}
        </div>
    );
};
