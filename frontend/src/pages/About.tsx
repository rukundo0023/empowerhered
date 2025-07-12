import { motion } from "framer-motion"
import assets from "../assets/assets"
import Newsletter from "../components/Newsletter"
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

// Define interfaces for our translation objects
interface ImpactStat {
  number: string;
  label: string;
}

interface CommunityFeature {
  title: string;
  description: string;
  icon: string;
}

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-700/20 to-gray-800/20 pt-28"
        style={{ backgroundImage: `url(${assets.herobg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-black mb-6">
              {t('about.hero.title')} <span className="text-blue-600">{t('about.hero.titleHighlight')}</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.hero.description')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-lg h-full flex flex-col justify-between"
            >
              <h2 className="text-3xl font-bold text-gray-900">{t('about.story.title')}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('about.story.description1')}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('about.story.description2')}
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-lg h-full flex flex-col justify-between"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.whatWeDo.title')}</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {t('about.whatWeDo.description')}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "📚", label: t('about.whatWeDo.services.education') },
                  { icon: "👥", label: t('about.whatWeDo.services.mentorship') },
                  { icon: "🎯", label: t('about.whatWeDo.services.workshops') },
                  { icon: "💼", label: t('about.whatWeDo.services.career') }
                ].map((item) => (
                  <div key={item.label} className="flex items-center space-x-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.mission.title')}</h2>
              <p className="text-gray-600">
                {t('about.mission.description')}
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.vision.title')}</h2>
              <p className="text-gray-600">
                {t('about.vision.description')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.whyItMatters.title')}</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {t('about.whyItMatters.description')}
            </p>
            <p className="text-xl font-semibold text-gray-700">
              {t('about.whyItMatters.highlight')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.values.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t('about.values.items.empowerment.title'),
                description: t('about.values.items.empowerment.description'),
                icon: "🌟"
              },
              {
                title: t('about.values.items.community.title'),
                description: t('about.values.items.community.description'),
                icon: "🤝"
              },
              {
                title: t('about.values.items.innovation.title'),
                description: t('about.values.items.innovation.description'),
                icon: "💡"
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg text-center"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.team.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-5">
            {[
              {
                name: t('about.team.members.founder.name'),
                role: t('about.team.members.founder.role'),
                image: assets.profile
              },
              {
                name: t('about.team.members.education.name'),
                role: t('about.team.members.education.role'),
                image: assets.profile
              }
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.impact.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('about.impact.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "1000+", label: t('about.impact.stats.womenEmpowered') },
              { number: "95%", label: t('about.impact.stats.jobPlacement') },
              { number: "50+", label: t('about.impact.stats.partnerCompanies') },
              { number: "1000+", label: t('about.impact.stats.graduates') }
            ].map((stat: ImpactStat, index: number) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 text-center"
              >
                <div className="text-3xl font-bold text-gray-700 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.community.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('about.community.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t('about.community.features.safeSpace.title'),
                description: t('about.community.features.safeSpace.description'),
                icon: "🏠"
              },
              {
                title: t('about.community.features.peerSupport.title'),
                description: t('about.community.features.peerSupport.description'),
                icon: "👥"
              },
              {
                title: t('about.community.features.networking.title'),
                description: t('about.community.features.networking.description'),
                icon: "🌐"
              }
            ].map((feature: CommunityFeature, index: number) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-2xl shadow-lg text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-blue-600 mb-4">{t('about.cta.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('about.cta.description')}
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/resources/learning"
              className="w-full sm:w-auto px-8 py-4 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center"
            >
              {t('about.cta.primaryButton')}
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-gray-200 text-center"
            >
              {t('about.cta.secondaryButton')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
