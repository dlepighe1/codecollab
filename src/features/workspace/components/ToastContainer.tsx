import React from 'react';
import { Info, Activity } from 'lucide-react';

interface Toast {
    id: string;
    message: string;
    type: 'info' | 'warning';
}

interface ToastContainerProps {
    toasts: Toast[];
    removeToast: (id: string) => void;
}

const ToastContainer = ({ toasts, removeToast }: ToastContainerProps) => {
    return (
        <div className="fixed bottom-10 right-6 z-[100] flex flex-col gap-2 pointer-events-none items-end">
            {toasts.map(toast => (
                <div key={toast.id} className="bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-white/10 shadow-xl flex items-center gap-2 animate-slide-in-right">
                    {toast.type === 'info' ? <Info className="w-4 h-4 text-blue-400"/> : <Activity className="w-4 h-4 text-orange-400"/>}
                    <span className="text-sm font-medium">{toast.message}</span>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
