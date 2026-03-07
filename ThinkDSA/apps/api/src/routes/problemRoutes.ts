import { Router } from 'express';
import { getProblems, getProblem, createProblem } from '../controllers/problemController';

const router = Router();

router.get('/', getProblems);
router.get('/:slug', getProblem);
router.post('/', createProblem); // Add admin auth middleware later

export default router;
