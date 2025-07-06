import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import assets from "../../assets/assets";
import api from "../../api/axios";
import { useTranslation } from "react-i18next";
import Newsletter from "../../components/Newsletter";
import { AxiosError } from "axios";
import { useAuth } from "../../context/AuthContext";
import { useCallback, useState, useRef, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Add Mentor type
type Mentor = {
  _id: string;
  name: string;
  expertise: string;
  availability?: string[]; // ISO date strings
  isAvailable?: boolean; // Added for active indicator
  profilePicture?: string; // Added for avatar
};

const Mentorship = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [availableMentors, setAvailableMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bookingInProgress = useRef(false);
  const loadingToastRef = useRef<number | null>(null);
  const [selectedDates, setSelectedDates] = useState<{ [mentorId: string]: Date | null }>({});

  useEffect(() => {
    return () => {
      if (loadingToastRef.current) {
        toast.dismiss(loadingToastRef.current);
      }
    };
  }, []);

  const fetchAvailableMentors = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/mentors/available');
      setAvailableMentors(response.data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast.error(t('mentorship.fetchMentorsError'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchAvailableMentors();
  }, [fetchAvailableMentors]);

  const handleBookNow = async (mentorId: string, selectedDate: Date | null) => {
    if (!user) {
      toast.error(t('programs.mentorship.booking.loginRequired'));
      navigate('/login');
      return;
    }

    if (!selectedDate) {
      toast.error(t('programs.mentorship.booking.selectDate'));
      return;
    }

    if (bookingInProgress.current) return;

    bookingInProgress.current = true;
    const loadingToast = toast.loading(t('programs.mentorship.booking.loading'));

    try {
      if (!user._id) throw new Error('User ID is missing');

      const bookingData = {
        mentee: user._id,
        name: user.name,
        email: user.email,
        topic: 'Initial Mentorship Session',
        date: selectedDate.toISOString(),
        duration: 60,
        status: 'pending',
        mentor: mentorId
      };

      const response = await api.post('/mentors/bookings', bookingData);

      toast.dismiss(loadingToast);
      toast.success(t('programs.mentorship.booking.success'));
      navigate('/profile', {
        state: {
          bookingInfo: response.data,
          message: t('programs.mentorship.booking.success')
        }
      });
    } catch (error) {
      console.error('Error booking mentorship:', error);
      toast.dismiss(loadingToast);

      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error(t('programs.mentorship.booking.loginRequired'));
          navigate('/login');
        } else {
          toast.error(error.response?.data?.message || t('programs.mentorship.booking.error'));
        }
      } else {
        toast.error(t('programs.mentorship.booking.error'));
      }
    } finally {
      bookingInProgress.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative pt-28"
        style={{ backgroundImage: `url(${assets.communicationbg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-black mb-6">
              {t('programs.mentorship.hero.title')}
            </h1>
            <p className="text-xl text-black max-w-3xl mx-auto">
              {t('programs.mentorship.hero.description')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Available Mentors Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            {t('programs.mentorship.overview.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('programs.mentorship.overview.description')}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : availableMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {availableMentors.map((mentor) => (
              <motion.div
                key={mentor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, boxShadow: '0 6px 24px rgba(0,0,0,0.14)' }}
                className="relative flex flex-col items-center bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-xl shadow-lg p-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.015] border border-blue-100"
                style={{ minHeight: 320 }}
              >
                {/* Profile Picture and Active Indicator */}
                <div className="relative mb-2">
                  <img
                    src={mentor.profilePicture || assets.profile}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow ring-1 ring-blue-200"
                  />
                  {/* Active/Inactive Dot */}
                  <span
                    className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow ${mentor.isAvailable !== false ? 'bg-green-500' : 'bg-red-400'}`}
                    title={mentor.isAvailable !== false ? t('programs.mentorship.active') : t('programs.mentorship.inactive')}
                  />
                </div>
                <h3 className="text-lg font-bold mb-1 flex items-center justify-center gap-2 text-gray-800">
                  {mentor.name}
                  <span className={`ml-2 text-xs font-semibold ${mentor.isAvailable !== false ? 'text-green-600' : 'text-red-500'}`}
                    >
                    {mentor.isAvailable !== false ? t('programs.mentorship.active') : t('programs.mentorship.inactive')}
                  </span>
                </h3>
                <p className="text-sm text-blue-700 mb-3 font-medium tracking-wide">{mentor.expertise}</p>
                <div className="w-full border-t border-blue-200 my-2" />

                {mentor.availability && mentor.availability.length > 0 ? (
                  <div className="mb-2">
                    <span className="font-medium block mb-2">{t('programs.mentorship.availability')}:</span>
                    <Calendar
                      tileDisabled={({ date }) =>
                        !mentor.availability?.some(slot => {
                          const slotDate = new Date(slot);
                          return (
                            slotDate.getFullYear() === date.getFullYear() &&
                            slotDate.getMonth() === date.getMonth() &&
                            slotDate.getDate() === date.getDate()
                          );
                        })
                      }
                      onClickDay={date => setSelectedDates(prev => ({ ...prev, [mentor._id]: date }))}
                      value={selectedDates[mentor._id] || null}
                    />
                    {selectedDates[mentor._id] && (
                      <div className="mt-2 text-sm text-blue-700">
                        {t('programs.mentorship.selectedDate')}: {selectedDates[mentor._id]?.toLocaleString()}
                      </div>
                    )}
                    <button
                      onClick={() => handleBookNow(mentor._id, selectedDates[mentor._id])}
                      className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                      disabled={!selectedDates[mentor._id]}
                    >
                      {t('programs.mentorship.bookNow')}
                    </button>
                  </div>
                ) : (
                  <div className="mb-2 text-sm text-gray-500">
                    {t('programs.mentorship.noAvailability')}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              {t('programs.mentorship.booking.noMentors')}
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-100 py-16"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            {t('programs.mentorship.cta.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('programs.mentorship.cta.description')}
          </p>
          <button
            onClick={() => {
              // Find the first selected mentor and date
              const selectedMentorId = Object.keys(selectedDates).find(
                (mentorId) => selectedDates[mentorId]
              );
              const selectedDate = selectedMentorId ? selectedDates[selectedMentorId] : null;
              if (selectedMentorId && selectedDate) {
                handleBookNow(selectedMentorId, selectedDate);
              } else {
                toast.info(t('programs.mentorship.cta.selectMentorFirst'));
              }
            }}
            className={`bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition-colors`}
          >
            {t('programs.mentorship.cta.button')}
          </button>
        </div>
      </motion.div>

      <Newsletter />
    </div>
  );
};

export default Mentorship;
