import { Users, PenTool, Cpu, Video, LucideIcon } from 'lucide-react';

export interface Feature {
    id: number;
    title: string;
    desc: string;
    Icon: LucideIcon; // Store the component, not the element
    color: string;
    bg: string;
}

export const FEATURES: Feature[] = [
    {
        id: 0,
        title: "Real-Time Collaboration",
        desc: "Code with your team live with < 30ms latency.",
        Icon: Users,
        color: "text-blue-400",
        bg: "bg-blue-500/20",
    },
    {
        id: 1,
        title: "Interactive Whiteboard",
        desc: "Brainstorm logic flows before writing code.",
        Icon: PenTool,
        color: "text-purple-400",
        bg: "bg-purple-500/20",
    },
    {
        id: 2,
        title: "AI-Powered Reviews",
        desc: "Instant feedback & refactoring suggestions.",
        Icon: Cpu,
        color: "text-green-400",
        bg: "bg-green-500/20",
    },
    {
        id: 3,
        title: "Mock Interviews",
        desc: "Practice with AI or peers in split-screen.",
        Icon: Video,
        color: "text-amber-400",
        bg: "bg-amber-500/20",
    }
];