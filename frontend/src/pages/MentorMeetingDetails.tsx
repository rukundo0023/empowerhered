import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

interface MeetingDetails {
  _id: string;
  menteeName: string;
  menteeEmail: string;
  date: string;
  time: string;
  duration: number;
  topic: string;
  status: string;
  notes: string;
  meetingLink: string;
}

const MentorMeetingDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [meeting, setMeeting] = useState<MeetingDetails | null>(null);

  useEffect(() => {
    const fetchMeetingDetails = async () => {
      try {
        const response = await api.get(`/mentors/meetings/${id}`);
        setMeeting(response.data);
      } catch (error) {
        console.error('Error fetching meeting details:', error);
        toast.error('Failed to load meeting details');
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingDetails();
  }, [id]);

  const handleCancelMeeting = async () => {
    if (!window.confirm('Are you sure you want to cancel this meeting?')) {
      return;
    }

    try {
      await api.delete(`/mentors/meetings/${id}`);
      toast.success('Meeting cancelled successfully');
      navigate('/mentorDashboard');
    } catch (error) {
      console.error('Error cancelling meeting:', error);
      toast.error('Failed to cancel meeting');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Meeting Not Found</h2>
          <button
            onClick={() => navigate('/mentorDashboard')}
            className="text-blue-600 hover:text-blue-800"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Meeting Details</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                meeting.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                meeting.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Mentee Information</h2>
                <p className="text-gray-600">{meeting.menteeName}</p>
                <p className="text-gray-600">{meeting.menteeEmail}</p>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Meeting Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-gray-900">{new Date(meeting.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="text-gray-900">{meeting.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="text-gray-900">{meeting.duration} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Topic</p>
                    <p className="text-gray-900">{meeting.topic}</p>
                  </div>
                </div>
              </div>

              {meeting.notes && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Notes</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{meeting.notes}</p>
                </div>
              )}

              {meeting.meetingLink && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Meeting Link</h2>
                  <a
                    href={meeting.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Join Meeting
                  </a>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  onClick={() => navigate('/mentorDashboard')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back to Dashboard
                </button>
                {meeting.status === 'scheduled' && (
                  <button
                    onClick={handleCancelMeeting}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Cancel Meeting
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorMeetingDetails; 