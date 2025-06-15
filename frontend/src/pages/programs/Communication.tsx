import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import Newsletter from "../../components/Newsletter";
import assets from "../../assets/assets";

const Communication = () => {
  const { t } = useTranslation();

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
              {t('programs.communication.hero.title')}
            </h1>
            <p className="text-xl text-black max-w-3xl mx-auto">
              {t('programs.communication.hero.description')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Program Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('programs.communication.overview.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('programs.communication.overview.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t('programs.communication.overview.features.presentation.title'),
                description: t('programs.communication.overview.features.presentation.description'),
                icon: "🎤"
              },
              {
                title: t('programs.communication.overview.features.writing.title'),
                description: t('programs.communication.overview.features.writing.description'),
                icon: "✍️"
              },
              {
                title: t('programs.communication.overview.features.digital.title'),
                description: t('programs.communication.overview.features.digital.description'),
                icon: "💻"
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
              {t('programs.communication.details.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('programs.communication.details.modules.Duration.title')}</h3>
              <p>{t('programs.communication.details.modules.Duration.description')}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('programs.communication.details.modules.Schedule.title')}</h3>
              <p>{t('programs.communication.details.modules.Schedule.description')}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('programs.communication.details.modules.Location.title')}</h3>
              <p>{t('programs.communication.details.modules.Location.description')}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('programs.communication.details.modules.Prerequisites.title')}</h3>
              <p>{t('programs.communication.details.modules.Prerequisites.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Modules */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('programs.communication.curriculum.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: t('programs.communication.curriculum.modules.publicSpeaking.title'),
                description: t('programs.communication.curriculum.modules.publicSpeaking.description')
              },
              {
                title: t('programs.communication.curriculum.modules.businessWriting.title'),
                description: t('programs.communication.curriculum.modules.businessWriting.description')
              },
              {
                title: t('programs.communication.curriculum.modules.digitalMedia.title'),
                description: t('programs.communication.curriculum.modules.digitalMedia.description')
              },
              {
                title: t('programs.communication.curriculum.modules.interpersonal.title'),
                description: t('programs.communication.curriculum.modules.interpersonal.description')
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
              {t('programs.communication.cta.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {t('programs.communication.cta.description')}
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              {t('programs.communication.cta.button')}
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section>
    </div>
  );
};

export default Communication; 