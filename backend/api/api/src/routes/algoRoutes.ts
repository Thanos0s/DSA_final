import { Router } from 'express';
import { generateAlgoVisualization } from '../controllers/algoController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.post('/visualize', generateAlgoVisualization);

export default router;
