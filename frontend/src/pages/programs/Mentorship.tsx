import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import assets from "../../assets/assets"
import api from "../../api/axios"
import { useTranslation } from "react-i18next"

const Mentorship = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  const handleBookNow = async () => {
    try {
      // Get current user info from localStorage or your auth context
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      
      if (!userInfo._id) {
        toast.error(t('programs.mentorship.booking.loginRequired'))
        navigate('/login')
        return
      }

      // First, get available mentors
      const mentorsResponse = await api.get('/mentors/available')
      const availableMentors = mentorsResponse.data

      if (!availableMentors || availableMentors.length === 0) {
        toast.error(t('programs.mentorship.booking.noMentors'))
        return
      }

      // Select the first available mentor (you can implement mentor selection later)
      const selectedMentor = availableMentors[0]
      
      // Create booking request
      const bookingData = {
        mentor: selectedMentor._id,
        mentee: userInfo._id,
        name: userInfo.name,
        email: userInfo.email,
        status: 'pending',
        date: new Date().toISOString(),
        topic: 'Initial Mentorship Session',
        duration: 60
      }

      // Send booking request to backend
      const response = await api.post('/mentors/bookings', bookingData)
      
      // Show success message
      toast.success(t('programs.mentorship.booking.success'))
      
      // Navigate to mentor dashboard
      navigate('/mentorDashboard', { 
        state: { 
          bookingInfo: response.data,
          message: t('programs.mentorship.booking.success')
        }
      })
    } catch (error) {
      console.error('Error booking mentorship:', error)
      toast.error(error.response?.data?.message || t('programs.mentorship.booking.error'))
    }
  }

  const modules = [
    {
      title: t('programs.mentorship.modules.oneOnOne.title'),
      description: t('programs.mentorship.modules.oneOnOne.description'),
      topics: t('programs.mentorship.modules.oneOnOne.topics', { returnObjects: true })
    },
    {
      title: t('programs.mentorship.modules.group.title'),
      description: t('programs.mentorship.modules.group.description'),
      topics: t('programs.mentorship.modules.group.topics', { returnObjects: true })
    },
    {
      title: t('programs.mentorship.modules.industry.title'),
      description: t('programs.mentorship.modules.industry.description'),
      topics: t('programs.mentorship.modules.industry.topics', { returnObjects: true })
    },
    {
      title: t('programs.mentorship.modules.leadership.title'),
      description: t('programs.mentorship.modules.leadership.description'),
      topics: t('programs.mentorship.modules.leadership.topics', { returnObjects: true })
    },
    {
      title: t('programs.mentorship.modules.career.title'),
      description: t('programs.mentorship.modules.career.description'),
      topics: t('programs.mentorship.modules.career.topics', { returnObjects: true })
    }
  ]

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20"
        style={{ backgroundImage: `url(${assets.mentorshipbg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
              {t('programs.mentorship.hero.title')}
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto">
              {t('programs.mentorship.hero.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('programs.mentorship.overview.title')}</h2>
            <p className="text-lg text-gray-600">
              {t('programs.mentorship.overview.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('programs.mentorship.overview.features.personalized.title')}</h3>
              <p className="text-gray-600">
                {t('programs.mentorship.overview.features.personalized.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('programs.mentorship.overview.features.expertise.title')}</h3>
              <p className="text-gray-600">
                {t('programs.mentorship.overview.features.expertise.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('programs.mentorship.overview.features.network.title')}</h3>
              <p className="text-gray-600">
                {t('programs.mentorship.overview.features.network.description')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('programs.mentorship.details.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('programs.mentorship.details.duration.title')}</h3>
                <p className="text-gray-600">{t('programs.mentorship.details.duration.value')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('programs.mentorship.details.schedule.title')}</h3>
                <p className="text-gray-600">{t('programs.mentorship.details.schedule.value')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('programs.mentorship.details.location.title')}</h3>
                <p className="text-gray-600">{t('programs.mentorship.details.location.value')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('programs.mentorship.details.prerequisites.title')}</h3>
                <p className="text-gray-600">{t('programs.mentorship.details.prerequisites.value')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Modules */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{t('programs.mentorship.modules.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{module.title}</h3>
                <p className="text-gray-600 mb-4">{module.description}</p>
                <ul className="space-y-2">
                  {module.topics.map((topic) => (
                    <li key={topic} className="flex items-center text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {topic}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Find Your Mentor?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join our mentorship program and take the next step in your professional journey
          </p>
          <button 
            onClick={handleBookNow}
            className="bg-white text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
          >
            Book Now
          </button>
        </div>
      </section>
    </div>
  )
}

export default Mentorship 