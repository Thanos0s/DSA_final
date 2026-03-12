import { Request, Response } from 'express';
import { z } from 'zod';
import { comparePassword, generateToken, hashPassword } from '../utils/auth';
import prisma from '../utils/db';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const passwordHash = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                profileData: "{}",
            },
        });

        const token = generateToken(user.id);
        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (!user.passwordHash) {
            return res.status(400).json({ error: 'Please use Google/Firebase login for this account' });
        }

        const isMatch = await comparePassword(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user.id);
        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const syncSchema = z.object({
    email: z.string().email(),
    firebaseUid: z.string(),
    name: z.string().nullable().optional(),
});

export const syncUser = async (req: Request, res: Response) => {
    try {
        const { email, name } = syncSchema.parse(req.body);

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    passwordHash: null, // No local password for Firebase users
                    profileData: "{}",
                },
            });
        } else if (name && !user.name) {
            // Update name if missing
            user = await prisma.user.update({
                where: { id: user.id },
                data: { name }
            });
        }

        res.json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error('Sync Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
