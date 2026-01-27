'use client';
import { PenTool, Cpu } from 'lucide-react';

export const FeatureVisual = ({ activeFeature }: { activeFeature: number }) => {
    switch(activeFeature) {
        case 0: return (
            <div className="w-full h-full bg-[#1e293b] rounded-xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col animate-in fade-in duration-500">
                <div className="h-6 bg-[#0f172a] border-b border-white/5 flex items-center px-2 gap-1.5 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <div className="p-4 font-mono text-[10px] text-slate-300 relative flex-1 bg-black/20">
                    <div className="flex gap-2">
                        <span className="text-slate-600">1</span>
                        <span><span className="text-purple-400">const</span> <span className="text-blue-400">mergeSort</span> = (arr) ={'>'} {'{'}</span>
                    </div>
                    {/* Mock cursors */}
                    <div className="absolute left-32 top-12">
                        <div className="w-[2px] h-4 bg-yellow-400 animate-pulse"></div>
                        <div className="absolute -top-4 left-0 bg-yellow-400 text-black text-[8px] font-bold px-1 rounded-sm">Alex</div>
                    </div>
                </div>
            </div>
        );
        case 1: return (
            <div className="w-full h-full bg-white rounded-xl shadow-2xl relative overflow-hidden animate-in fade-in duration-500">
                 <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.2 }}></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <PenTool className="w-12 h-12 text-purple-600 animate-bounce" />
                 </div>
            </div>
        );
        // ... (Cases 2 and 3 follow the same pattern)
        default: return null;
    }
}