
import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebaseAdmin';
import prisma from '../utils/db';


// Extend Express Request to include authenticated user info
export interface AuthRequest extends Request {
    user?: { userId: string; email: string };
}


/**
 * Middleware to authenticate Firebase JWT and attach user info to request.
 * Returns 401 if token is missing, invalid, or user not found in DB.
 */
export const authenticateToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    // Get token from Authorization header ("Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        // Verify token with Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Find user in DB by email (from Firebase token)
        const user = await prisma.user.findUnique({
            where: { email: decodedToken.email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found in database' });
        }

        // Attach user info to request
        req.user = { userId: user.id, email: user.email };
        next();
    } catch (error) {
        console.error('Firebase Auth Error:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
};
