import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import assets from "../../assets/assets"
import api from "../../api/axios"
import { useTranslation } from "react-i18next"
import Newsletter from "../../components/Newsletter"
import { AxiosError } from "axios"

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
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t('programs.mentorship.booking.error'))
      } else {
        toast.error(t('programs.mentorship.booking.error'))
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative pt-28"
        style={{ backgroundImage: `url(${assets.blogbg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {t('programs.mentorship.hero.title')}
            </h1>
            <p className="text-xl text-black max-w-3xl mx-auto">
              {t('programs.mentorship.hero.description')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Program Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('programs.mentorship.overview.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('programs.mentorship.overview.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t('programs.mentorship.overview.features.personalized.title'),
                description: t('programs.mentorship.overview.features.personalized.description'),
                icon: "🎯"
              },
              {
                title: t('programs.mentorship.overview.features.expertise.title'),
                description: t('programs.mentorship.overview.features.expertise.description'),
                icon: "👩‍💼"
              },
              {
                title: t('programs.mentorship.overview.features.network.title'),
                description: t('programs.mentorship.overview.features.network.description'),
                icon: "🌐"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('programs.mentorship.details.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('programs.mentorship.details.duration')}</h3>
              <p className="text-gray-600">{t('programs.mentorship.details.durationValue')}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('programs.mentorship.details.schedule')}</h3>
              <p className="text-gray-600">{t('programs.mentorship.details.scheduleValue')}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('programs.mentorship.details.location')}</h3>
              <p className="text-gray-600">{t('programs.mentorship.details.locationValue')}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('programs.mentorship.details.prerequisites')}</h3>
              <p className="text-gray-600">{t('programs.mentorship.details.prerequisitesValue')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Modules */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('programs.mentorship.curriculum.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: t('programs.mentorship.curriculum.modules.oneOnOne.title'),
                description: t('programs.mentorship.curriculum.modules.oneOnOne.description')
              },
              {
                title: t('programs.mentorship.curriculum.modules.group.title'),
                description: t('programs.mentorship.curriculum.modules.group.description')
              },
              {
                title: t('programs.mentorship.curriculum.modules.industry.title'),
                description: t('programs.mentorship.curriculum.modules.industry.description')
              },
              {
                title: t('programs.mentorship.curriculum.modules.leadership.title'),
                description: t('programs.mentorship.curriculum.modules.leadership.description')
              }
            ].map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-gray-600">{module.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('programs.mentorship.cta.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {t('programs.mentorship.cta.description')}
            </p>
            <button 
              onClick={handleBookNow}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {t('programs.mentorship.cta.button')}
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  )
}

export default Mentorship; 