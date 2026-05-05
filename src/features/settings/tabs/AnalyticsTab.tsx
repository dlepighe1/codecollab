import React, { useState, useMemo } from 'react';
import {
    Target, PieChart, TrendingUp, LayoutTemplate, MessageSquare, Cpu, Users,
    Flame, Award, Zap, ChevronLeft, ChevronRight, Lock
} from 'lucide-react';
import { SmoothAreaChart } from '../components/SmoothAreaChart';
import { DoubleBarChart } from '../components/DoubleBarChart';
import { HeatmapGrid } from '../components/HeatmapGrid';

export const AnalyticsTab = ({ user, theme, updateTier }: any) => {
    const [timeRange, setTimeRange] = useState<'Week' | 'Month' | 'Year'>('Week');
    const [metricView, setMetricView] = useState<'Time' | 'Interviews' | 'AI'>('Time');
    const [visibleSeries, setVisibleSeries] = useState({ overall: true, active: true, idle: false });

    const isPro = user?.tier !== 'Free';
    // Slider for insights
    const [insightSlide, setInsightSlide] = useState(0);

    // Mock Data
    const chartData = useMemo(() => {
        const days = timeRange === 'Week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        return days.map(day => ({
            label: day,
            overall: Math.floor(Math.random() * 8) + 4,
            active: Math.floor(Math.random() * 5) + 2,
            idle: Math.floor(Math.random() * 2) + 1
        }));
    }, [timeRange]);

    const categories = [
        { key: 'overall', label: 'Overall Time', color: '#3b82f6', visible: visibleSeries.overall },
        { key: 'active', label: 'Active Coding', color: '#10b981', visible: visibleSeries.active },
        { key: 'idle', label: 'Idle Time', color: '#f59e0b', visible: visibleSeries.idle },
    ];

    const toggleSeries = (key: 'overall' | 'active' | 'idle') => {
        // Prevent disabling the last visible series
        if (visibleSeries[key] && Object.values(visibleSeries).filter(Boolean).length === 1) return;
        setVisibleSeries(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const challengeData = {
        labels: ['Arrays', 'DP', 'Graphs', 'Trees', 'Strings'],
        total: [15, 8, 5, 10, 12],
        success: [12, 3, 2, 8, 10]
    };

    const heatmapDays = Array.from({ length: 35 }, (_, i) => ({
        date: `Day ${i}`,
        active: Math.random() > 0.3,
        count: Math.floor(Math.random() * 10),
        intensity: Math.floor(Math.random() * 10)
    }));

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className={`text-2xl font-bold mb-1 ${theme.textPrimary}`}>Usage & Analytics</h3>
                    <p className={`text-sm ${theme.textSecondary}`}>Deep dive into your coding habits and performance.</p>
                </div>
                <div className={`flex p-1 rounded-xl ${theme.inputBg} ${theme.panelBorder} border`}>
                    {['Week', 'Month', 'Year'].map(range => (
                        <button key={range} onClick={() => setTimeRange(range as any)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === range ? `${theme.accentBg} text-white shadow-md` : `${theme.textTertiary} hover:text-white`}`}>{range}</button>
                    ))}
                </div>
            </div>

            {/* PRIMARY CHART CARD - Redesigned Layout */}
            <div className={`p-6 rounded-3xl border ${theme.cardBg} ${theme.cardBorder} relative overflow-hidden flex flex-col`}>
                {/* Header Row: Title & Action Buttons */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h4 className={`text-xl font-bold ${theme.textPrimary}`}>Total Time</h4>
                    <div className="flex gap-2">
                        <button onClick={() => setMetricView('Time')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${metricView === 'Time' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : `border-transparent ${theme.inactiveItem}`}`}>Time Coded</button>
                        <button onClick={() => setMetricView('Interviews')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${metricView === 'Interviews' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : `border-transparent ${theme.inactiveItem}`}`}>Interviews</button>
                        <button onClick={() => setMetricView('AI')} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${metricView === 'AI' ? 'bg-green-500/20 border-green-500 text-green-400' : `border-transparent ${theme.inactiveItem}`}`}>AI Usage</button>
                    </div>
                </div>

                {/* Main Graph Area */}
                <div className="flex-1 w-full min-h-[280px] flex items-center justify-center">
                    {metricView === 'Time' ? (
                        <SmoothAreaChart data={chartData} categories={categories} height={280} theme={theme} />
                    ) : (
                        <div className="h-[280px] w-full flex items-center justify-center opacity-50 text-sm font-mono border-2 border-dashed border-white/10 rounded-xl">
                            Chart data for {metricView} coming soon
                        </div>
                    )}
                </div>

                {/* Legend Row - Below X-Axis */}
                <div className="flex flex-wrap gap-6 justify-center mt-6 border-t border-white/5 pt-4">
                    {categories.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => toggleSeries(cat.key as any)}
                            className={`flex items-center gap-2 text-xs font-bold transition-all duration-300 px-3 py-1.5 rounded-lg hover:bg-white/5 ${cat.visible ? 'opacity-100 scale-105' : 'opacity-40 grayscale'}`}
                        >
                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }}></div>
                            <span style={{ color: cat.visible ? theme.textPrimary : theme.textTertiary }}>{cat.label}</span>
                        </button>
                    ))}
                </div>

                {/* Stats Footer - Bottom of Card */}
                <div className="mt-6 pt-2 flex flex-col items-start md:items-center md:flex-row gap-4 justify-between bg-black/10 -mx-6 -mb-6 p-6 border-t border-white/5">
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-4xl font-bold tracking-tight ${theme.textPrimary}`}>42.5h</span>
                            <span className={`text-sm font-medium ${theme.textSecondary}`}>total recorded</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit">
                                <TrendingUp className="w-3 h-3" /> +12%
                            </span>
                            <span className={`text-xs ${theme.textTertiary}`}>vs. previous {timeRange.toLowerCase()}</span>
                        </div>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${theme.textTertiary}`}>Top Day</div>
                        <div className={`text-xl font-bold ${theme.textPrimary}`}>Wednesday</div>
                        <div className={`text-xs ${theme.textSecondary}`}>8.5 hours active</div>
                    </div>
                </div>
            </div>

            {/* SECONDARY ROW: Challenge Progress & Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Challenge Progress */}
                <div className={`p-6 rounded-3xl border flex flex-col ${theme.cardBg} ${theme.cardBorder}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h4 className={`text-sm font-bold flex items-center gap-2 ${theme.textPrimary}`}><Target className="w-4 h-4 text-blue-400" /> Challenge Progress</h4>
                    </div>
                    <DoubleBarChart labels={challengeData.labels} data1={challengeData.total} data2={challengeData.success} color1="#3b82f6" color2="#10b981" theme={theme} />
                    <div className="flex justify-center gap-4 mt-4 text-[10px] font-bold uppercase tracking-wider opacity-60">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-sm"></div> Total</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-sm"></div> Solved</span>
                    </div>
                </div>

                {/* Performance Donut with Slider View */}
                <div className={`p-6 rounded-3xl border flex flex-col relative overflow-hidden group ${theme.cardBg} ${theme.cardBorder}`}>
                    <div className="flex justify-between items-center mb-2 z-10">
                        <h4 className={`text-sm font-bold flex items-center gap-2 ${theme.textPrimary}`}><PieChart className="w-4 h-4 text-amber-400" /> Performance</h4>
                        <div className="flex gap-1 bg-black/20 p-1 rounded-lg">
                            <button onClick={() => { }} className="w-2 h-2 rounded-full bg-white opacity-100"></button>
                            <button onClick={() => { }} className="w-2 h-2 rounded-full bg-white opacity-30 hover:opacity-70"></button>
                        </div>
                    </div>

                    {/* View A: Donut */}
                    <div className="flex-1 flex items-center justify-center gap-8 relative z-10">
                        <div className="relative">
                            <svg width="140" height="140" viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }}>
                                {/* Donut segments manually calculated for demo */}
                                <path d="M 1 0 A 1 1 0 0 1 0.5 0.866" fill="none" stroke="#10b981" strokeWidth="0.2" /> {/* Completed */}
                                <path d="M 0.5 0.866 A 1 1 0 0 1 -0.5 0.866" fill="none" stroke="#f59e0b" strokeWidth="0.2" /> {/* In Progress */}
                                <path d="M -0.5 0.866 A 1 1 0 1 1 1 0" fill="none" stroke="#64748b" strokeWidth="0.2" opacity="0.3" /> {/* Not Started */}
                            </svg>
                            <div className={`absolute inset-0 flex flex-col items-center justify-center ${theme.textPrimary}`}>
                                <span className="text-2xl font-bold">68%</span>
                                <span className="text-[10px] opacity-60 uppercase">Success</span>
                            </div>
                        </div>
                        <div className="space-y-3 text-xs">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500"></div><span className={theme.textSecondary}>Completed</span><span className={`font-bold ${theme.textPrimary}`}>24</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500"></div><span className={theme.textSecondary}>In Progress</span><span className={`font-bold ${theme.textPrimary}`}>8</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-600"></div><span className={theme.textSecondary}>Not Started</span><span className={`font-bold ${theme.textPrimary}`}>45</span></div>
                        </div>
                    </div>

                    {/* Click zones for sliding (simulated) */}
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer hover:bg-white/5"><ChevronLeft className="w-4 h-4 text-white" /></div>
                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer hover:bg-white/5"><ChevronRight className="w-4 h-4 text-white" /></div>
                </div>
            </div>

            {/* LARGE DEEP INSIGHTS CARD (60/40 Split) */}
            <div className={`rounded-3xl border overflow-hidden flex flex-col lg:flex-row relative min-h-[320px] ${theme.cardBg} ${theme.cardBorder}`}>

                {/* Floating Tabs for Views */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/10">
                    <button onClick={() => setInsightSlide(0)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${insightSlide === 0 ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>Streak</button>
                    <button onClick={() => setInsightSlide(1)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${insightSlide === 1 ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>Difficulty</button>
                    <button onClick={() => setInsightSlide(2)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${insightSlide === 2 ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}>Efficiency {isPro ? '' : '🔒'}</button>
                </div>

                {/* Left Side (Visuals) 60% */}
                <div className={`lg:w-[60%] p-8 flex flex-col justify-center border-b lg:border-b-0 lg:border-r ${theme.panelBorder} relative`}>
                    {insightSlide === 0 && (
                        <div className="animate-fade-in h-full flex flex-col">
                            <h4 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme.textPrimary}`}><Flame className="w-5 h-5 text-orange-500" /> Coding Activity</h4>
                            <div className="flex-1 min-h-[180px] w-full">
                                <HeatmapGrid days={heatmapDays} theme={theme} />
                            </div>
                            <div className="flex justify-between items-end mt-4">
                                <div>
                                    <div className="text-xs opacity-50 mb-1">Current Streak</div>
                                    <div className={`text-3xl font-bold ${theme.textPrimary}`}>5 Days</div>
                                </div>
                                <div>
                                    <div className="text-xs opacity-50 mb-1">Longest Streak</div>
                                    <div className={`text-xl font-bold ${theme.textPrimary} opacity-70`}>14 Days</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {insightSlide === 1 && (
                        <div className="animate-fade-in space-y-6">
                            <h4 className={`text-lg font-bold flex items-center gap-2 ${theme.textPrimary}`}><Award className="w-5 h-5 text-yellow-500" /> Problem Distribution</h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1"><span className="text-green-400 font-bold">Easy</span><span className={theme.textPrimary}>24 (60%)</span></div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[60%]"></div></div>
                                    <div className="flex justify-between text-[10px] opacity-50 mt-1"><span>Avg. Time: 5m</span><span>Success: 98%</span></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1"><span className="text-amber-400 font-bold">Medium</span><span className={theme.textPrimary}>12 (30%)</span></div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-amber-500 w-[30%]"></div></div>
                                    <div className="flex justify-between text-[10px] opacity-50 mt-1"><span>Avg. Time: 18m</span><span>Success: 75%</span></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1"><span className="text-red-400 font-bold">Hard</span><span className={theme.textPrimary}>4 (10%)</span></div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-red-500 w-[10%]"></div></div>
                                    <div className="flex justify-between text-[10px] opacity-50 mt-1"><span>Avg. Time: 45m</span><span>Success: 40%</span></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {insightSlide === 2 && (
                        <div className="animate-fade-in relative h-full flex flex-col">
                            {!isPro && (
                                <div className="absolute inset-0 z-10 backdrop-blur-sm bg-black/20 flex flex-col items-center justify-center text-center p-6">
                                    <Lock className="w-12 h-12 text-white mb-3" />
                                    <h3 className="text-xl font-bold text-white">Pro Analytics</h3>
                                    <p className="text-sm text-slate-300 mb-4 max-w-xs">Upgrade to see your efficiency trends, skill radar, and personalized growth path.</p>
                                    <button onClick={() => updateTier('Pro')} className="px-6 py-2 bg-white text-black font-bold rounded-xl shadow-lg hover:scale-105 transition">Upgrade to Pro</button>
                                </div>
                            )}
                            <h4 className={`text-lg font-bold flex items-center gap-2 ${theme.textPrimary}`}><Zap className="w-5 h-5 text-blue-400" /> Efficiency Trend</h4>
                            <div className="flex-1 flex items-end pb-4 opacity-50">
                                {/* Fake Line Chart Placeholder */}
                                <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                                    <path d="M0,40 Q20,20 40,35 T80,10 T100,5" fill="none" stroke="#3b82f6" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side (Insights) 40% */}
                <div className="lg:w-[40%] bg-white/5 p-8 flex flex-col justify-center">
                    {insightSlide === 0 && (
                        <div className="animate-fade-in">
                            <div className="mb-6">
                                <div className="text-sm opacity-50 font-bold uppercase tracking-widest mb-1">Consistency Score</div>
                                <div className={`text-5xl font-bold ${theme.textPrimary}`}>92<span className="text-2xl text-green-400">%</span></div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                                <p className={`text-sm italic ${theme.textSecondary}`}>"You're more consistent than 85% of users. Keep the fire burning!"</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs opacity-60">
                                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Active 24/30 days this month
                            </div>
                        </div>
                    )}

                    {insightSlide === 1 && (
                        <div className="animate-fade-in">
                            <div className="mb-6">
                                <div className="text-sm opacity-50 font-bold uppercase tracking-widest mb-1">Current Level</div>
                                <div className={`text-4xl font-bold ${theme.textPrimary}`}>Level 4</div>
                                <div className="w-full bg-white/10 h-1.5 mt-3 rounded-full"><div className="bg-purple-500 w-[75%] h-full rounded-full"></div></div>
                                <div className="text-xs text-right mt-1 opacity-60">750 / 1000 XP</div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs font-bold text-blue-400 mb-1">Recommendation</div>
                                    <p className={`text-sm ${theme.textSecondary}`}>Try solving 2 Medium Graph problems to level up your structural thinking.</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 rounded bg-white/5 text-[10px] border border-white/10">Algorithms</span>
                                    <span className="px-2 py-1 rounded bg-white/5 text-[10px] border border-white/10">System Design</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {insightSlide === 2 && (
                        <div className="animate-fade-in opacity-50 filter blur-[1px]">
                            <div className="mb-6">
                                <div className="text-sm opacity-50 font-bold uppercase tracking-widest mb-1">Time Efficiency</div>
                                <div className={`text-4xl font-bold ${theme.textPrimary}`}>+15%</div>
                                <p className="text-xs mt-2 opacity-60">Faster than last month</p>
                            </div>
                            <div className="space-y-3">
                                <div className="h-2 bg-white/10 rounded w-full"></div>
                                <div className="h-2 bg-white/10 rounded w-[80%]"></div>
                                <div className="h-2 bg-white/10 rounded w-[60%]"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* BOTTOM STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Opened Rooms */}
                <div className={`p-5 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><LayoutTemplate className="w-12 h-12" /></div>
                    <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${theme.textTertiary}`}>Opened Rooms</div>
                    <div className="space-y-3 mt-4">
                        <div className="flex justify-between text-xs p-2 rounded bg-white/5 border border-white/5"><span className={theme.textSecondary}>Active Collab</span><span className={`font-bold ${theme.textPrimary}`}>3</span></div>
                        <div className="flex justify-between text-xs p-2 rounded bg-white/5 border border-white/5"><span className={theme.textSecondary}>Paused</span><span className={`font-bold ${theme.textPrimary}`}>5</span></div>
                        <div className="flex justify-between text-xs p-2 rounded bg-white/5 border border-white/5"><span className={theme.textSecondary}>Playgrounds</span><span className={`font-bold ${theme.textPrimary}`}>8</span></div>
                    </div>
                </div>

                {/* Interviews */}
                <div className={`p-5 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><MessageSquare className="w-12 h-12" /></div>
                    <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${theme.textTertiary}`}>Interviews</div>
                    <div className="space-y-3 mt-4">
                        <div className="flex justify-between items-center p-2 rounded bg-purple-500/10 border border-purple-500/20">
                            <div className="flex gap-2 items-center"><Cpu className="w-4 h-4 text-purple-400" /><span className="text-xs font-bold text-purple-200">AI Mock</span></div>
                            <span className="text-lg font-bold text-purple-400">12</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-blue-500/10 border border-blue-500/20">
                            <div className="flex gap-2 items-center"><Users className="w-4 h-4 text-blue-400" /><span className="text-xs font-bold text-blue-200">Peer 2 Peer</span></div>
                            <span className="text-lg font-bold text-blue-400">4</span>
                        </div>
                    </div>
                </div>

                {/* Most Used Languages */}
                <div className={`p-5 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} relative overflow-hidden group`}>
                    <div className={`text-xs font-bold uppercase tracking-wider mb-4 ${theme.textTertiary}`}>Top Languages</div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs mb-1"><span className={theme.textPrimary}>TypeScript</span><span className="opacity-60">45%</span></div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full"><div className="h-full bg-blue-500 w-[45%] rounded-full"></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1"><span className={theme.textPrimary}>Python</span><span className="opacity-60">30%</span></div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full"><div className="h-full bg-green-500 w-[30%] rounded-full"></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1"><span className={theme.textPrimary}>Go</span><span className="opacity-60">15%</span></div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full"><div className="h-full bg-cyan-500 w-[15%] rounded-full"></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
