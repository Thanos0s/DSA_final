import { Request, Response } from 'express';
import { executeCode } from '../services/executionService';
import { z } from 'zod';

const executeSchema = z.object({
    language: z.enum(['python', 'javascript']),
    code: z.string(),
    input: z.string().optional(),
});

export const runCode = async (req: Request, res: Response) => {
    try {
        const { language, code, input } = executeSchema.parse(req.body);
        const result = await executeCode(language, code, input || '');
        res.json(result);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
