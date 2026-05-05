import React, { useState, useEffect, useRef } from 'react';

export const SmoothAreaChart = ({ data, categories, height = 300, theme }: any) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate maximum value for Y-axis scaling
    const allValues = data.flatMap((d: any) => categories.filter((c: any) => c.visible).map((c: any) => d[c.key] || 0));
    const maxVal = Math.max(...allValues) || 10;
    const maxValue = Math.ceil(maxVal * 1.1); // Add 10% headroom

    // Constants for layout
    const paddingLeft = 40;
    const paddingBottom = 24;
    const paddingTop = 20;

    // Responsive width handler
    const [width, setWidth] = useState(0);
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(entries => {
            setWidth(entries[0].contentRect.width);
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Coordinate mapping functions
    const getX = (index: number) => {
        if (data.length <= 1) return paddingLeft;
        const availableWidth = width - paddingLeft;
        return paddingLeft + (index / (data.length - 1)) * availableWidth;
    };

    const getY = (value: number) => {
        const availableHeight = height - paddingBottom - paddingTop;
        return (height - paddingBottom) - (value / maxValue) * availableHeight;
    };

    // Path generator
    const getPath = (key: string) => {
        if (data.length < 2) return "";
        const points = data.map((d: any, i: number) => [getX(i), getY(d[key] || 0)]);

        return points.reduce((acc: string, point: number[], i: number, a: number[][]) => {
            if (i === 0) return `M ${point[0]},${point[1]}`;
            const [x, y] = point;
            const [prevX, prevY] = a[i - 1];
            const cp1x = prevX + (x - prevX) * 0.5;
            const cp1y = prevY;
            const cp2x = prevX + (x - prevX) * 0.5;
            const cp2y = y;
            return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
        }, "");
    };

    const getAreaPath = (key: string) => {
        const linePath = getPath(key);
        if (!linePath) return "";
        const lastX = getX(data.length - 1);
        const firstX = getX(0);
        const bottomY = height - paddingBottom;
        return `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
    };

    // Handle mouse move for tooltip
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;

        // Find nearest index
        const availableWidth = width - paddingLeft;
        const relativeX = Math.max(0, Math.min(x - paddingLeft, availableWidth));
        const index = Math.round((relativeX / availableWidth) * (data.length - 1));

        setHoverIndex(index);
    };

    const handleMouseLeave = () => {
        setHoverIndex(null);
    };

    if (width === 0) return <div ref={containerRef} className="w-full" style={{ height }} />;

    return (
        <div
            ref={containerRef}
            className="w-full relative select-none"
            style={{ height }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <svg width="100%" height="100%" className="overflow-visible">
                <defs>
                    {categories.map((cat: any) => (
                        <linearGradient key={cat.key} id={`grad-${cat.key}`} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={cat.color} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={cat.color} stopOpacity="0" />
                        </linearGradient>
                    ))}
                </defs>

                {/* Grid Lines - Horizontal */}
                {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
                    const y = getY(maxValue * tick);
                    return (
                        <g key={tick}>
                            <line
                                x1={paddingLeft}
                                y1={y}
                                x2={width}
                                y2={y}
                                stroke={theme.textPrimary}
                                strokeOpacity="0.15"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                            {/* Y-Axis Label */}
                            <text
                                x={paddingLeft - 8}
                                y={y + 3}
                                textAnchor="end"
                                fontSize="11"
                                fill={theme.textSecondary}
                                className="font-bold opacity-80"
                            >
                                {Math.round(maxValue * tick)}h
                            </text>
                        </g>
                    );
                })}

                {/* X-Axis Labels */}
                {data.map((d: any, i: number) => {
                    const x = getX(i);
                    return (
                        <g key={i}>
                            {/* Axis Label */}
                            <text
                                x={x}
                                y={height - 5}
                                textAnchor="middle"
                                fontSize="11"
                                fill={theme.textSecondary}
                                className="font-bold opacity-80"
                            >
                                {d.label}
                            </text>
                        </g>
                    );
                })}

                {/* Data Paths */}
                {categories.filter((c: any) => c.visible).map((cat: any) => (
                    <g key={cat.key}>
                        <path d={getAreaPath(cat.key)} fill={`url(#grad-${cat.key})`} />
                        <path d={getPath(cat.key)} fill="none" stroke={cat.color} strokeWidth="3" strokeLinecap="round" />
                    </g>
                ))}

                {/* Interactive Elements */}
                {hoverIndex !== null && data[hoverIndex] && (
                    <g>
                        {/* Vertical Line */}
                        <line
                            x1={getX(hoverIndex)}
                            y1={paddingTop}
                            x2={getX(hoverIndex)}
                            y2={height - paddingBottom}
                            stroke={theme.textPrimary}
                            strokeOpacity="0.3"
                            strokeWidth="1"
                        />

                        {/* Data Points */}
                        {categories.filter((c: any) => c.visible).map((cat: any) => (
                            <circle
                                key={cat.key}
                                cx={getX(hoverIndex)}
                                cy={getY(data[hoverIndex][cat.key] || 0)}
                                r="5"
                                fill={theme.appBg} // Using solid app bg to clear line behind
                                stroke={cat.color}
                                strokeWidth="2.5"
                            />
                        ))}
                    </g>
                )}
            </svg>

            {/* Tooltip HTML Overlay */}
            {hoverIndex !== null && data[hoverIndex] && (
                <div
                    className={`absolute z-20 pointer-events-none p-3 rounded-xl border shadow-2xl backdrop-blur-md ${theme.cardBg} ${theme.cardBorder}`}
                    style={{
                        left: Math.min(width - 140, Math.max(0, getX(hoverIndex) + 15)),
                        top: paddingTop
                    }}
                >
                    <div className={`text-xs font-bold mb-2 ${theme.textPrimary} border-b border-white/10 pb-1`}>{data[hoverIndex].label} Stats</div>
                    <div className="space-y-1.5">
                        {categories.filter((c: any) => c.visible).map((cat: any) => (
                            <div key={cat.key} className="flex items-center gap-2 text-xs">
                                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                                <span className={`${theme.textSecondary} font-medium`}>{cat.label}:</span>
                                <span className={`font-mono font-bold ${theme.textPrimary} ml-auto`}>
                                    {data[hoverIndex][cat.key]}h
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
