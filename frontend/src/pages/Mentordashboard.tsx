import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

interface Mentee {
  id: string;
  name: string;
  email: string;
  progress: number;
  lastMeeting: string;
}

interface Meeting {
  id: string;
  menteeName: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface Booking {
  _id: string;
  menteeName: string;
  menteeEmail: string;
  topic: string;
  date: string;
  duration: number;
}

const Mentordashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for booking information in location state
    const bookingInfo = location.state?.bookingInfo;
    const message = location.state?.message;

    if (message) {
      toast.success(message);
      // Clear the state after showing the message
      window.history.replaceState({}, document.title);
    }

    const fetchMentorData = async () => {
      try {
        const [menteesRes, meetingsRes, bookingsRes] = await Promise.all([
          api.get<Mentee[]>('/mentors/mentees'),
          api.get<Meeting[]>('/mentors/meetings'),
          api.get<Booking[]>('/mentors/bookings')
        ]);
        setMentees(menteesRes.data);
        setUpcomingMeetings(meetingsRes.data);
        setPendingBookings(bookingsRes.data);
      } catch (error) {
        console.error('Error fetching mentor data:', error);
        toast.error('Failed to load mentor data');
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, [location]);

  const handleScheduleMeeting = (menteeId: string) => {
    navigate(`/mentor/schedule/${menteeId}`);
  };

  const handleViewProgress = (menteeId: string) => {
    navigate(`/mentor/mentee/${menteeId}`);
  };

  const handleViewMeetingDetails = (meetingId: string) => {
    navigate(`/mentor/meeting/${meetingId}`);
  };

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await api.put(`/mentors/bookings/${bookingId}/accept`);
      toast.success('Booking accepted successfully');
      // Refresh the data
      const [menteesRes, meetingsRes, bookingsRes] = await Promise.all([
        api.get<Mentee[]>('/mentors/mentees'),
        api.get<Meeting[]>('/mentors/meetings'),
        api.get<Booking[]>('/mentors/bookings')
      ]);
      setMentees(menteesRes.data);
      setUpcomingMeetings(meetingsRes.data);
      setPendingBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error accepting booking:', error);
      toast.error('Failed to accept booking');
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      await api.put(`/mentors/bookings/${bookingId}/reject`);
      toast.success('Booking rejected successfully');
      // Refresh the data
      const [menteesRes, meetingsRes, bookingsRes] = await Promise.all([
        api.get<Mentee[]>('/mentors/mentees'),
        api.get<Meeting[]>('/mentors/meetings'),
        api.get<Booking[]>('/mentors/bookings')
      ]);
      setMentees(menteesRes.data);
      setUpcomingMeetings(meetingsRes.data);
      setPendingBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error('Failed to reject booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Pending Bookings Section */}
            <section className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Pending Bookings</h2>
              <div className="space-y-4">
                {pendingBookings.length > 0 ? (
                  pendingBookings.map((booking) => (
                    <div key={booking._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{booking.menteeName}</h3>
                          <p className="text-sm text-gray-600">{booking.menteeEmail}</p>
                          <p className="text-sm text-gray-600 mt-2">Topic: {booking.topic}</p>
                          <p className="text-sm text-gray-600">Duration: {booking.duration} minutes</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAcceptBooking(booking._id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectBooking(booking._id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No pending bookings</p>
                )}
              </div>
            </section>

            {/* Mentees Section */}
            <section className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Mentees</h2>
              <div className="space-y-6">
                {mentees.length > 0 ? (
                  mentees.map((mentee) => (
                    <div key={mentee.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">{mentee.name}</h3>
                          <p className="text-sm text-gray-600">{mentee.email}</p>
                          <p className="text-sm text-gray-600 mt-2">
                            Progress: {mentee.progress}%
                          </p>
                          <p className="text-sm text-gray-600">
                            Last Meeting: {mentee.lastMeeting}
                          </p>
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleScheduleMeeting(mentee.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Schedule Meeting
                          </button>
                          <button
                            onClick={() => handleViewProgress(mentee.id)}
                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                          >
                            View Progress
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No mentees yet</p>
                )}
              </div>
            </section>

            {/* Upcoming Meetings Section */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Meetings</h2>
              <div className="space-y-4">
                {upcomingMeetings.length > 0 ? (
                  upcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">{meeting.menteeName}</h3>
                          <p className="text-sm text-gray-600">
                            Date: {new Date(meeting.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Status: {meeting.status}
                          </p>
                        </div>
                        <button
                          onClick={() => handleViewMeetingDetails(meeting.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No upcoming meetings</p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/mentor/schedule')}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Schedule New Meeting
                </button>
                <button
                  onClick={() => navigate('/mentor/profile')}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentordashboard;
