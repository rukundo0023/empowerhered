import express from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  getResourcesByCategory,
} from '../controllers/resourceController.js';
import { protect, admin } from '../middlewares/authMiddlewares.js';

const router = express.Router();

// Public routes
router.route('/').get(getResources);
router.route('/category/:category').get(getResourcesByCategory);
router.route('/:id').get(getResourceById);

// Protected admin routes
router.route('/').post(protect, admin, createResource);
router.route('/:id').put(protect, admin, updateResource);
router.route('/:id').delete(protect, admin, deleteResource);

export default router; 