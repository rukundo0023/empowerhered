import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Meeting from '../models/meetingModel.js';
import Mentorship from '../models/mentorshipModel.js';
import Booking from '../models/bookingModel.js';

// @desc    Get mentor's mentees
// @route   GET /api/mentors/mentees
// @access  Private/Mentor
const getMentees = asyncHandler(async (req, res) => {
  const mentorships = await Mentorship.find({ mentor: req.user._id })
    .populate('mentee', 'name email')
    .populate('meetings');

  const mentees = mentorships.map(mentorship => ({
    id: mentorship.mentee._id,
    name: mentorship.mentee.name,
    email: mentorship.mentee.email,
    progress: mentorship.progress,
    lastMeeting: mentorship.meetings.length > 0 
      ? mentorship.meetings[mentorship.meetings.length - 1].date 
      : 'No meetings yet'
  }));

  res.json(mentees);
});

// @desc    Get specific mentee details
// @route   GET /api/mentors/mentees/:id
// @access  Private/Mentor
const getMenteeDetails = asyncHandler(async (req, res) => {
  const mentorship = await Mentorship.findOne({
    mentor: req.user._id,
    mentee: req.params.id
  })
    .populate('mentee', 'name email profile')
    .populate('meetings');

  if (!mentorship) {
    res.status(404);
    throw new Error('Mentee not found');
  }

  res.json(mentorship);
});

// @desc    Get upcoming meetings
// @route   GET /api/mentors/meetings
// @access  Private/Mentor
const getUpcomingMeetings = asyncHandler(async (req, res) => {
  const meetings = await Meeting.find({
    mentor: req.user._id,
    date: { $gte: new Date() }
  })
    .populate('mentee', 'name')
    .sort({ date: 1 });

  const formattedMeetings = meetings.map(meeting => ({
    id: meeting._id,
    menteeName: meeting.mentee.name,
    date: meeting.date,
    status: meeting.status,
    notes: meeting.notes
  }));

  res.json(formattedMeetings);
});

// @desc    Get specific meeting details
// @route   GET /api/mentors/meetings/:id
// @access  Private/Mentor
const getMeetingDetails = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findOne({
    _id: req.params.id,
    mentor: req.user._id
  }).populate('mentee', 'name email');

  if (!meeting) {
    res.status(404);
    throw new Error('Meeting not found');
  }

  res.json(meeting);
});

// @desc    Update meeting
// @route   PUT /api/mentors/meetings/:id
// @access  Private/Mentor
const updateMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findOne({
    _id: req.params.id,
    mentor: req.user._id
  });

  if (!meeting) {
    res.status(404);
    throw new Error('Meeting not found');
  }

  const { date, status, notes } = req.body;

  meeting.date = date || meeting.date;
  meeting.status = status || meeting.status;
  meeting.notes = notes || meeting.notes;

  const updatedMeeting = await meeting.save();
  res.json(updatedMeeting);
});

// @desc    Schedule new meeting
// @route   POST /api/mentors/meetings
// @access  Private/Mentor
const scheduleMeeting = asyncHandler(async (req, res) => {
  const { menteeId, date, notes } = req.body;

  const mentorship = await Mentorship.findOne({
    mentor: req.user._id,
    mentee: menteeId
  });

  if (!mentorship) {
    res.status(404);
    throw new Error('Mentorship not found');
  }

  const meeting = await Meeting.create({
    mentor: req.user._id,
    mentee: menteeId,
    date,
    notes,
    status: 'scheduled'
  });

  mentorship.meetings.push(meeting._id);
  await mentorship.save();

  res.status(201).json(meeting);
});

// @desc    Cancel meeting
// @route   DELETE /api/mentors/meetings/:id
// @access  Private/Mentor
const cancelMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findOne({
    _id: req.params.id,
    mentor: req.user._id
  });

  if (!meeting) {
    res.status(404);
    throw new Error('Meeting not found');
  }

  meeting.status = 'cancelled';
  await meeting.save();

  res.json({ message: 'Meeting cancelled successfully' });
});

// @desc    Get mentor stats
// @route   GET /api/mentors/stats
// @access  Private/Mentor
const getMentorStats = asyncHandler(async (req, res) => {
  const mentorships = await Mentorship.find({ mentor: req.user._id });
  const meetings = await Meeting.find({ mentor: req.user._id });

  const stats = {
    totalMentees: mentorships.length,
    activeMentees: mentorships.filter(m => m.status === 'active').length,
    completedMeetings: meetings.filter(m => m.status === 'completed').length,
    pendingMeetings: meetings.filter(m => m.status === 'scheduled').length
  };

  res.json(stats);
});

// @desc    Get available mentors
// @route   GET /api/mentors/available
// @access  Public
const getAvailableMentors = asyncHandler(async (req, res) => {
  const mentors = await User.find({ 
    role: 'mentor',
    isAvailable: true 
  }).select('name email expertise bio');

  res.json(mentors);
});

// @desc    Create new booking request
// @route   POST /api/mentors/bookings
// @access  Public
const createBookingRequest = asyncHandler(async (req, res) => {
  const { mentor, mentee, name, email, topic, duration } = req.body;

  // Validate required fields
  if (!mentor || !mentee) {
    res.status(400);
    throw new Error('Mentor and mentee IDs are required');
  }

  // Verify mentor exists and is available
  const mentorExists = await User.findOne({ 
    _id: mentor,
    role: 'mentor',
    isAvailable: true
  });

  if (!mentorExists) {
    res.status(404);
    throw new Error('Mentor not found or not available');
  }

  // Verify mentee exists
  const menteeExists = await User.findById(mentee);
  if (!menteeExists) {
    res.status(404);
    throw new Error('Mentee not found');
  }

  // Create new booking
  const booking = await Booking.create({
    mentor,
    mentee,
    menteeName: name,
    menteeEmail: email,
    topic,
    duration: duration || 60,
    status: 'pending',
    date: new Date(),
    time: 'To be scheduled'
  });

  res.status(201).json(booking);
});

export {
  getMentees,
  getMenteeDetails,
  getUpcomingMeetings,
  getMeetingDetails,
  updateMeeting,
  scheduleMeeting,
  cancelMeeting,
  getMentorStats,
  getAvailableMentors,
  createBookingRequest
}; 