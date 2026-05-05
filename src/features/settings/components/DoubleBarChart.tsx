import React from 'react';

export const DoubleBarChart = ({ labels, data1, data2, color1, color2, theme }: any) => {
    const maxVal = Math.max(...data1, ...data2) || 10;

    return (
        <div className="w-full h-full flex items-end justify-between gap-2 min-h-[150px]">
            {labels.map((label: string, i: number) => {
                const h1 = (data1[i] / maxVal) * 100;
                const h2 = (data2[i] / maxVal) * 100;

                return (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1 group h-full justify-end">
                        <div className="w-full flex items-end justify-center gap-1 h-full relative">
                            {/* Bar 1 */}
                            <div
                                className="w-2.5 sm:w-4 rounded-t-sm transition-all duration-500 hover:opacity-80 relative group/bar"
                                style={{ height: `${h1}%`, backgroundColor: color1 }}
                            >
                                <div className={`absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity ${theme.textPrimary}`}>{data1[i]}</div>
                            </div>
                            {/* Bar 2 */}
                            <div
                                className="w-2.5 sm:w-4 rounded-t-sm transition-all duration-500 hover:opacity-80 relative group/bar"
                                style={{ height: `${h2}%`, backgroundColor: color2 }}
                            >
                                <div className={`absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity ${theme.textPrimary}`}>{data2[i]}</div>
                            </div>
                        </div>
                        <span className={`text-[10px] font-medium truncate w-full text-center ${theme.textSecondary}`}>{label}</span>
                    </div>
                );
            })}
        </div>
    );
};
