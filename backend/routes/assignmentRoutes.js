import express from 'express';
import { protect, admin, adminOrInstructor } from '../middlewares/authMiddlewares.js';
import { 
  createAssignment, 
  getAssignment, 
  getAssignmentsByCourse,
  getAssignmentsByLesson,
  submitAssignment, 
  gradeAssignment, 
  getAssignmentSubmissions, 
  updateAssignment, 
  deleteAssignment, 
  getUserAssignmentSubmissions 
} from '../controllers/assignmentController.js';

const router = express.Router();

// Create, update, delete - Admin/Instructor only
router.post('/', protect, adminOrInstructor, createAssignment);

// Get assignments by course/lesson (MUST come before /:id routes to avoid conflicts)
router.get('/course/:courseId', protect, getAssignmentsByCourse);
router.get('/lesson/:courseId/:moduleId/:lessonId', protect, getAssignmentsByLesson);

// User submissions (MUST come before /:id routes)
router.get('/submissions', protect, getUserAssignmentSubmissions);

// Individual assignment operations (these come last to avoid catching other routes)
router.get('/:id', protect, getAssignment);
router.put('/:id', protect, adminOrInstructor, updateAssignment);
router.delete('/:id', protect, adminOrInstructor, deleteAssignment);
router.post('/:id/submit', protect, submitAssignment);

// Grading and submissions - Admin/Instructor only
router.post('/:id/grade', protect, adminOrInstructor, gradeAssignment);
router.get('/:id/submissions', protect, adminOrInstructor, getAssignmentSubmissions);

export default router; 