import React, { useState, useEffect, useRef } from 'react';
import { getUserColor } from '../helpers/colors';

type ToolType = 'select' | 'hand' | 'pen' | 'rect' | 'circle' | 'triangle' | 'arrow' | 'line' | 'text' | 'eraser';

interface WBElement {
    id: string;
    type: ToolType;
    x: number;
    y: number;
    width?: number;
    height?: number;
    points?: { x: number, y: number }[];
    text?: string;
    color: string;
    strokeWidth: number;
}

interface WhiteboardProps {
    themeConfig: any;
    socket: any;
    roomId: string;
    user: any;
    initialElements: WBElement[];
    onUpdate: (elements: WBElement[]) => void;
}

const Whiteboard = ({ themeConfig, socket, roomId, user, initialElements, onUpdate }: WhiteboardProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [elements, setElements] = useState<WBElement[]>(initialElements || []);
    const [currentPath, setCurrentPath] = useState<{ x: number, y: number }[]>([]);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver(() => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (initialElements) setElements(initialElements);
    }, [initialElements]);

    useEffect(() => {
        if (!socket) return;
        const handler = (data: any) => {
            if (data.elements) setElements(data.elements);
        };
        socket.on('whiteboard:update', handler);
        return () => { socket.off('whiteboard:update', handler); };
    }, [socket]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, dimensions.width, dimensions.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        elements.forEach(el => {
            if (el.type === 'pen' && el.points && el.points.length > 0) {
                ctx.beginPath();
                ctx.strokeStyle = el.color;
                ctx.lineWidth = el.strokeWidth;
                ctx.moveTo(el.points[0].x, el.points[0].y);
                el.points.forEach(p => ctx.lineTo(p.x, p.y));
                ctx.stroke();
            }
        });

        if (currentPath.length > 0) {
            ctx.beginPath();
            ctx.strokeStyle = user ? getUserColor(user.id) : '#fff';
            ctx.lineWidth = 3;
            ctx.moveTo(currentPath[0].x, currentPath[0].y);
            currentPath.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.stroke();
        }
    }, [elements, currentPath, dimensions, user]);

    const getPoint = (e: React.MouseEvent) => {
        if (!canvasRef.current) return { x: 0, y: 0 };
        const rect = canvasRef.current.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDrawing(true);
        setCurrentPath([getPoint(e)]);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        setCurrentPath(prev => [...prev, getPoint(e)]);
    };

    const handleMouseUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        if (currentPath.length > 0) {
            const newElement: WBElement = {
                id: Date.now().toString(),
                type: 'pen',
                x: 0, y: 0,
                points: currentPath,
                color: user ? getUserColor(user.id) : '#fff',
                strokeWidth: 3
            };
            const newElements = [...elements, newElement];
            setElements(newElements);
            onUpdate(newElements);
            if (socket) socket.emit('whiteboard:draw', { roomId, elements: newElements });
            setCurrentPath([]);
        }
    };

    return (
        <div ref={containerRef} className="w-full h-full relative bg-white/5 cursor-crosshair overflow-hidden">
            <canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="absolute inset-0"
            />
            <div className="absolute top-4 left-4 pointer-events-none opacity-50 text-[10px] uppercase font-bold tracking-widest">
                Whiteboard (Collaboration Active)
            </div>
        </div>
    );
};

export default Whiteboard;
