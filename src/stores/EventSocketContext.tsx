
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../features/auth/hooks/useAuth';

const SOCKET_URL = 'http://localhost:3001';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string, config?: any) => void;
  leaveRoom: (roomId: string) => void;
  pauseRoom: (roomId: string) => void;
  getUserSessions: () => void;
  deleteSession: (roomId: string) => void;
  checkRoomExists: (roomId: string) => Promise<boolean>;
  updateUserStatus: (roomId: string, status: 'active' | 'away') => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      withCredentials: true,
      query: {
        userId: user?.id,
        userName: user?.name,
      }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
       console.warn("Socket connection failed. Ensure server.js is running.", err.message);
    });

    setSocket(newSocket);
    newSocket.connect();

    return () => {
      newSocket.close();
    };
  }, [user]);

  const checkRoomExists = (roomId: string): Promise<boolean> => {
      return new Promise((resolve) => {
          if (socket && isConnected) {
              socket.emit('check-room', { roomId }, (exists: boolean) => {
                  resolve(exists);
              });
          } else {
              resolve(false);
          }
      });
  };

  const joinRoom = (roomId: string, config?: any) => {
    if (socket && isConnected) {
      socket.emit('join-room', { roomId, user, config });
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit('leave-room', { roomId });
    }
  };

  const pauseRoom = (roomId: string) => {
    if (socket && isConnected && user?.id) {
        socket.emit('pause-room', { roomId, userId: user.id });
    }
  };

  const getUserSessions = () => {
      if (socket && isConnected && user?.id) {
          socket.emit('get-user-rooms', { userId: user.id });
      }
  };

  const deleteSession = (roomId: string) => {
      if (socket && isConnected && user?.id) {
          socket.emit('delete-room', { roomId, userId: user.id });
      }
  };

  const updateUserStatus = (roomId: string, status: 'active' | 'away') => {
      if (socket && isConnected && user?.id) {
          socket.emit('user:status-change', { roomId, userId: user.id, status });
      }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, joinRoom, leaveRoom, pauseRoom, getUserSessions, deleteSession, checkRoomExists, updateUserStatus }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
