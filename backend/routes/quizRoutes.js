import express from 'express';
import { protect, admin } from '../middlewares/authMiddlewares.js';
import { createQuiz, getQuiz, submitQuiz, getQuizResults } from '../controllers/quizController.js';

const router = express.Router();

router.post('/', protect, admin, createQuiz);
router.get('/:id', protect, getQuiz);
router.post('/:id/submit', protect, submitQuiz);
router.get('/:id/results', protect, getQuizResults);

export default router; 