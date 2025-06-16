import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import Newsletter from "../../components/Newsletter"
import assets from "../../assets/assets"

const Workshops = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative pt-28"
        style={{ backgroundImage: `url(${assets.workshopbg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {t('programs.workshops.hero.title')}
            </h1>
            <p className="text-xl text-black max-w-3xl mx-auto">
              {t('programs.workshops.hero.description')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Program Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('programs.workshops.overview.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('programs.workshops.overview.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t('programs.workshops.overview.features.handsOn.title'),
                description: t('programs.workshops.overview.features.handsOn.description'),
                icon: "👩‍💻"
              },
              {
                title: t('programs.workshops.overview.features.expert.title'),
                description: t('programs.workshops.overview.features.expert.description'),
                icon: "👩‍🏫"
              },
              {
                title: t('programs.workshops.overview.features.networking.title'),
                description: t('programs.workshops.overview.features.networking.description'),
                icon: "🤝"
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
              {t('programs.workshops.details.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('programs.workshops.details.duration')}</h3>
              <p>{t('programs.workshops.details.durationValue')}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('programs.workshops.details.schedule')}</h3>
              <p>{t('programs.workshops.details.scheduleValue')}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('programs.workshops.details.location')}</h3>
              <p>{t('programs.workshops.details.locationValue')}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('programs.workshops.details.prerequisites')}</h3>
              <p>{t('programs.workshops.details.prerequisitesValue')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Workshops */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-6">
              {t('programs.workshops.upcoming.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{t('programs.workshops.upcoming.workshops.webDev.title')}</h3>
              <p className="text-gray-600 mb-4">{t('programs.workshops.upcoming.workshops.webDev.description')}</p>
              <p className="text-sm text-gray-500">{t('programs.workshops.upcoming.workshops.webDev.date')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{t('programs.workshops.upcoming.workshops.data.title')}</h3>
              <p className="text-gray-600 mb-4">{t('programs.workshops.upcoming.workshops.data.description')}</p>
              <p className="text-sm text-gray-500">{t('programs.workshops.upcoming.workshops.data.date')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{t('programs.workshops.upcoming.workshops.cybersecurity.title')}</h3>
              <p className="text-gray-600 mb-4">{t('programs.workshops.upcoming.workshops.cybersecurity.description')}</p>
              <p className="text-sm text-gray-500">{t('programs.workshops.upcoming.workshops.cybersecurity.date')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{t('programs.workshops.upcoming.workshops.leadership.title')}</h3>
              <p className="text-gray-600 mb-4">{t('programs.workshops.upcoming.workshops.leadership.description')}</p>
              <p className="text-sm text-gray-500">{t('programs.workshops.upcoming.workshops.leadership.date')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('programs.workshops.cta.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {t('programs.workshops.cta.description')}
            </p>
            <button 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {t('programs.workshops.cta.button')}
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  )
}

export default Workshops; 