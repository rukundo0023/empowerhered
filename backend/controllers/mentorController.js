import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Meeting from '../models/meetingModel.js';
import Mentorship from '../models/mentorshipModel.js';
import Booking from '../models/bookingModel.js';
import { sendEmail } from '../utils/sendEmail.js';

// @desc    Get mentor's mentees
// @route   GET /api/mentors/mentees
// @access  Private/Mentor
const getMentees = asyncHandler(async (req, res) => {
  try {
    const mentorships = await Mentorship.find({ mentor: req.user._id })
      .populate('mentee', 'name email')
      .populate('meetings');

    // Log the mentorships to see what is actually being returned
    console.log('Mentorships:', mentorships);

    const mentees = mentorships
      .filter(mentorship => mentorship.mentee && mentorship.mentee._id)
      .map(mentorship => ({
        id: mentorship.mentee._id,
        name: mentorship.mentee.name,
        email: mentorship.mentee.email,
        progress: mentorship.progress,
        lastMeeting: mentorship.meetings.length > 0 
          ? mentorship.meetings[mentorship.meetings.length - 1].date 
          : 'No meetings yet'
      }));

    res.json(mentees);
  } catch (error) {
    console.error('Error in getMentees:', error);
    res.status(500).json({ message: 'Server error in getMentees', error: error.message });
  }
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

// @desc    Get pending bookings
// @route   GET /api/mentors/bookings/pending
// @access  Private/Mentor
const getPendingBookings = asyncHandler(async (req, res) => {
  const pendingBookings = await Booking.find({
    status: 'pending'
  }).populate('mentee', 'name email');

  res.status(200).json(pendingBookings);
});

// @desc    Create new booking request
// @route   POST /api/mentors/bookings
// @access  Public
const createBookingRequest = asyncHandler(async (req, res) => {
  const { mentee, name, email, topic, duration } = req.body;

  if (!mentee || !name || !email) {
    res.status(400);
    throw new Error('Mentee details are required');
  }

  const menteeExists = await User.findById(mentee);
  if (!menteeExists) {
    res.status(404);
    throw new Error('Mentee not found');
  }

  const bookingData = {
    mentee,
    menteeName: name,
    menteeEmail: email,
    topic: topic || 'Initial Mentorship Session',
    duration: duration || 60,
    status: 'pending',
    date: new Date(),
    time: 'To be scheduled',
    mentor: null
  };

  const booking = await Booking.create(bookingData);

  res.status(201).json({
    ...booking.toObject(),
    message: 'Booking request created successfully. A mentor will be assigned soon.'
  });
});

// @desc    Accept a booking request
// @route   PUT /api/mentors/bookings/:id/accept
// @access  Private/Mentor
const acceptBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const mentorId = req.user._id;

  const booking = await Booking.findById(id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.status !== 'pending') {
    res.status(400);
    throw new Error('Booking is no longer pending');
  }

  const existingMentorship = await Mentorship.findOne({
    mentor: mentorId,
    mentee: booking.mentee
  });

  if (existingMentorship) {
    if (existingMentorship.status === 'cancelled') {
      existingMentorship.status = 'active';
      existingMentorship.startDate = new Date();
      await existingMentorship.save();
    } else {
      res.status(400);
      throw new Error('A mentorship already exists with this mentee');
    }
  }

  booking.mentor = mentorId;
  booking.status = 'confirmed';
  await booking.save();

  try {
    await sendEmail({
      to: booking.menteeEmail,
      subject: 'Your booking has been accepted!',
      html: `<p>Hi ${booking.menteeName},</p>
             <p>Your booking for the mentorship session on ${booking.date} has been accepted.</p>
             <p>Looking forward to a great session!</p>`
    });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }

  let mentorship;
  if (!existingMentorship) {
    mentorship = await Mentorship.create({
      mentor: mentorId,
      mentee: booking.mentee,
      status: 'active',
      startDate: new Date(),
      progress: 0
    });
  } else {
    mentorship = existingMentorship;
  }

  res.status(200).json({
    ...booking.toObject(),
    mentorshipId: mentorship._id,
    message: 'Booking accepted successfully'
  });
});

// @desc    Reject a booking request
// @route   PUT /api/mentors/bookings/:id/reject
// @access  Private/Mentor
const rejectBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.status !== 'pending') {
    res.status(400);
    throw new Error('Booking is no longer pending');
  }

  booking.status = 'cancelled';
  await booking.save();

  res.status(200).json({
    ...booking.toObject(),
    message: 'Booking rejected successfully'
  });
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
  createBookingRequest,
  getPendingBookings,
  acceptBooking,
  rejectBooking
};
