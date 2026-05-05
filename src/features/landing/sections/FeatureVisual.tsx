import React from 'react';
import { Users, PenTool, Bot, Video, Clock, Terminal, User } from 'lucide-react';

export const FEATURES = [
    {
        id: 0,
        title: "Real-Time Collaboration",
        desc: "See teammates type in real-time with live cursors.",
        icon: <Users className="w-5 h-5" />,
        color: "text-blue-400",
        bg: "bg-blue-500/20",
    },
    {
        id: 1,
        title: "Interactive Whiteboard",
        desc: "Sketch architecture diagrams before writing code.",
        icon: <PenTool className="w-5 h-5" />,
        color: "text-purple-400",
        bg: "bg-purple-500/20",
    },
    {
        id: 2,
        title: "AI Code Review",
        desc: "Get instant optimization suggestions inline.",
        icon: <Bot className="w-5 h-5" />,
        color: "text-green-400",
        bg: "bg-green-500/20",
    },
    {
        id: 3,
        title: "Mock Interviews",
        desc: "Practice coding interviews with a timer and split view.",
        icon: <Video className="w-5 h-5" />,
        color: "text-amber-400",
        bg: "bg-amber-500/20",
    }
];

export const FeatureVisual = ({ activeFeature }: { activeFeature: number }) => {
    switch(activeFeature) {
        case 0: // Collaboration
            return (
                <div className="w-full h-full bg-[#1e293b] rounded-xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col animate-fade-in">
                    <div className="h-6 bg-[#0f172a] border-b border-white/5 flex items-center px-2 gap-1.5 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div className="ml-2 w-20 h-3 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="p-4 font-mono text-[10px] sm:text-xs text-slate-300 relative flex-1 bg-black/20">
                        <div className="flex gap-2">
                            <span className="text-slate-600 select-none">1</span>
                            <span><span className="text-purple-400">const</span> <span className="text-blue-400">mergeSort</span> = (arr) ={'>'} {'{'}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-slate-600 select-none">2</span>
                            <span className="pl-4"><span className="text-purple-400">if</span> (arr.length {'<='} 1) <span className="text-purple-400">return</span> arr;</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-slate-600 select-none">3</span>
                            <span className="pl-4"><span className="text-purple-400">const</span> mid = Math.floor(arr.length / 2);</span>
                        </div>
                        <div className="flex gap-2 relative">
                            <span className="text-slate-600 select-none">4</span>
                            <span className="pl-4"><span className="text-purple-400">const</span> left = </span>
                            {/* Cursor 1 */}
                            <div className="absolute left-32 top-0">
                                <div className="w-[2px] h-4 bg-yellow-400 shadow-[0_0_8px_orange]"></div>
                                <div className="absolute -top-4 left-0 bg-yellow-400 text-black text-[8px] font-bold px-1 rounded-sm">Alex</div>
                            </div>
                        </div>
                        <div className="flex gap-2 relative mt-2">
                            <span className="text-slate-600 select-none">5</span>
                            <span className="pl-4 text-slate-500">// TODO: Implement merge function</span>
                            {/* Cursor 2 */}
                            <div className="absolute left-48 top-0">
                                <div className="w-[2px] h-4 bg-green-400 shadow-[0_0_8px_lime]"></div>
                                <div className="absolute -top-4 left-0 bg-green-400 text-black text-[8px] font-bold px-1 rounded-sm">Sarah</div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <span className="text-slate-600 select-none">6</span>
                             <span className="pl-4"><span className="text-purple-400">const</span> right = mergeSort(arr.slice(mid));</span>
                        </div>
                         <div className="flex gap-2">
                             <span className="text-slate-600 select-none">7</span>
                             <span className="pl-4"><span className="text-purple-400">return</span> merge(left, right);</span>
                        </div>
                         <div className="flex gap-2">
                             <span className="text-slate-600 select-none">8</span>
                             <span>{'}'}</span>
                        </div>
                    </div>
                </div>
            );
        case 1: // Whiteboard
            return (
                <div className="w-full h-full bg-white rounded-xl border border-white/10 shadow-2xl relative overflow-hidden animate-fade-in">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.3 }}></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        {/* Diagram */}
                        <div className="relative w-64 h-48 scale-110">
                            {/* Nodes */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-12 bg-white border-2 border-slate-900 rounded-lg flex items-center justify-center shadow-lg z-10">
                                <span className="text-xs font-bold text-slate-900">Client</span>
                            </div>

                            <div className="absolute top-1/2 left-4 w-16 h-12 bg-white border-2 border-blue-500 rounded-lg flex items-center justify-center shadow-lg z-10">
                                <span className="text-xs font-bold text-blue-500">API</span>
                            </div>

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-12 bg-white border-2 border-green-500 rounded-md flex items-center justify-center shadow-lg z-10">
                                <span className="text-xs font-bold text-green-500">DB</span>
                            </div>

                            <div className="absolute top-1/2 right-4 w-16 h-12 bg-white border-2 border-amber-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                <span className="text-xs font-bold text-amber-500">Cache</span>
                            </div>

                            {/* Edges */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                <path d="M128 64 L48 96" stroke="#0f172a" strokeWidth="2" strokeDasharray="4 2" />
                                <path d="M128 64 L208 96" stroke="#0f172a" strokeWidth="2" />
                                <path d="M48 144 L128 176" stroke="#0f172a" strokeWidth="2" />
                                <path d="M208 144 L128 176" stroke="#0f172a" strokeWidth="2" strokeDasharray="4 2" />
                            </svg>

                            {/* Drawing Tool */}
                            <div className="absolute top-1/2 left-1/2 transform translate-x-8 translate-y-6">
                                <PenTool className="w-8 h-8 text-purple-600 fill-purple-600/20 drop-shadow-lg" />
                                <div className="w-24 h-12 border-2 border-purple-600 rounded-[50%_20%] absolute -top-4 -left-12 opacity-50 -rotate-12"></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        case 2: // AI Review
            return (
                <div className="w-full h-full flex gap-2 p-3">
                    {/* Code side */}
                    <div className="flex-1 bg-[#0d1117] rounded-lg p-3 font-mono text-[10px] leading-relaxed overflow-hidden border border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex gap-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                            </div>
                            <span className="text-slate-500 text-[9px]">utils.ts</span>
                        </div>
                        <div className="text-slate-400">
                            <div><span className="text-purple-400">function</span> <span className="text-blue-300">processItems</span>(items) {'{'}</div>
                            <div className="pl-4"><span className="text-purple-400">const</span> result = [];</div>
                            <div className="pl-4 bg-red-500/15 border-l-2 border-red-500 -ml-1 pl-5">
                                <span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = 0; i {'<'} items.length; i++) {'{'}
                            </div>
                            <div className="pl-8 bg-red-500/10"><span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> j = 0; j {'<'} items.length; j++) {'{'}</div>
                            <div className="pl-12 bg-red-500/10">result.push(items[i] + items[j]);</div>
                            <div className="pl-8 bg-red-500/10">{'}'}</div>
                            <div className="pl-4 bg-red-500/10">{'}'}</div>
                            <div className="pl-4"><span className="text-purple-400">return</span> result;</div>
                            <div>{'}'}</div>
                        </div>
                    </div>
                    {/* AI chat side */}
                    <div className="w-[45%] bg-[#0d1117] rounded-lg p-3 border border-white/5 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Bot className="w-3 h-3 text-green-400" />
                            </div>
                            <span className="text-green-400 text-[10px] font-bold">AI Review</span>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2.5 mb-3">
                            <div className="text-green-400 text-[10px] font-bold mb-1">Optimization Found</div>
                            <p className="text-slate-300 text-[9px] leading-relaxed">
                                O(n²) nested loop detected. Use a <span className="text-green-300 font-mono">Map</span> for O(n) lookup instead of inner loop.
                            </p>
                        </div>
                        <div className="flex gap-2 mt-auto">
                            <button className="flex-1 bg-green-500/20 text-green-400 text-[9px] font-bold py-1.5 rounded-md border border-green-500/30">Apply Fix</button>
                            <button className="flex-1 bg-white/5 text-slate-400 text-[9px] font-bold py-1.5 rounded-md border border-white/10">Dismiss</button>
                        </div>
                    </div>
                </div>
            );
        case 3: // Mock Interview
            return (
                <div className="w-full h-full relative p-4 flex items-center justify-center gap-4">
                    {/* Floating timer — top-right */}
                    <div className="absolute top-3 right-3 bg-amber-500/20 border border-amber-500/30 rounded-lg px-3 py-1.5 flex items-center gap-2">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span className="text-amber-400 font-mono text-xs font-bold">23:45</span>
                    </div>

                    {/* Floating terminal badge — bottom-left */}
                    <div className="absolute bottom-3 left-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-3 py-1.5 flex items-center gap-2">
                        <Terminal className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 text-[9px] font-bold">Console Ready</span>
                    </div>

                    {/* You — left avatar */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-500/40 flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className="text-blue-400 text-[10px] font-bold">You</span>
                    </div>

                    {/* Center code card */}
                    <div className="flex-1 max-w-[200px] bg-[#0d1117] rounded-xl border border-white/10 p-4">
                        <div className="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-wider">Problem</div>
                        <div className="text-white text-sm font-bold mb-3">Reverse a Linked List</div>
                        <div className="font-mono text-[9px] text-slate-400 leading-relaxed">
                            <div><span className="text-purple-400">function</span> <span className="text-blue-300">reverse</span>(head) {'{'}</div>
                            <div className="pl-3"><span className="text-purple-400">let</span> prev = <span className="text-orange-300">null</span>;</div>
                            <div className="pl-3"><span className="text-purple-400">let</span> curr = head;<span className="inline-block w-[2px] h-3 bg-white/70 animate-pulse ml-0.5" /></div>
                            <div className="pl-3 text-slate-600">// ...</div>
                            <div>{'}'}</div>
                        </div>
                    </div>

                    {/* Interviewer — right avatar */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 border-2 border-purple-500/40 flex items-center justify-center">
                            <User className="w-6 h-6 text-purple-400" />
                        </div>
                        <span className="text-purple-400 text-[10px] font-bold">Interviewer</span>
                    </div>
                </div>
            );
        default: return null;
    }
}
