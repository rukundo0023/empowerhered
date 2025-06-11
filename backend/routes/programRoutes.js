import express from 'express';
import {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../controllers/programController.js';
import { protect, admin } from '../middlewares/authMiddlewares.js';

const router = express.Router();

// Public routes
router.route('/').get(getPrograms);
router.route('/:id').get(getProgramById);

// Protected admin routes
router.route('/').post(protect, admin, createProgram);
router.route('/:id').put(protect, admin, updateProgram);
router.route('/:id').delete(protect, admin, deleteProgram);

export default router; 