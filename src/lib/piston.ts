export const isPistonConfigured = !!import.meta.env.VITE_PISTON_API_URL;

interface ExecuteResult {
    output: string;
    error: string;
    exitCode: number;
}

export const executeCode = async (language: string, code: string): Promise<ExecuteResult> => {
    if (!isPistonConfigured) {
        console.info('[Piston] Mock mode — returning simulated output.');
        return {
            output: '[Mock] Code execution simulated.\nHello CodeCollab!',
            error: '',
            exitCode: 0,
        };
    }

    return new Promise((resolve) => {
        const worker = new Worker(
            new URL('./workers/piston.worker.ts', import.meta.url),
            { type: 'module' }
        );

        const timeout = setTimeout(() => {
            worker.terminate();
            resolve({ output: '', error: 'Execution timed out after 30 seconds.', exitCode: 1 });
        }, 30000);

        worker.onmessage = (e: MessageEvent) => {
            clearTimeout(timeout);
            worker.terminate();
            resolve({
                output: e.data.output || '',
                error: e.data.error || '',
                exitCode: e.data.exitCode || 0,
            });
        };

        worker.onerror = () => {
            clearTimeout(timeout);
            worker.terminate();
            resolve({ output: '', error: 'Worker error during code execution.', exitCode: 1 });
        };

        worker.postMessage({ language, code });
    });
};
