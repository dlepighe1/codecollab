import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    styles: any;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick, styles }) => (
    <div
        onClick={onClick}
        className={[
            styles.cardBg,
            'border',
            styles.cardBorder,
            'rounded-2xl p-6 relative overflow-hidden',
            // Specific properties — never transition: all
            'transition-[background,border-color,box-shadow,transform] duration-200',
            onClick ? [
                'cursor-pointer',
                // Hover: lift shadow, not translate (more intentional than -translate-y-1)
                'hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.5)] hover:border-white/15',
                // Active: press feedback — buttons must feel responsive
                'active:scale-[0.985] active:duration-100',
            ].join(' ') : '',
            className,
        ].join(' ')}
    >
        {children}
    </div>
);
