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
  createBookingRequest,
  getAvailableMentors,
  getPendingBookings,
  acceptBooking,
  rejectBooking
} from '../controllers/mentorController.js';

const router = express.Router();

// Public routes
router.get('/available', getAvailableMentors);
router.post('/bookings', createBookingRequest);

// Protected routes
router.use(protect);
router.use(mentor);

router.get('/mentees', getMentees);
router.get('/mentees/:id', getMenteeDetails);
router.get('/meetings', getUpcomingMeetings);
router.get('/meetings/:id', getMeetingDetails);
router.put('/meetings/:id', updateMeeting);
router.post('/meetings', scheduleMeeting);
router.delete('/meetings/:id', cancelMeeting);
router.get('/stats', getMentorStats);
router.get('/bookings', getPendingBookings);
router.put('/bookings/:id/accept', acceptBooking);
router.put('/bookings/:id/reject', rejectBooking);

export default router; 