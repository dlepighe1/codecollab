import React from 'react';
import { Users, PenTool, Bot, MonitorPlay } from 'lucide-react';

const FEATURE_CARDS = [
    {
        title: 'Real-Time Collaboration',
        description: 'Code with your team in real-time with < 30ms latency. See live cursors, selections, and edits from every participant.',
        icon: Users,
        color: '#60a5fa',
    },
    {
        title: 'Interactive Whiteboard',
        description: 'Sketch architecture diagrams, flowcharts, and wireframes on an infinite canvas before writing a single line of code.',
        icon: PenTool,
        color: '#a78bfa',
    },
    {
        title: 'AI-Powered Reviews',
        description: 'Get instant code analysis, optimization suggestions, and refactoring recommendations powered by AI.',
        icon: Bot,
        color: '#4ade80',
    },
    {
        title: 'Mock Interviews',
        description: 'Practice coding interviews with peers or AI. Timed sessions with split-screen code editor and interviewer view.',
        icon: MonitorPlay,
        color: '#fbbf24',
    },
];

export const FeaturesSection = () => {
    return (
        <section id="features" className="py-24 px-6 relative">
            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Everything you need to build together
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        A complete collaborative development environment with real-time editing, AI assistance, and interview tools.
                    </p>
                </div>

                {/* 4 horizontal cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {FEATURE_CARDS.map((card) => (
                        <div
                            key={card.title}
                            className="group bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                style={{ backgroundColor: `${card.color}15` }}
                            >
                                <card.icon className="w-5 h-5" style={{ color: card.color }} />
                            </div>
                            <h3 className="text-white font-bold text-sm mb-2">{card.title}</h3>
                            <p className="text-slate-400 text-xs leading-relaxed">{card.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
