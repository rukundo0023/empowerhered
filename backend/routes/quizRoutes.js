import express from 'express';
import { protect, admin, adminOrInstructor } from '../middlewares/authMiddlewares.js';
import { 
  createQuiz, 
  getQuiz, 
  getQuizzesByCourse,
  getQuizzesByLesson,
  submitQuiz, 
  getQuizResults, 
  getUserQuizResults, 
  updateQuiz, 
  deleteQuiz 
} from '../controllers/quizController.js';

const router = express.Router();

// Create, update, delete - Admin/Instructor only
router.post('/', protect, adminOrInstructor, createQuiz);

// Get quizzes by course/lesson (MUST come before /:id routes to avoid conflicts)
router.get('/course/:courseId', protect, getQuizzesByCourse);
router.get('/lesson/:courseId/:moduleId/:lessonId', protect, getQuizzesByLesson);

// User results (MUST come before /:id routes)
router.get('/results', protect, getUserQuizResults);

// Individual quiz operations (these come last to avoid catching other routes)
router.get('/:id', protect, getQuiz);
router.put('/:id', protect, adminOrInstructor, updateQuiz);
router.delete('/:id', protect, adminOrInstructor, deleteQuiz);
router.post('/:id/submit', protect, submitQuiz);
router.get('/:id/results', protect, getQuizResults);

export default router; 