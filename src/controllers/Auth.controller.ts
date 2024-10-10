import { Request, Response } from 'express';

export async function signIn(req: Request, res: Response): Promise<void> {
    try {
        res.status(200).json({ message: 'User signed in' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
