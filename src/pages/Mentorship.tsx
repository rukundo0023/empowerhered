import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import assets from "../../assets/assets"
import api from "../../api/axios"
import { useTranslation } from "react-i18next"
import Newsletter from "../../components/Newsletter"
import { AxiosError } from "axios"
import { useAuth } from "../../context/AuthContext"
import { useCallback, useState, useRef, useEffect } from "react"

interface Mentor {
  _id: string;
  name: string;
  expertise: string;
}

interface BookingData {
  mentee: string;
  name: string;
  email: string;
  topic: string;
  duration: number;
  status: string;
  mentor: string | null;
}

const Mentorship = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user, isAuthenticated } = useAuth()
  const [availableMentors, setAvailableMentors] = useState<Mentor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const bookingInProgress = useRef(false)
  const loadingToastRef = useRef<number | null>(null)
  
  // Cleanup function to dismiss any active toasts when component unmounts
  useEffect(() => {
    return () => {
      if (loadingToastRef.current) {
        toast.dismiss(loadingToastRef.current)
      }
    }
  }, [])

  const fetchAvailableMentors = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await api.get<Mentor[]>('/mentors/available')
      setAvailableMentors(response.data)
    } catch (error) {
      console.error('Error fetching mentors:', error)
      toast.error(t('mentorship.fetchMentorsError'))
    } finally {
      setIsLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchAvailableMentors()
  }, [fetchAvailableMentors])

  const handleBookNow = async () => {
    if (!user) {
      toast.error(t('programs.mentorship.booking.loginRequired'));
      navigate('/login');
      return;
    }

    if (bookingInProgress.current) {
      return;
    }

    bookingInProgress.current = true;
    setIsBooking(true);
    loadingToastRef.current = toast.loading(t('programs.mentorship.booking.loading'));

    try {
      // Log user object to verify data
      console.log('Current user:', {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });

      if (!user._id) {
        throw new Error('User ID is missing');
      }

      // Create booking request with mentee details only
      const bookingData: BookingData = {
        mentee: user._id,
        name: user.name,
        email: user.email,
        topic: 'Initial Mentorship Session',
        duration: 60,
        status: 'pending',
        mentor: null // Explicitly set mentor to null
      };

      console.log('Sending booking request:', bookingData);
      const response = await api.post('/mentors/bookings', bookingData);

      if (loadingToastRef.current) {
        toast.dismiss(loadingToastRef.current);
      }
      toast.success(t('programs.mentorship.booking.success'));
      navigate('/profile', { 
        state: { 
          bookingInfo: response.data,
          message: t('programs.mentorship.booking.success')
        }
      });
    } catch (error) {
      console.error('Error booking mentorship:', error);
      if (loadingToastRef.current) {
        toast.dismiss(loadingToastRef.current);
      }
      
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
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative pt-28"
        style={{ backgroundImage: `url(${assets.mentorshipbg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              {t('programs.mentorship.hero.title')}
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
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
            {availableMentors.map((mentor: Mentor) => (
              <motion.div
                key={mentor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg p-6 text-center"
              >
                <h3 className="text-xl font-semibold mb-2">{mentor.name}</h3>
                <p className="text-gray-600 mb-4">{mentor.expertise}</p>
                <button
                  onClick={handleBookNow}
                  disabled={isBooking}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isBooking ? t('programs.mentorship.booking') : t('programs.mentorship.bookNow')}
                </button>
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
            onClick={handleBookNow}
            disabled={isBooking}
            className={`bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition-colors ${
              isBooking ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isBooking ? t('programs.mentorship.booking.loading') : t('programs.mentorship.cta.button')}
          </button>
        </div>
      </motion.div>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  )
}

export default Mentorship; 