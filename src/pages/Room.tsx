
import React, { useEffect } from 'react';
import { useParams, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Workspace } from '../features/workspace/WorkspaceLayout';
import { RoomType } from '../types';

export const RoomPage = () => {
    const { type, roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Default values if navigated directly without setting up
    const { sessionName, language } = location.state || { sessionName: 'Untitled Session', language: 'javascript' };

    // Simple validation of room type
    const isValidType = (t: string | undefined): t is string => {
        return ['playground', 'collab', 'interview'].includes(t || '');
    };

    useEffect(() => {
        if (isValidType(type) && !roomId) {
            // Generate a random ID if none exists in URL and redirect
            const newId = `room-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            navigate(`/room/${type}/${newId}`, { replace: true, state: { sessionName, language } });
        }
    }, [type, roomId, navigate, sessionName, language]);

    if (!isValidType(type)) {
        return <Navigate to="/dashboard" />;
    }

    if (!roomId) {
        return <div className="h-screen w-full bg-[#0f172a] flex items-center justify-center text-white">Initializing Room...</div>;
    }

    const roomTypeMap: Record<string, RoomType> = {
        playground: 'Playground',
        collab: 'Collab',
        interview: 'Interview'
    };

    // No AppLayout wrapper here, Workspace handles its own layout
    return (
        <Workspace
            mode={roomTypeMap[type!]}
            sessionName={sessionName}
            language={language}
            roomId={roomId}
        />
    );
};
