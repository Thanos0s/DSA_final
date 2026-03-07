import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getProblems = async (req: Request, res: Response) => {
    try {
        const problems = await prisma.problem.findMany({
            select: {
                id: true,
                title: true,
                slug: true,
                difficulty: true,
                topic: true,
            },
        });
        res.json(problems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getProblem = async (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
        const problem = await prisma.problem.findUnique({
            where: { slug },
        });

        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        res.json(problem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Admin only - seeded initially
export const createProblem = async (req: Request, res: Response) => {
    try {
        const { title, slug, statement, difficulty, topic, metadata, testCases } = req.body;
        const problem = await prisma.problem.create({
            data: {
                title,
                slug,
                statement,
                difficulty,
                topic,
                metadata: JSON.stringify(metadata),
                testCases: JSON.stringify(testCases),
            },
        });
        res.json(problem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
