export interface PistonExecuteOptions {
    language: string;
    version?: string;
    code: string;
    stdin?: string;
}

export interface PistonResult {
    stdout: string;
    stderr: string;
    exitCode: number;
}

const PISTON_API_URL = process.env.VITE_PISTON_API_URL || 'https://emkc.org/api/v2/piston';

export async function executeCode(options: PistonExecuteOptions): Promise<PistonResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
        const response = await fetch(`${PISTON_API_URL}/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language: options.language,
                version: options.version || '*',
                files: [{ content: options.code }],
            }),
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`Piston API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return {
            stdout: data.run?.stdout || '',
            stderr: data.run?.stderr || '',
            exitCode: data.run?.code || 0,
        };
    } finally {
        clearTimeout(timeout);
    }
}
