import express from 'express';
import { protect, admin } from '../middlewares/authMiddlewares.js';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  deleteUser,
  updateUser,
  googleLogin,
} from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);

// Protected routes
router.get('/me', protect, getCurrentUser);

// Admin routes
router.get('/', protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id', protect, admin, updateUser);

export default router;
