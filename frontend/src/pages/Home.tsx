import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import Newsletter from "../components/Newsletter"
import assets from "../assets/assets"
import { useTranslation } from 'react-i18next'

const Home = () => {
  const { t } = useTranslation();

  const featuredCourses = [
    {
      title: t('home.featuredCourses.courses.computerBasics.title'),
      description: t('home.featuredCourses.courses.computerBasics.description'),
      level: t('home.featuredCourses.courses.computerBasics.level'),
      duration: t('home.featuredCourses.courses.computerBasics.duration'),
      students: t('home.featuredCourses.courses.computerBasics.students'),
      route: "/resources/learning"
    },
    {
      title: t('home.featuredCourses.courses.internetSkills.title'),
      description: t('home.featuredCourses.courses.internetSkills.description'),
      level: t('home.featuredCourses.courses.internetSkills.level'),
      duration: t('home.featuredCourses.courses.internetSkills.duration'),
      students: t('home.featuredCourses.courses.internetSkills.students'),
      route: "/resources/learning"
    },
    {
      title: t('home.featuredCourses.courses.microsoftWord.title'),
      description: t('home.featuredCourses.courses.microsoftWord.description'),
      level: t('home.featuredCourses.courses.microsoftWord.level'),
      duration: t('home.featuredCourses.courses.microsoftWord.duration'),
      students: t('home.featuredCourses.courses.microsoftWord.students'),
      route: "/resources/learning"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden pt-28 min-h-[600px]"
      style={{ 
        backgroundImage: `url(${assets.herobg})`, 
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }} >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwLTIuMjA5IDEuNzkxLTQgNC00czQgMS43OTEgNCA0LTEuNzkxIDQtNCA0LTQtMS43OTEtNC00eiIgZmlsbD0iI2U1ZTdlYiIvPjwvZz48L3N2Zz4=')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-black mb-8 leading-tight tracking-tight">
                {t('home.hero.title')}{" "}
                <span className="text-blue-600">{t('home.hero.titleHighlight')}</span>
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {t('home.hero.description1')}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {t('home.hero.description2')}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Link
                  to="/programs"
                  className="w-full sm:w-auto px-8 py-4 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center"
                >
                  {t('home.hero.explorePrograms')}
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-gray-200 text-center"
                >
                  {t('contactUs')}
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { number: "100+", label: t('home.stats.womenEmpowered') },
                  { number: "95%", label: t('home.stats.successRate') },
                  { number: "10+", label: t('home.stats.expertMentors') },
                  { number: "5+", label: t('home.stats.partnerCompanies') }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 text-center"
                  >
                    <div className="text-3xl font-bold text-gray-700 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-black font-medium tracking-wide">{t('home.featuredCourses.title')}</span>
            <h2 className="text-3xl font-bold text-blue-600 mt-2 mb-4 tracking-tight">
              {t('home.featuredCourses.subtitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('home.featuredCourses.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="px-2 py-1 bg-gray-100 rounded-full">{course.level}</span>
                    <span>{course.duration}</span>
                    <span>{course.students}</span>
                  </div>
                  <Link
                    to={course.route}
                    className="block w-full text-center bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
                  >
                    {t('home.featuredCourses.learnMore')}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-black font-medium tracking-wide">{t('home.whyChooseUs.title')}</span>
            <h2 className="text-3xl font-bold text-blue-600 mt-2 mb-4 tracking-tight">
              {t('home.whyChooseUs.subtitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('home.whyChooseUs.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎓",
                title: t('home.whyChooseUs.features.expertLearning.title'),
                description: t('home.whyChooseUs.features.expertLearning.description')
              },
              {
                icon: "🤝",
                title: t('home.whyChooseUs.features.mentorship.title'),
                description: t('home.whyChooseUs.features.mentorship.description')
              },
              {
                icon: "💼",
                title: t('home.whyChooseUs.features.careerSupport.title'),
                description: t('home.whyChooseUs.features.careerSupport.description')
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-4 transform hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-black font-medium tracking-wide">Success Stories</span>
            <h2 className="text-3xl font-bold text-blue-600 mt-2 mb-4 tracking-tight">
              Hear From Our Community
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover how our programs have transformed careers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Marie Uwimana",
                role: "Software Developer",
                image: assets.profile,
                quote: "EmpowerHerEd gave me the skills and confidence to pursue my dream career in tech."
              },
              {
                name: "Grace Mukamana",
                role: "UX Designer",
                image: assets.profile,
                quote: "The mentorship program helped me transition into tech and find my passion."
              },
              {
                name: "Sarah Niyonsenga",
                role: "Data Scientist",
                image: assets.profile,
                quote: "The support and guidance I received were invaluable to my success."
              }
            ].map((story, index) => (
            <motion.div
                key={story.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover mr-4 ring-2 ring-gray-200"
                  />
                <div>
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">{story.name}</h3>
                    <p className="text-gray-600">{story.role}</p>
              </div>
                </div>
                <p className="text-gray-600 italic">"{story.quote}"</p>
            </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/success-stories"
              className="inline-flex items-center text-gray-700 hover:text-gray-800 font-medium transition-colors duration-300"
            >
              View All Success Stories
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join our community of women in tech and take the first step towards your dream career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all duration-300 text-lg font-medium"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
