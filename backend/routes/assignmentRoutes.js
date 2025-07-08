import express from 'express';
import { protect, admin } from '../middlewares/authMiddlewares.js';
import { createAssignment, getAssignment, submitAssignment, gradeAssignment, getAssignmentSubmissions, updateAssignment, deleteAssignment } from '../controllers/assignmentController.js';

const router = express.Router();

router.post('/', protect, admin, createAssignment);
router.get('/:id', protect, getAssignment);
router.post('/:id/submit', protect, submitAssignment);
router.post('/:id/grade', protect, admin, gradeAssignment);
router.get('/:id/submissions', protect, admin, getAssignmentSubmissions);
router.put('/:id', protect, admin, updateAssignment);
router.delete('/:id', protect, admin, deleteAssignment);

export default router; 