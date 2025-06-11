import express from 'express';
import {
  getStories,
  getFeaturedStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
  toggleStoryFeatured,
} from '../controllers/storyController.js';
import { protect, admin } from '../middlewares/authMiddlewares.js';

const router = express.Router();

// Public routes
router.route('/').get(getStories);
router.route('/featured').get(getFeaturedStories);
router.route('/:id').get(getStoryById);

// Protected admin routes
router.route('/').post(protect, admin, createStory);
router.route('/:id').put(protect, admin, updateStory);
router.route('/:id').delete(protect, admin, deleteStory);
router.route('/:id/feature').put(protect, admin, toggleStoryFeatured);

export default router; 