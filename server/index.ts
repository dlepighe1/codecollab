import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Hocuspocus } from '@hocuspocus/server';
import { WebSocketServer } from 'ws';
import { InMemoryStore, isRedisConfigured } from './services/redis';
import { addNodeToTree, deleteNodeFromTree, updateNodeInTree } from './helpers/tree';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// --- HOCUSPOCUS COLLABORATION SERVER ---
const hocuspocus = new Hocuspocus({
    onConnect: async ({ documentName }) => {
        console.log(`[Hocuspocus] Client connected to document: ${documentName}`);
    },
    onDisconnect: async ({ documentName }) => {
        console.log(`[Hocuspocus] Client disconnected from document: ${documentName}`);
    },
});

// Create a ws.WebSocketServer to handle the upgrade, then pass to Hocuspocus
const collabWss = new WebSocketServer({ noServer: true });

collabWss.on('connection', (ws, request) => {
    hocuspocus.handleConnection(ws, request);
});

server.on('upgrade', (request, socket, head) => {
    if (request.url?.startsWith('/collaboration')) {
        collabWss.handleUpgrade(request, socket, head, (ws) => {
            collabWss.emit('connection', ws, request);
        });
    }
    // Socket.IO handles its own upgrades on the default path automatically
});

// --- REDIS CONFIGURATION ---
let redisClient: any;

if (isRedisConfigured) {
    const { createClient } = await import('redis');
    redisClient = createClient({
        url: process.env.UPSTASH_REDIS_REST_URL,
        password: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    redisClient.on('error', (err: any) => console.log('Redis Client Error', err));
    await redisClient.connect();
    console.log('Connected to Upstash Redis');
} else {
    redisClient = new InMemoryStore();
    await redisClient.connect();
}

// --- LANGUAGE TEMPLATES ---
const LANGUAGE_TEMPLATES: Record<string, { ext: string; content: string }> = {
    'javascript': { ext: 'js', content: 'console.log("Hello CodeCollab!");' },
    'typescript': { ext: 'ts', content: 'const msg: string = "Hello CodeCollab!";\nconsole.log(msg);' },
    'python': { ext: 'py', content: 'print("Hello CodeCollab!")' },
    'java': { ext: 'java', content: 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello CodeCollab!");\n\t}\n}' },
    'cpp': { ext: 'cpp', content: '#include <iostream>\n\nint main() {\n\tstd::cout << "Hello CodeCollab!" << std::endl;\n\treturn 0;\n}' },
    'go': { ext: 'go', content: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello CodeCollab!")\n}' }
};

// --- SOCKET LOGIC ---
io.on('connection', (socket) => {
    const { userId } = socket.handshake.query;

    socket.on('check-room', async ({ roomId }, callback) => {
        try {
            const exists = await redisClient.exists(`room:${roomId}:config`);
            callback(exists === 1);
        } catch (e) {
            callback(false);
        }
    });

    socket.on('get-user-rooms', async ({ userId }) => {
        try {
            if (!userId) return;
            const roomIds = await redisClient.sMembers(`user:${userId}:rooms`);
            const rooms = [];
            for (const rId of roomIds) {
                const config = await redisClient.hGetAll(`room:${rId}:config`);
                const usersCount = await redisClient.hLen(`room:${rId}:users`);
                if (config && Object.keys(config).length > 0) {
                    rooms.push({ id: rId, name: config.name, type: config.type, language: config.language, lastActive: config.lastActive || config.created, participants: usersCount || 0, hostId: config.hostId });
                } else { await redisClient.sRem(`user:${userId}:rooms`, rId); }
            }
            rooms.sort((a: any, b: any) => Number(b.lastActive) - Number(a.lastActive));
            socket.emit('user-rooms-list', rooms);
        } catch (e) { socket.emit('user-rooms-list', []); }
    });

    socket.on('delete-room', async ({ roomId, userId }) => {
        try {
            await redisClient.sRem(`user:${userId}:rooms`, roomId);
            const config = await redisClient.hGetAll(`room:${roomId}:config`);
            if (config && config.hostId === userId) {
                await redisClient.del(`room:${roomId}:config`); await redisClient.del(`room:${roomId}:state`); await redisClient.del(`room:${roomId}:users`);
                io.to(roomId).emit('session-ended');
            } else {
                await redisClient.hDel(`room:${roomId}:users`, userId);
                io.to(roomId).emit('user:left', { userId });
            }
        } catch (e) { }
    });

    socket.on('join-room', async ({ roomId, user, config }) => {
        try {
            socket.join(roomId);
            const userWithSocket = { ...user, socketId: socket.id, status: 'active', activeTab: 'editor' };
            await redisClient.hSet(`room:${roomId}:users`, user.id, JSON.stringify(userWithSocket));
            await redisClient.sAdd(`user:${user.id}:rooms`, roomId);
            let roomConfig = await redisClient.hGetAll(`room:${roomId}:config`);
            const timestamp = Date.now().toString();
            if (!roomConfig || Object.keys(roomConfig).length === 0) {
                roomConfig = { language: config?.language || 'javascript', name: config?.name || 'Untitled Room', type: config?.type || 'Collab', created: timestamp, lastActive: timestamp, hostId: user.id };
                await redisClient.hSet(`room:${roomId}:config`, roomConfig);
            } else {
                await redisClient.hSet(`room:${roomId}:config`, 'lastActive', timestamp);
                roomConfig.lastActive = timestamp;
            }
            const roomState = await redisClient.hGetAll(`room:${roomId}:state`);
            let files = []; let whiteboard = [];
            if (roomState.files) { try { files = JSON.parse(roomState.files); } catch (e) { files = []; } }
            if (!files || files.length === 0) {
                const lang = roomConfig.language || 'javascript'; const langKey = lang === 'c++' ? 'cpp' : lang; const langConfig = LANGUAGE_TEMPLATES[langKey] || LANGUAGE_TEMPLATES['javascript'];
                files = [{ id: 'main', name: `main.${langConfig.ext}`, type: 'file', language: langKey, content: langConfig.content }];
                await redisClient.hSet(`room:${roomId}:state`, 'files', JSON.stringify(files));
            }
            if (roomState.whiteboard) { try { whiteboard = JSON.parse(roomState.whiteboard); } catch (e) { whiteboard = []; } }
            const usersMap = await redisClient.hGetAll(`room:${roomId}:users`);
            const participants = Object.values(usersMap).map((u: any) => JSON.parse(u));
            socket.emit('room-state', { files, whiteboard, participants });
            socket.emit('room-config', roomConfig);
            socket.to(roomId).emit('user:joined', userWithSocket);
        } catch (e) { socket.emit('room-state', { files: [], whiteboard: [], participants: [user] }); }
    });

    socket.on('user:presence-update', async ({ roomId, userId, activeTab }) => {
        try {
            const userData = await redisClient.hGet(`room:${roomId}:users`, userId);
            if (userData) {
                const user = JSON.parse(userData);
                user.activeTab = activeTab;
                await redisClient.hSet(`room:${roomId}:users`, userId, JSON.stringify(user));
                io.to(roomId).emit('user:updated', user);
            }
        } catch (e) { }
    });

    socket.on('user:status-change', async ({ roomId, userId, status }) => {
        try {
            const userData = await redisClient.hGet(`room:${roomId}:users`, userId);
            if (userData) {
                const user = JSON.parse(userData);
                user.status = status;
                await redisClient.hSet(`room:${roomId}:users`, userId, JSON.stringify(user));
                io.to(roomId).emit('user:updated', user);
            }
        } catch (e) { }
    });

    socket.on('pause-room', async ({ roomId, userId }) => {
        try {
            const userData = await redisClient.hGet(`room:${roomId}:users`, userId);
            await redisClient.hSet(`room:${roomId}:config`, 'lastActive', Date.now().toString());
            if (userData) {
                const user = JSON.parse(userData);
                user.status = 'paused';
                await redisClient.hSet(`room:${roomId}:users`, userId, JSON.stringify(user));
                io.to(roomId).emit('user:paused', { userId });
            }
        } catch (e) { }
    });

    socket.on('leave-room', async ({ roomId }) => { socket.leave(roomId); });
    socket.on('kick-user', async ({ roomId, targetUserId }) => { io.to(roomId).emit('user:kicked', { userId: targetUserId }); await redisClient.hDel(`room:${roomId}:users`, targetUserId); });

    socket.on('terminal:output', ({ roomId, line }) => { socket.to(roomId).emit('terminal:output', line); });

    socket.on('execute-code', async ({ language, code, roomId }, callback) => {
        try {
            const { executeCode } = await import('./services/piston.js');
            const result = await executeCode({ language, code });
            callback(result);
        } catch (error: any) {
            callback({ stdout: '', stderr: error.message, exitCode: 1 });
        }
    });

    socket.on('file:update', async ({ roomId, fileId, content }) => {
        socket.to(roomId).emit('file:update', { fileId, content });
        try {
            const roomFilesStr = await redisClient.hGet(`room:${roomId}:state`, 'files');
            let files = roomFilesStr ? JSON.parse(roomFilesStr) : [];
            updateNodeInTree(files, fileId, { content });
            await redisClient.hSet(`room:${roomId}:state`, 'files', JSON.stringify(files));
            await redisClient.hSet(`room:${roomId}:config`, 'lastActive', Date.now().toString());
        } catch (e) { }
    });

    socket.on('file:create', async ({ roomId, file, parentId }) => {
        socket.to(roomId).emit('file:create', { file, parentId });
        try {
            const roomFilesStr = await redisClient.hGet(`room:${roomId}:state`, 'files');
            let files = roomFilesStr ? JSON.parse(roomFilesStr) : [];
            addNodeToTree(files, parentId, file);
            await redisClient.hSet(`room:${roomId}:state`, 'files', JSON.stringify(files));
        } catch (e) { }
    });

    socket.on('file:rename', async ({ roomId, fileId, name }) => {
        socket.to(roomId).emit('file:rename', { fileId, name });
        try {
            const roomFilesStr = await redisClient.hGet(`room:${roomId}:state`, 'files');
            let files = roomFilesStr ? JSON.parse(roomFilesStr) : [];
            updateNodeInTree(files, fileId, { name });
            await redisClient.hSet(`room:${roomId}:state`, 'files', JSON.stringify(files));
        } catch (e) { }
    });

    socket.on('file:delete', async ({ roomId, fileId }) => {
        socket.to(roomId).emit('file:delete', { fileId });
        try {
            const roomFilesStr = await redisClient.hGet(`room:${roomId}:state`, 'files');
            let files = roomFilesStr ? JSON.parse(roomFilesStr) : [];
            deleteNodeFromTree(files, fileId);
            await redisClient.hSet(`room:${roomId}:state`, 'files', JSON.stringify(files));
        } catch (e) { }
    });

    socket.on('file:move', async ({ roomId, fileId, targetFolderId }) => {
        socket.to(roomId).emit('file:move', { fileId, targetFolderId });
        try {
            const roomFilesStr = await redisClient.hGet(`room:${roomId}:state`, 'files');
            let files = roomFilesStr ? JSON.parse(roomFilesStr) : [];

            // 1. Remove from old location
            const movedNode = deleteNodeFromTree(files, fileId);

            if (movedNode) {
                // 2. Add to new location (if targetFolderId is null, add to root)
                addNodeToTree(files, targetFolderId, movedNode);
                await redisClient.hSet(`room:${roomId}:state`, 'files', JSON.stringify(files));
            }
        } catch (e) { }
    });

    socket.on('whiteboard:draw', async ({ roomId, elements }) => {
        socket.to(roomId).emit('whiteboard:update', { elements });
        try { await redisClient.hSet(`room:${roomId}:state`, 'whiteboard', JSON.stringify(elements)); await redisClient.hSet(`room:${roomId}:config`, 'lastActive', Date.now().toString()); } catch (e) { }
    });

    socket.on('cursor:move-editor', ({ roomId, cursor }) => { socket.to(roomId).emit('cursor:editor', cursor); });
    socket.on('cursor:move-whiteboard', ({ roomId, cursor }) => { socket.to(roomId).emit('cursor:whiteboard', cursor); });

    socket.on('disconnecting', async () => {
        for (const roomId of socket.rooms) {
            if (roomId !== socket.id && userId) {
                const userData = await redisClient.hGet(`room:${roomId}:users`, userId);
                if (userData) {
                    const user = JSON.parse(userData);
                    user.status = 'paused'; await redisClient.hSet(`room:${roomId}:users`, userId, JSON.stringify(user));
                    socket.to(roomId).emit('user:paused', { userId });
                }
            }
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => { console.log(`Server running on http://localhost:${PORT}`); });
