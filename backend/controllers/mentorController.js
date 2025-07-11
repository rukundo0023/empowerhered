import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Meeting from '../models/meetingModel.js';
import Mentorship from '../models/mentorshipModel.js';
import Booking from '../models/bookingModel.js';
import { sendEmail } from '../utils/sendEmail.js';
import { getOAuthClient } from '../config/googleClient.js';
import { google } from 'googleapis';

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

    const safeMentorships = mentorships.filter(m => m.mentee && m.mentee.name && m.mentee.email).map(m => ({
      id: m.mentee._id,
      menteeName: m.mentee.name,
      menteeEmail: m.mentee.email,
      progress: m.progress,
      lastMeeting: m.meetings.length > 0 
        ? m.meetings[m.meetings.length - 1].date 
        : 'No meetings yet'
    }));

    res.json(safeMentorships);
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
    menteeName: meeting.mentee && meeting.mentee.name ? meeting.mentee.name : 'Unknown',
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
    const mentor = await User.findById(mentorId);
    await sendEmail({
      to: booking.menteeEmail,
      subject: 'Your mentorship booking has been accepted!',
      html: `<p>Hi ${booking.menteeName},</p>
             <p>Great news! Your mentorship session has been <b>accepted</b> by <b>${mentor?.name || 'your mentor'}</b>.</p>
             <ul>
               <li><b>Topic:</b> ${booking.topic}</li>
               <li><b>Date:</b> ${new Date(booking.date).toLocaleDateString()}</li>
               <li><b>Time:</b> ${booking.time || 'To be scheduled'}</li>
             </ul>
             <p>You can contact your mentor at: <a href="mailto:${mentor?.email}">${mentor?.email}</a></p>
             <p>Looking forward to a great session!</p>
             <p style="margin-top:2em;">Best regards,<br/>EmpowerHerEd Team</p>`
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

  // Create a Meeting for this booking
  const meeting = await Meeting.create({
    mentor: mentorId,
    mentee: booking.mentee,
    date: booking.date,
    status: 'scheduled',
    notes: booking.topic,
    duration: booking.duration || 60
  });
  mentorship.meetings.push(meeting._id);
  await mentorship.save();

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

  try {
    const mentor = await User.findById(req.user._id);
    await sendEmail({
      to: booking.menteeEmail,
      subject: 'Your mentorship booking has been rejected',
      html: `<p>Hi ${booking.menteeName},</p>
             <p>Unfortunately, your mentorship session request with <b>${mentor?.name || 'the mentor'}</b> was <b>rejected</b>.</p>
             <ul>
               <li><b>Topic:</b> ${booking.topic}</li>
               <li><b>Date:</b> ${new Date(booking.date).toLocaleDateString()}</li>
               <li><b>Time:</b> ${booking.time || 'To be scheduled'}</li>
             </ul>
             <p>You can try booking another session or choose a different mentor.</p>
             <p>If you have questions, contact us at <a href="mailto:support@empowerhered.com">support@empowerhered.com</a>.</p>
             <p style="margin-top:2em;">Best regards,<br/>EmpowerHerEd Team</p>`
    });
  } catch (error) {
    console.error('Failed to send rejection email:', error);
  }

  res.status(200).json({
    ...booking.toObject(),
    message: 'Booking rejected successfully'
  });
});

// @desc    Get mentor's Google Calendar availability
// @route   GET /api/mentors/availability
// @access  Private/Mentor
export const getGoogleAvailability = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user || !user.googleAccessToken || !user.googleRefreshToken) {
    return res.status(400).json({ message: 'Google Calendar not connected.' });
  }
  const auth = getOAuthClient(user.googleAccessToken, user.googleRefreshToken);
  const calendar = google.calendar({ version: 'v3', auth });
  const timeMin = new Date().toISOString();
  const timeMax = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // next 7 days
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      timeZone: 'UTC',
      items: [{ id: 'primary' }]
    }
  });
  res.json(response.data.calendars.primary.busy);
});

// @desc    Book a slot and create Google Calendar event
// @route   POST /api/mentors/book
// @access  Private
export const bookGoogleSlot = asyncHandler(async (req, res) => {
  const { mentorId, startTime, endTime, summary } = req.body;
  const mentor = await User.findById(mentorId);
  if (!mentor || !mentor.googleAccessToken || !mentor.googleRefreshToken) {
    return res.status(400).json({ message: 'Mentor has not connected Google Calendar.' });
  }
  const auth = getOAuthClient(mentor.googleAccessToken, mentor.googleRefreshToken);
  const calendar = google.calendar({ version: 'v3', auth });
  const event = {
    summary: summary || 'Mentorship Session',
    start: { dateTime: startTime, timeZone: 'UTC' },
    end: { dateTime: endTime, timeZone: 'UTC' },
    attendees: [
      { email: mentor.email },
      { email: req.user.email }
    ]
  };
  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event
  });
  res.status(201).json(response.data);
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
