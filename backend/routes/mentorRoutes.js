import express from 'express';
import { protect, mentor } from '../middlewares/authMiddlewares.js';
import {
  getMentees,
  getMenteeDetails,
  getUpcomingMeetings,
  getMeetingDetails,
  updateMeeting,
  getMentorStats,
  scheduleMeeting,
  cancelMeeting,
} from '../controllers/mentorController.js';

const router = express.Router();

// Protect all mentor routes
router.use(protect);
router.use(mentor);

// Get mentor's mentees
router.get('/mentees', getMentees);

// Get specific mentee details
router.get('/mentees/:id', getMenteeDetails);

// Get upcoming meetings
router.get('/meetings', getUpcomingMeetings);

// Get specific meeting details
router.get('/meetings/:id', getMeetingDetails);

// Update meeting
router.put('/meetings/:id', updateMeeting);

// Schedule new meeting
router.post('/meetings', scheduleMeeting);

// Cancel meeting
router.delete('/meetings/:id', cancelMeeting);

// Get mentor stats
router.get('/stats', getMentorStats);

export default router; 