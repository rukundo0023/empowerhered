import express from 'express';
import {
  generateCertificate,
  getMyCertificates,
  getCertificateById,
  downloadCertificate,
  verifyCertificate,
} from '../controllers/certificateController.js';
import { protect } from '../middlewares/authMiddlewares.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/generate', protect, generateCertificate);
router.get('/my-certificates', protect, getMyCertificates);
router.get('/:id', protect, getCertificateById);
router.get('/:id/download', protect, downloadCertificate);

// Public route (no authentication required)
router.get('/verify/:certificateNumber', verifyCertificate);

export default router; 