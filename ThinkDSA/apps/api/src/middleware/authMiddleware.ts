import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebaseAdmin';
import prisma from '../utils/db';

export interface AuthRequest extends Request {
    user?: { userId: string; email: string };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Find existing user in our DB by email or firebaseUid (matching by email for now)
        const user = await prisma.user.findUnique({
            where: { email: decodedToken.email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found in database' });
        }

        req.user = { userId: user.id, email: user.email };
        next();
    } catch (error) {
        console.error('Firebase Auth Error:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
