import { motion } from "framer-motion"
import assets from "../assets/assets"
import { useTranslation } from 'react-i18next'

const Community = () => {
  const { t } = useTranslation();

  const events = [
    {
      title: t('community.events.monthlyMeetup.title'),
      date: "March 25, 2024",
      time: "6:00 PM - 8:00 PM",
      location: "Virtual",
      description: t('community.events.monthlyMeetup.description')
    },
    {
      title: t('community.events.codingWorkshop.title'),
      date: "April 2, 2024",
      time: "10:00 AM - 2:00 PM",
      location: "Tech Hub",
      description: t('community.events.codingWorkshop.description')
    },
    {
      title: t('community.events.careerFair.title'),
      date: "April 15, 2024",
      time: "11:00 AM - 4:00 PM",
      location: "Convention Center",
      description: t('community.events.careerFair.description')
    }
  ]

  const features = [
    {
      title: t('community.features.mentorship.title'),
      description: t('community.features.mentorship.description'),
      icon: "👥"
    },
    {
      title: t('community.features.studyGroups.title'),
      description: t('community.features.studyGroups.description'),
      icon: "📚"
    },
    {
      title: t('community.features.jobBoard.title'),
      description: t('community.features.jobBoard.description'),
      icon: "💼"
    },
    {
      title: t('community.features.forums.title'),
      description: t('community.features.forums.description'),
      icon: "💬"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20"
        style={{ backgroundImage: `url(${assets.communitybg2})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
              {t('community.hero.title')}
            </h1>
            <p className="text-lg text-black max-w-2xl mx-auto">
              {t('community.hero.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('community.events.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('community.events.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600">
                    <span className="font-semibold">Itariki:</span> {event.date}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Igihe:</span> {event.time}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Ahantu:</span> {event.location}
                  </p>
                </div>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <button className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  {t('community.join.button')}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Community Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-700 rounded-2xl p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">{t('community.join.title')}</h2>
            <p className="text-gray-100 mb-8 max-w-2xl mx-auto">
              {t('community.join.description')}
            </p>
            <button className="bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              {t('community.join.button')}
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Community 