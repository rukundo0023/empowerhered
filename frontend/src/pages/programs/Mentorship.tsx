import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

// Mentor type
interface Mentor {
  _id: string;
  name: string;
  expertise: string;
  profilePicture?: string;
  email?: string;
}

const Mentorship = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [availableMentors, setAvailableMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [mentorBusySlots, setMentorBusySlots] = useState<{ [mentorId: string]: { start: string, end: string }[] }>({});
  const [selectedDate, setSelectedDate] = useState<{ [mentorId: string]: Date | undefined }>({});
  const [selectedTime, setSelectedTime] = useState<{ [mentorId: string]: string }>({});
  const bookingInProgress = useRef(false);
  const [busyLoading, setBusyLoading] = useState<{ [mentorId: string]: boolean }>({});

  // Check if mentor has connected Google Calendar
  useEffect(() => {
    if (user?.role === 'mentor' && user?.googleAccessToken) {
      setGoogleConnected(true);
    }
  }, [user]);

  // Fetch available mentors
  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/mentors/available');
        setAvailableMentors(res.data);
      } catch (err) {
        toast.error('Failed to fetch mentors');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentors();
  }, []);

  // Fetch busy slots for a mentor (now public for use on date select)
  const fetchMentorAvailability = async (mentorId: string, date?: Date) => {
    setBusyLoading(prev => ({ ...prev, [mentorId]: true }));
    try {
      const res = await api.get(`/mentors/availability?mentorId=${mentorId}`);
      setMentorBusySlots(prev => ({ ...prev, [mentorId]: res.data }));
    } catch (err) {
      setMentorBusySlots(prev => ({ ...prev, [mentorId]: [] }));
    } finally {
      setBusyLoading(prev => ({ ...prev, [mentorId]: false }));
    }
  };

  // On page load, fetch for all mentors
  useEffect(() => {
    availableMentors.forEach(mentor => {
      if (mentor._id) fetchMentorAvailability(mentor._id);
    });
    // eslint-disable-next-line
  }, [availableMentors]);

  // On date select, re-fetch busy slots for that mentor
  const handleDateSelect = (mentorId: string, date: Date | undefined) => {
    setSelectedDate(prev => ({ ...prev, [mentorId]: date }));
    if (mentorId && date) {
      fetchMentorAvailability(mentorId, date);
    }
  };

  // Mentor: Connect Google Calendar
  const handleConnectGoogle = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  // After booking, re-fetch busy slots for that mentor
  const handleBookGoogleSlot = async (mentorId: string) => {
    const date = selectedDate[mentorId];
    const time = selectedTime[mentorId];
    if (!date || !time) return toast.error('Please select a date and time.');
    const [hours, minutes] = time.split(':').map(Number);
    const startDateTime = new Date(date);
    startDateTime.setHours(hours, minutes, 0, 0);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    if (bookingInProgress.current) return;
    bookingInProgress.current = true;
    try {
      await api.post('/mentors/book', {
        mentorId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        summary: 'Mentorship Session'
      });
      toast.success('Booking successful! Check your email/calendar.');
      // Re-fetch busy slots for this mentor
      fetchMentorAvailability(mentorId);
    } catch (err) {
      toast.error('Booking failed.');
    } finally {
      bookingInProgress.current = false;
    }
  };

  // Helper: get busy days for react-day-picker
  const getDisabledDays = (mentorId: string) => {
    const busy = mentorBusySlots[mentorId] || [];
    // Collect all busy dates (not times)
    const busyDates = busy.map(slot => {
      const start = new Date(slot.start);
      return new Date(start.getFullYear(), start.getMonth(), start.getDate());
    });
    return busyDates;
  };

  // Helper: time options (every 30 min from 8am to 6pm)
  const timeOptions = Array.from({ length: 20 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const min = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${min}`;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-10 px-2 md:px-0">
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="text-5xl font-extrabold mb-3 text-blue-900 drop-shadow-lg">Mentorship Program</h1>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
          Book a session with a mentor. All bookings are synced with Google Calendar for real-time availability!
        </p>
        {/* Mentor: Google Calendar connect button/status */}
        {user?.role === 'mentor' && (
          <div className="mb-4">
            {googleConnected ? (
              <span className="text-green-600 font-semibold text-lg">Google Calendar Connected ✅</span>
            ) : (
              <button
                className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all font-semibold text-lg"
                onClick={handleConnectGoogle}
              >
                Connect Google Calendar
              </button>
            )}
          </div>
        )}
      </div>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Available Mentors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {isLoading ? (
            <div className="col-span-2 text-center text-lg">Loading mentors...</div>
          ) : availableMentors.length === 0 ? (
            <div className="col-span-2 text-center text-lg">No mentors available at the moment.</div>
          ) : (
            availableMentors.map(mentor => (
              <div
                key={mentor._id}
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border border-blue-100 hover:shadow-2xl transition-all duration-300 relative group"
              >
                <div className="relative mb-3">
                  <img
                    src={mentor.profilePicture || '/default-profile.png'}
                    alt={mentor.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow-lg group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white bg-green-500 shadow"></span>
                </div>
                <h2 className="text-xl font-bold mb-1 text-blue-900">{mentor.name}</h2>
                <p className="text-blue-700 mb-2 font-medium">{mentor.expertise}</p>
                <div className="w-full border-t border-blue-100 my-3" />
                <div className="mb-2 w-full">
                  <label className="block font-medium mb-1 text-gray-700">Book a Session:</label>
                  <DayPicker
                    mode="single"
                    selected={selectedDate[mentor._id]}
                    onSelect={date => handleDateSelect(mentor._id, date)}
                    disabled={getDisabledDays(mentor._id)}
                    fromDate={new Date()}
                    className="mb-2 mx-auto"
                  />
                  {busyLoading[mentor._id] && (
                    <div className="text-blue-500 text-sm mb-2">Loading availability...</div>
                  )}
                  <select
                    className="w-full border rounded px-2 py-2 mb-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    value={selectedTime[mentor._id] || ''}
                    onChange={e => setSelectedTime(prev => ({ ...prev, [mentor._id]: e.target.value }))}
                    disabled={busyLoading[mentor._id]}
                  >
                    <option value="">Select time</option>
                    {timeOptions.map(time => {
                      const date = selectedDate[mentor._id];
                      let isBusy = false;
                      if (date) {
                        const [hour, minute] = time.split(':').map(Number);
                        const slotStart = new Date(date);
                        slotStart.setHours(hour, minute, 0, 0);
                        const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);
                        isBusy = (mentorBusySlots[mentor._id] || []).some(slot => {
                          const busyStart = new Date(slot.start);
                          const busyEnd = new Date(slot.end);
                          return (
                            slotStart < busyEnd && slotEnd > busyStart
                          );
                        });
                      }
                      return (
                        <option key={time} value={time} disabled={isBusy}>
                          {time} {isBusy ? '(Booked)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <button
                  className="mt-2 w-full bg-gradient-to-r from-green-500 to-green-400 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:from-green-600 hover:to-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleBookGoogleSlot(mentor._id)}
                  disabled={!selectedDate[mentor._id] || !selectedTime[mentor._id]}
                >
                  Book Session
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Mentorship;
