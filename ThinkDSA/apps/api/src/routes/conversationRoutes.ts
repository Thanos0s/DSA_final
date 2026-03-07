import { Router } from 'express';
import { sendMessage, getHistory } from '../controllers/conversationController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken); // Protect all routes

router.post('/messages', sendMessage);
router.get('/:conversationId', getHistory);

export default router;
