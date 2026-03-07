import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../utils/db';

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Fetch user basic info
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, createdAt: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Upsert UserStats (create if it doesn't exist)
        const stats = await prisma.userStats.upsert({
            where: { userId },
            update: {},
            create: {
                userId,
                totalSolved: 0,
                currentStreak: 0,
                maxStreak: 0,
                rank: 'Novice'
            }
        });

        // Fetch Badges
        const userBadges = await prisma.userBadge.findMany({
            where: { userId },
            include: { badge: true }
        });

        // Fetch recent successful attempts
        const recentActivity = await prisma.attempt.findMany({
            where: { userId, status: 'accepted' },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { problem: { select: { title: true, difficulty: true } } }
        });

        res.json({
            user,
            stats,
            badges: userBadges.map((ub: any) => ub.badge),
            recentActivity
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getHeatmap = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const activities = await prisma.dailyActivity.findMany({
            where: { userId },
            orderBy: { date: 'asc' }
        });

        res.json(activities);
    } catch (error) {
        console.error('Error fetching heatmap:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// End of controller
