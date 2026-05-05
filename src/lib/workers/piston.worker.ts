const PISTON_API_URL = 'https://emkc.org/api/v2/piston';

self.onmessage = async (e: MessageEvent) => {
    const { language, code } = e.data;

    try {
        const response = await fetch(`${PISTON_API_URL}/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language,
                version: '*',
                files: [{ content: code }],
            }),
        });

        if (!response.ok) {
            throw new Error(`Piston API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        self.postMessage({
            success: true,
            output: data.run?.stdout || '',
            error: data.run?.stderr || '',
            exitCode: data.run?.code || 0,
        });
    } catch (error: any) {
        self.postMessage({
            success: false,
            output: '',
            error: error.message || 'Network Error: Could not reach execution server.',
            exitCode: 1,
        });
    }
};
