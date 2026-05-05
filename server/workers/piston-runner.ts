import { parentPort } from 'worker_threads';

interface PistonRequest {
    language: string;
    version: string;
    code: string;
}

const PISTON_API_URL = process.env.VITE_PISTON_API_URL || 'https://emkc.org/api/v2/piston';

parentPort?.on('message', async (request: PistonRequest) => {
    try {
        const response = await fetch(`${PISTON_API_URL}/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language: request.language,
                version: request.version || '*',
                files: [{ content: request.code }],
            }),
        });

        const data = await response.json();
        parentPort?.postMessage({
            success: true,
            stdout: data.run?.stdout || '',
            stderr: data.run?.stderr || '',
            exitCode: data.run?.code || 0,
        });
    } catch (error: any) {
        parentPort?.postMessage({
            success: false,
            stdout: '',
            stderr: error.message || 'Execution failed',
            exitCode: 1,
        });
    }
});
