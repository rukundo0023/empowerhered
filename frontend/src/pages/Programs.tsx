import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import assets from "../assets/assets"
import { useTranslation } from 'react-i18next'

const Programs = () => {
  const { t } = useTranslation();
  const title = t('programs.hero.title'); // example: "Explore our programs"
const words = title.split(' ');
const lastWord = words.pop(); // removes and returns last word
const firstPart = words.join(' '); // joins remaining words
  
  const programs = [
    {
      id: 1,
      title: t('programs.programs.digitalLiteracy.title'),
      description: t('programs.programs.digitalLiteracy.description'),
      icon: "💻",
      features: t('programs.programs.digitalLiteracy.features', { returnObjects: true }),
      route: "/programs/tech-skills"
    },
    {
      id: 2,
      title: t('programs.programs.communication.title'),
      description: t('programs.programs.communication.description'),
      icon: "👩‍💼",
      features: t('programs.programs.communication.features', { returnObjects: true }),
      route: "/programs/communication"
    },
    {
      id: 3,
      title: t('programs.programs.jobReadiness.title'),
      description: t('programs.programs.jobReadiness.description'),
      icon: "🚀",
      features: t('programs.programs.jobReadiness.features', { returnObjects: true }),
      route: "/programs/workshops"
    },
    {
      id: 4,
      title: t('programs.programs.mentorship.title'),
      description: t('programs.programs.mentorship.description'),
      icon: "👩‍🏫",
      features: t('programs.programs.mentorship.features', { returnObjects: true }),
      route: "/programs/mentorship"
    },
    {
      id: 5,
      title: t('programs.programs.networking.title'),
      description: t('programs.programs.networking.description'),
      icon: "🤝",
      features: t('programs.programs.networking.features', { returnObjects: true }),
      route: "/programs/workshops"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden"
        style={{ backgroundImage: `url(${assets.herobg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[url('/src/assets/pattern.png')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
                {firstPart} <span className="text-primary-500">{lastWord}</span>
              </h1>
              <p className="text-lg text-neutral-700 mb-8">
                {t('programs.hero.description')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-neutral-100"
              >
                <div className="text-4xl mb-4">{program.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-neutral-800">{program.title}</h3>
                <p className="text-neutral-600 mb-4">{program.description}</p>
                <ul className="space-y-2 mb-6">
                  {program.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-neutral-600">
                      <span className="text-primary-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={program.route}
                  className="inline-block w-full text-center bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
                >
                  {t('programs.learnMore')}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold mb-6 text-neutral-800">{t('programs.cta.title')}</h2>
              <p className="text-lg text-neutral-600 mb-8">
                {t('programs.cta.description')}
              </p>
            </motion.div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
              >
                {t('programs.cta.apply')}
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3 border border-gray-700 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                {t('programs.cta.contact')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Programs
