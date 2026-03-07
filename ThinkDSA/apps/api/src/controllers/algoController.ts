import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../utils/db';
import { generateAIResponse } from '../services/aiService';
import { ALGO_VISUALIZER_PROMPT } from '../prompts/algoPrompt';

const algoSchema = z.object({
    problemId: z.string().uuid(),
});

export const generateAlgoVisualization = async (req: AuthRequest, res: Response) => {
    try {
        const { problemId } = algoSchema.parse(req.body);

        const problem = await prisma.problem.findUnique({ where: { id: problemId } });
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        const prompt = ALGO_VISUALIZER_PROMPT(problem.title, problem.statement);

        const rawResponse = await generateAIResponse(prompt, [
            { role: 'user', content: 'Generate the algorithm visualization JSON now.' }
        ]);

        // Parse the AI JSON response safely
        let visualization;
        try {
            // Strip any accidental markdown code fences
            const cleaned = rawResponse
                .replace(/```json/gi, '')
                .replace(/```/g, '')
                .trim();
            visualization = JSON.parse(cleaned);
        } catch {
            console.error('Failed to parse AI response as JSON:', rawResponse);
            return res.status(500).json({ error: 'Failed to parse algorithm visualization.' });
        }

        res.json(visualization);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error('Algo visualizer error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
