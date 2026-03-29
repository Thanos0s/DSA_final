import { Router } from 'express';
import { runCode } from '../controllers/executionController';

const router = Router();

router.post('/', runCode);

export default router;
