import React from 'react';

export const HeatmapGrid = ({ days, theme }: any) => {
    return (
        <div className="grid grid-rows-7 grid-flow-col gap-1.5 h-full w-full">
            {days.map((day: any, i: number) => {
                // Determine color based on intensity
                let bg = 'bg-white/5'; // Default empty
                if (day.intensity > 0) {
                    // Using orange spectrum as in the design mock
                    if (day.intensity < 3) bg = 'bg-orange-900/40';
                    else if (day.intensity < 6) bg = 'bg-orange-700/60';
                    else if (day.intensity < 8) bg = 'bg-orange-600';
                    else bg = 'bg-orange-500';
                } else if (theme.appBg === 'bg-slate-50') {
                    bg = 'bg-slate-200';
                }

                return (
                    <div
                        key={i}
                        className={`rounded-[2px] transition-all hover:scale-125 hover:z-10 relative group ${bg}`}
                        title={`${day.count} activities`}
                    >
                        {/* Tooltip */}
                        <div className={`hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] whitespace-nowrap z-20 shadow-lg ${theme.modalBg} border ${theme.cardBorder} ${theme.textPrimary}`}>
                            {day.count} activities
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
