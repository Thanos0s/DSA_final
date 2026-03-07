import { Request, Response } from 'express';
import { z } from 'zod'; // Import z from zod
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../utils/db';
import { generateAIResponse } from '../services/aiService';
import { SYSTEM_PROMPT_TEMPLATE } from '../prompts/systemPrompts';

const messageSchema = z.object({
    content: z.string().min(1),
    problemId: z.string().uuid().optional(), // Optional if continuing existing convo
    conversationId: z.string().uuid().optional(),
});

export const sendMessage = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { content, problemId, conversationId } = messageSchema.parse(req.body);

        let conversation;

        // Determine conversation context
        if (conversationId) {
            conversation = await prisma.conversation.findUnique({
                where: { id: conversationId },
                include: { messages: { orderBy: { createdAt: 'asc' } }, problem: true },
            });

            if (!conversation || conversation.userId !== userId) {
                return res.status(404).json({ error: 'Conversation not found' });
            }
        } else if (problemId) {
            // Check if active conversation exists for this problem? Or create new.
            // For MVP, let's create a new one if not provided.
            const problem = await prisma.problem.findUnique({ where: { id: problemId } });
            if (!problem) return res.status(404).json({ error: 'Problem not found' });

            conversation = await prisma.conversation.create({
                data: {
                    userId,
                    problemId,
                },
                include: { messages: true, problem: true },
            });
        } else {
            return res.status(400).json({ error: 'Either conversationId or problemId is required' });
        }

        // Save user message
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                role: 'user',
                content,
            },
        });

        // Prepare context for AI using the Socratic tutoring prompt
        const systemPrompt = SYSTEM_PROMPT_TEMPLATE
            .replace('{{PROBLEM_TITLE}}', conversation.problem.title)
            .split('{{PROBLEM_STATEMENT}}').join(conversation.problem.statement);

        // Retrieve full history including the new message
        const history = await prisma.message.findMany({
            where: { conversationId: conversation.id },
            orderBy: { createdAt: 'asc' },
        });

        const aiMessages = history.map(msg => ({
            role: msg.role as 'user' | 'assistant' | 'system', // 'system' role not used in DB yet but mapped for type safety
            content: msg.content
        }));

        // Call AI
        const aiResponseContent = await generateAIResponse(systemPrompt, aiMessages);

        // Save AI response
        const aiMessage = await prisma.message.create({
            data: {
                conversationId: conversation.id,
                role: 'assistant',
                content: aiResponseContent,
            },
        });

        res.json({
            message: aiMessage,
            conversationId: conversation.id
        });

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const { conversationId } = req.params;

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!conversation || conversation.userId !== userId) {
        return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
};
