import express from 'express';
import { getProfile, getHeatmap } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateToken);

router.get('/me/profile', getProfile);
router.get('/me/heatmap', getHeatmap);

export default router;
