
import React, { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, DevModeIndicator } from './features/auth/AuthContext';
import { ClerkAuthProvider } from './features/auth/ClerkAuthProvider';
import { SocketProvider } from './stores/EventSocketContext';

const LandingPage = lazy(() => import('./features/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const Dashboard = lazy(() => import('./features/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const RoomPage = lazy(() => import('./pages/Room').then(m => ({ default: m.RoomPage })));

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/" />;
    return <>{children}</>;
};

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-slate-900"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" /></div>}>
            <Routes>
                <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                {/* Route with optional roomId, though RoomPage will handle redirect if missing */}
                <Route path="/room/:type/:roomId" element={<ProtectedRoute><RoomPage /></ProtectedRoute>} />
                <Route path="/room/:type" element={<ProtectedRoute><RoomPage /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Suspense>
    );
};

export default function App() {
    return (
        <ClerkAuthProvider>
            <AuthProvider>
                <SocketProvider>
                    <HashRouter>
                        <AppRoutes />
                        <DevModeIndicator />
                    </HashRouter>
                </SocketProvider>
            </AuthProvider>
        </ClerkAuthProvider>
    );
}
