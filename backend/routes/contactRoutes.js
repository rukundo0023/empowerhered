import express from 'express';
import { body, validationResult } from 'express-validator';
import { sendContactEmail } from '../controllers/contactController.js';

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log('Contact route accessed:', req.method, req.path);
  console.log('Request body:', req.body);
  next();
});

// Validation middleware
const validateContactForm = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
];

// Contact form route
router.post('/', validateContactForm, async (req, res, next) => {
  console.log('Contact form submission received');
  
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ 
      success: false,
      message: 'Validation failed',
      errors: errors.array() 
    });
  }
  
  try {
    await sendContactEmail(req, res);
  } catch (error) {
    console.error('Error in contact route:', error);
    next(error);
  }
});

export default router; 