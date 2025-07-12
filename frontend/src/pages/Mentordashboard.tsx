import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';



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
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const message = location.state?.message;

    if (message) {
      toast.success(message);
      window.history.replaceState({}, document.title);
    }

    const fetchMentorData = async () => {
      try {
        const [meetingsRes, bookingsRes] = await Promise.all([
          api.get<Meeting[]>('/mentors/meetings'),
          api.get<Booking[]>('/mentors/bookings')
        ]);
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



  const handleViewMeetingDetails = (meetingId: string) => {
    navigate(`/mentor/meeting/${meetingId}`);
  };

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await api.put(`/mentors/bookings/${bookingId}/accept`);
      toast.success('Booking accepted successfully');
      const [meetingsRes, bookingsRes] = await Promise.all([
        api.get<Meeting[]>('/mentors/meetings'),
        api.get<Booking[]>('/mentors/bookings')
      ]);
      setUpcomingMeetings(meetingsRes.data);
      setPendingBookings(bookingsRes.data);
    } catch (error: any) {
      console.error('Error accepting booking:', error);
      // Check for specific error message from backend
      const errorMsg = error?.response?.data?.message || error.message || '';
      if (errorMsg.includes('A mentorship already exists with this mentee')) {
        toast.error('A mentorship already exists with this mentee.');
      } else {
        toast.error('Failed to accept booking');
      }
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      await api.put(`/mentors/bookings/${bookingId}/reject`);
      toast.success('Booking rejected successfully');
      const [meetingsRes, bookingsRes] = await Promise.all([
        api.get<Meeting[]>('/mentors/meetings'),
        api.get<Booking[]>('/mentors/bookings')
      ]);
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

  // Filter upcoming meetings to only those in the future
  const now = new Date();
  const filteredUpcomingMeetings = upcomingMeetings.filter(
    (meeting) => new Date(meeting.date) > now && meeting.status === 'scheduled'
  );

  // Debug: log the upcoming meetings to inspect their structure
  console.log('Upcoming Meetings:', filteredUpcomingMeetings);

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

            {/* Upcoming Meetings Section */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Meetings</h2>
              <div className="space-y-4">
                {filteredUpcomingMeetings.length > 0 ? (
                  filteredUpcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">Mentee: {meeting.menteeName}</h3>
                          <p className="text-sm text-gray-600">
                            Date & Time: {new Date(meeting.date).toLocaleString()}
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
        </div>
      </div>
    </div>
  );
};

export default Mentordashboard;
