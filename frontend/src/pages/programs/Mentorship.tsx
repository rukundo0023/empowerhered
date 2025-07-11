import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import OfflineImage from '../../components/OfflineImage';
import { offlineService } from '../../services/offlineService';
import allowedMentors from '../../constants/allowedMentors.json';

interface Mentor {
  _id: string;
  name: string;
  email: string;
  expertise: string;
  bio: string;
  profilePicture?: string;
}

const Mentorship = () => {
  const { user } = useAuth();
  const [availableMentors, setAvailableMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<string>('');
  const [bookingData, setBookingData] = useState({
    menteeName: '',
    menteeEmail: '',
    topic: '',
    time: '',
    notes: '',
    date: undefined as Date | undefined,
  });
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchMentors();
    // Set user data for booking
    if (user) {
      setBookingData(prev => ({
        ...prev,
        menteeName: user.name || '',
        menteeEmail: user.email || ''
      }));
    }
  }, [user]);

  const fetchMentors = async () => {
    setIsLoading(true);
    try {
      // Fetch real mentors from backend, filter by allowed mentors
      const mentors = await offlineService.getMentors(allowedMentors);
      setAvailableMentors(mentors);
      // Check offline status
      const status = offlineService.getOfflineStatus();
      setOfflineMode(!status.isOnline);
      if (!status.isOnline) {
        toast.info('You are in offline mode. Bookings will be queued for sync when online.');
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast.error('Failed to load mentors');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMentor || !bookingData.menteeName || !bookingData.menteeEmail || !bookingData.date || !bookingData.time) {
      toast.error('Please fill in all required fields, including date and time');
      return;
    }

    try {
      const booking = await offlineService.createBooking({
        mentee: user?._id || 'offline_user',
        menteeName: bookingData.menteeName,
        menteeEmail: bookingData.menteeEmail,
        topic: bookingData.topic || 'General Mentorship',
        time: bookingData.time,
        notes: bookingData.notes,
        date: bookingData.date,
        status: 'pending'
      });

      toast.success(
        offlineMode 
          ? 'Booking created offline! It will be synced when you\'re back online.'
          : 'Booking request sent successfully!'
      );
      
      setShowBookingForm(false);
      setSelectedMentor('');
      setBookingData({
        menteeName: user?.name || '',
        menteeEmail: user?.email || '',
        topic: '',
        time: '',
        notes: '',
        date: undefined,
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking request');
    }
  };

  const handleMentorSelect = (mentorId: string) => {
    setSelectedMentor(mentorId);
    setShowBookingForm(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-10 px-2 md:px-0">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mentors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-10 px-2 md:px-0">
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="text-5xl font-extrabold mb-3 text-blue-900 drop-shadow-lg">Mentorship Program</h1>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
          Connect with experienced mentors who can guide you in your career journey.
        </p>
        
        {offlineMode && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 text-sm">
              📱 Offline Mode - You can view mentors and create booking requests. They will be synced when you're back online.
            </p>
          </div>
        )}
      </div>

      {/* Mentors List */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableMentors.map((mentor) => (
            <div key={mentor._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-4">
                <OfflineImage
                  src={mentor.profilePicture || '/placeholder-mentor.svg'}
                  alt={mentor.name}
                  className="w-16 h-16 rounded-full object-cover"
                  fallbackSrc="/placeholder-mentor.svg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{mentor.name}</h3>
                  <p className="text-blue-600 font-medium">{mentor.expertise}</p>
                  <p className="text-gray-600 text-sm mt-2">{mentor.bio}</p>
                  
                  <button
                    onClick={() => handleMentorSelect(mentor._id)}
                    disabled={offlineMode}
                    className={`mt-4 px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                      offlineMode
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {offlineMode ? 'Booking unavailable offline' : 'Book Session'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {availableMentors.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors available</h3>
            <p className="text-gray-600">
              {offlineMode 
                ? "No cached mentors found. Please connect to the internet to load mentors."
                : "Check back later for available mentors."
              }
            </p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Book Mentorship Session</h2>
            
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={bookingData.menteeName}
                  onChange={(e) => setBookingData(prev => ({ ...prev, menteeName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={bookingData.menteeEmail}
                  onChange={(e) => setBookingData(prev => ({ ...prev, menteeEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  value={bookingData.topic}
                  onChange={(e) => setBookingData(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="What would you like to discuss?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date *
                </label>
                <div className="flex justify-center">
                  <DayPicker
                    mode="single"
                    selected={bookingData.date}
                    onSelect={(date) => setBookingData(prev => ({ ...prev, date }))}
                    fromDate={new Date()}
                    className="border rounded-md p-1 shadow-sm w-fit min-w-[220px] max-w-[260px] text-sm bg-white"
                    style={{ fontSize: '0.9rem' }}
                    required
                  />
                </div>
                {!bookingData.date && <p className="text-xs text-red-500 mt-1">Please select a date.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Time *
                </label>
                <select
                  value={bookingData.time}
                  onChange={e => setBookingData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a time</option>
                  {Array.from({ length: ((19 - 9) * 60) / 15 + 1 }, (_, i) => {
                    const minutes = 9 * 60 + i * 15;
                    const h = Math.floor(minutes / 60);
                    const m = minutes % 60;
                    const label = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                    const ampm = h < 12 ? 'AM' : 'PM';
                    const hour12 = h % 12 === 0 ? 12 : h % 12;
                    const display = `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
                    return <option key={label} value={label}>{display}</option>;
                  })}
                </select>
                {!bookingData.time && <p className="text-xs text-red-500 mt-1">Please select a time.</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any specific questions or topics you'd like to cover?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {offlineMode ? 'Queue Booking' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offline Status */}
      {offlineMode && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-md">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-blue-800 text-sm">
              Offline Mode - Bookings will be synced when online
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentorship;
