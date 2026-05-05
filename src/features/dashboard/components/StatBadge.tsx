import React from 'react';

export const StatBadge = ({ icon, label, value, color, styles }: any) => (
    <div className={`flex items-center gap-3 p-3 rounded-2xl border ${styles.badgeBg} ${styles.badgeBorder}`}>
        <div className={`p-2 rounded-xl ${color} bg-opacity-20`}>
            {React.cloneElement(icon, { className: `w-4 h-4 ${color.replace('bg-', 'text-')}` })}
        </div>
        <div>
            <div className={`text-xs font-medium uppercase tracking-wide ${styles.statIconColor}`}>{label}</div>
            <div className={`font-bold leading-none mt-0.5 ${styles.heading}`}>{value}</div>
        </div>
    </div>
);
