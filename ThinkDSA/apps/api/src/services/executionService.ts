import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const TIMEOUT = 5000; // 5 seconds

// WARNING: This is a non-sandboxed execution service for MVP only.
// It is NOT secure for production use with untrusted code.
// In production, use Docker-based sandboxing or an external API like Piston.

export const executeCode = async (language: 'python' | 'javascript', code: string, input: string): Promise<{ stdout: string; stderr: string }> => {
    const jobId = uuidv4();
    const tempDir = path.join(__dirname, '../../temp');

    // Ensure temp dir exists
    await fs.mkdir(tempDir, { recursive: true });

    let command = '';
    let filePath = '';

    try {
        if (language === 'python') {
            filePath = path.join(tempDir, `${jobId}.py`);
            await fs.writeFile(filePath, code);
            // Escape input for echo piping or write to file? 
            // Better to write input to a file and redirect stdin
            const inputPath = path.join(tempDir, `${jobId}.in`);
            await fs.writeFile(inputPath, input);
            command = `python "${filePath}" < "${inputPath}"`; // Command to run
        } else if (language === 'javascript') {
            filePath = path.join(tempDir, `${jobId}.js`);
            await fs.writeFile(filePath, code);
            const inputPath = path.join(tempDir, `${jobId}.in`);
            await fs.writeFile(inputPath, input);
            // For Node, we can just run it. Reading stdin in Node requires code to handle process.stdin
            // Provide a wrapper or assume code reads stdin?
            // For MVP DSA, usually we wrap the user code.
            // Let's assume the user code + inputs are just run.
            // But standard way is stdin redirection.
            command = `node "${filePath}" < "${inputPath}"`;
        } else {
            throw new Error('Unsupported language');
        }

        return new Promise((resolve, reject) => {
            exec(command, { timeout: TIMEOUT }, (error, stdout, stderr) => {
                // Cleanup files
                fs.unlink(filePath).catch(() => { });
                fs.unlink(path.join(tempDir, `${jobId}.in`)).catch(() => { });

                if (error && error.killed) {
                    resolve({ stdout: '', stderr: 'Execution timed out' });
                } else if (error) {
                    // Exec error (exit code != 0) is common for runtime errors
                    resolve({ stdout, stderr: stderr || error.message });
                } else {
                    resolve({ stdout, stderr });
                }
            });
        });
    } catch (error: any) {
        return { stdout: '', stderr: error.message };
    }
};
