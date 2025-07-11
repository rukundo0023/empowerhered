import express from 'express';
import { protect, admin, adminOrInstructor } from '../middlewares/authMiddlewares.js';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getCourseProgress,
  addModule,
  updateModule,
  deleteModule,
  addLesson,
  updateLesson,
  deleteLesson,
  getModules,
  getProgressByInstructor,
  getModuleById,
  visitLesson,
  getUserLessonProgress
} from '../controllers/courseController.js';

const router = express.Router();

// Public routes
router.get('/progress', protect, getProgressByInstructor);
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected routes
router.post('/:id/enroll', protect, enrollInCourse);
router.get('/:id/progress', protect, getCourseProgress);

// Admin routes
router.post('/', protect, adminOrInstructor, createCourse);
router.put('/:id', protect, admin, updateCourse);
router.delete('/:id', protect, adminOrInstructor, deleteCourse);

// Module and Lesson management
router.get('/:courseId/modules', getModules);
router.post('/:courseId/modules', protect, adminOrInstructor, addModule);
router.put('/:courseId/modules/:moduleId', protect, adminOrInstructor, updateModule);
router.delete('/:courseId/modules/:moduleId', protect, adminOrInstructor, deleteModule);
router.post('/:courseId/modules/:moduleId/lessons', protect, adminOrInstructor, addLesson);
router.put('/:courseId/modules/:moduleId/lessons/:lessonId', protect, adminOrInstructor, updateLesson);
router.delete('/:courseId/modules/:moduleId/lessons/:lessonId', protect, adminOrInstructor, deleteLesson);
router.get('/:courseId/modules/:moduleId', getModuleById);

// Add this route for lesson visit progress tracking
router.post('/:courseId/modules/:moduleIndex/lessons/:lessonIndex/visit', protect, visitLesson);

// Add this route to get user's lesson progress for a course
router.get('/:courseId/lesson-progress', protect, getUserLessonProgress);

export default router; 