import React from 'react';
import { ArrowRight } from 'lucide-react';

export const QuickAction = ({ title, sub, icon, gradient, onClick, colorClass, styles }: any) => (
    <button
        onClick={onClick}
        className={[
            'group relative w-full text-left overflow-hidden rounded-2xl border',
            // Specific transition properties — never transition-all
            'transition-[background,border-color,box-shadow,transform] duration-200',
            // Hover: shadow lift + subtle border brighten
            'hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)] hover:border-white/15',
            // Active: press feedback (scale 0.97 — subtle, immediate)
            'active:scale-[0.97] active:duration-[100ms]',
            styles.cardBg,
            styles.cardBorder,
        ].join(' ')}
    >
        {/* Gradient wash — lightens on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.07] group-hover:opacity-[0.13] transition-opacity duration-200`} />

        {/* Top-right corner accent line */}
        <div className={`absolute top-0 right-0 w-16 h-px bg-gradient-to-l ${gradient} opacity-30`} />

        <div className="p-5 relative z-10 flex flex-col h-full justify-between min-h-[148px]">
            <div className="flex justify-between items-start">
                {/* Icon — scale from its own origin, not center */}
                <div className={[
                    'p-2.5 rounded-xl ring-1 ring-white/10',
                    'transition-transform duration-200 origin-top-left',
                    'group-hover:scale-105',
                    colorClass,
                ].join(' ')}>
                    {icon}
                </div>
                {/* Arrow — slides in from right, fades in */}
                <div className={[
                    'w-7 h-7 rounded-full flex items-center justify-center',
                    'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0',
                    'transition-[opacity,transform] duration-200',
                    styles.iconContainer,
                ].join(' ')}>
                    <ArrowRight className={`w-3.5 h-3.5 ${styles.heading}`} />
                </div>
            </div>
            <div>
                <h3 className={`text-lg font-semibold mb-0.5 ${styles.heading}`}>
                    {title}
                </h3>
                <p className={`text-sm ${styles.subtext}`}>{sub}</p>
            </div>
        </div>
    </button>
);
