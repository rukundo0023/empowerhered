import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import api from "../api/axios"
import { toast } from "react-toastify"

interface Mentee {
  _id: string;
  name: string;
  email: string;
  progress: number;
  lastMeeting: string;
}

interface Meeting {
  _id: string;
  menteeName: string;
  date: string;
  time: string;
  topic: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const Mentordashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [mentees, setMentees] = useState<Mentee[]>([])
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for booking information in location state
    const bookingInfo = location.state?.bookingInfo
    const message = location.state?.message

    if (message) {
      toast.success(message)
      // Clear the state after showing the message
      window.history.replaceState({}, document.title)
    }

    const fetchMentorData = async () => {
      try {
        const [menteesRes, meetingsRes] = await Promise.all([
          api.get<Mentee[]>('/mentors/mentees'),
          api.get<Meeting[]>('/mentors/meetings')
        ]);
        setMentees(menteesRes.data);
        setUpcomingMeetings(meetingsRes.data);
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
            {/* Mentees Section */}
            <section className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Mentees</h2>
              <div className="space-y-6">
                {mentees.length > 0 ? (
                  mentees.map((mentee) => (
                  <motion.div
                      key={mentee._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{mentee.name}</h3>
                          <p className="text-sm text-gray-500">{mentee.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Progress</p>
                        <p className="font-medium text-gray-700">{mentee.progress}%</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <p>Last Meeting: {mentee.lastMeeting || 'No meetings yet'}</p>
                    </div>
                    <div className="mt-4 flex space-x-4">
                        <button 
                          onClick={() => handleScheduleMeeting(mentee._id)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                        Schedule Meeting
                      </button>
                        <button 
                          onClick={() => handleViewProgress(mentee._id)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                        View Progress
                      </button>
                    </div>
                  </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No mentees found</p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Upcoming Meetings */}
            <section className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Meetings</h2>
              <div className="space-y-4">
                {upcomingMeetings.length > 0 ? (
                  upcomingMeetings.map((meeting) => (
                  <motion.div
                      key={meeting._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border rounded-lg p-4"
                  >
                      <h3 className="font-medium text-gray-900">{meeting.menteeName}</h3>
                    <p className="text-sm text-gray-500">{meeting.topic}</p>
                    <div className="mt-2 text-sm text-gray-500">
                        <p>{new Date(meeting.date).toLocaleDateString()} at {meeting.time}</p>
                    </div>
                      <button 
                        onClick={() => handleViewMeetingDetails(meeting._id)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                      View Details
                    </button>
                  </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No upcoming meetings</p>
                )}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/mentor/schedule')}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Schedule New Meeting
                </button>
                <button 
                  onClick={() => navigate('/resources/learning')}
                  className="w-full bg-white text-gray-700 border border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Resources
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mentordashboard
