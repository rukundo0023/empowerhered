import { motion } from "framer-motion"
import assets from "../assets/assets"
import { useTranslation } from 'react-i18next'

const Resources = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-28"
      style={{ backgroundImage: `url(${assets.herobg})`, backgroundSize: "cover", backgroundPosition: "center"  }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
               className="text-center"
              > 
            <h1 className="text-4xl font-bold text-blue-600 mb-4">{t('resources.hero.title')}</h1>
            <p className="text-xl text-black max-w-2xl mx-auto">
              {t('resources.hero.description')}
            </p>
            </motion.div>
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Resource Category 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('resources.categories.learningMaterials.title')}</h3>
              <p className="text-gray-600 mb-6">
                {t('resources.categories.learningMaterials.description')}
              </p>
              <ul className="space-y-3">
                {t('resources.categories.learningMaterials.items', { returnObjects: true }).map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resource Category 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('resources.categories.careerResources.title')}</h3>
              <p className="text-gray-600 mb-6">
                {t('resources.categories.careerResources.description')}
              </p>
              <ul className="space-y-3">
                {t('resources.categories.careerResources.items', { returnObjects: true }).map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resource Category 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('resources.categories.communityResources.title')}</h3>
              <p className="text-gray-600 mb-6">
                {t('resources.categories.communityResources.description')}
              </p>
              <ul className="space-y-3">
                {t('resources.categories.communityResources.items', { returnObjects: true }).map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Materials Section */}
      <section className="py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('resources.learningMaterials.title')}</h2>
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      
      {/* Computer Basics & Hardware */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('resources.learningMaterials.computerBasics.title')}</h3>
          <p className="text-gray-600 mb-4">
            {t('resources.learningMaterials.computerBasics.description')}
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            {t('resources.learningMaterials.computerBasics.items', { returnObjects: true }).map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Internet & Email Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('resources.learningMaterials.internetSkills.title')}</h3>
          <p className="text-gray-600 mb-4">
            {t('resources.learningMaterials.internetSkills.description')}
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            {t('resources.learningMaterials.internetSkills.items', { returnObjects: true }).map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Microsoft Word */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('resources.learningMaterials.microsoftWord.title')}</h3>
          <p className="text-gray-600 mb-4">
            {t('resources.learningMaterials.microsoftWord.description')} 
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            {t('resources.learningMaterials.microsoftWord.items', { returnObjects: true }).map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>
      </motion.div>

    </div>
  </div>
</section>

      {/* Career Resources Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('resources.careerResources.title')}</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* Resume & Interview Prep */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('resources.careerResources.resume.title')}</h3>
                <ul className="space-y-4 text-gray-600">
                  {t('resources.careerResources.resume.items', { returnObjects: true }).map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Job Search Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Search Resources</h3>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Job board recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Networking strategies</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Salary negotiation guides</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* community resources section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Community Resources</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* Career Advice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Career Advices</h3>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />  
                    </svg>                  
                    <span>Build a Strong Portfolio</span>
                  </li>
                  <li className="flex items-start">  
                    <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Network with Purpose</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span> Keep Learning and Adapting</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Networking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Networking</h3>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Networking strategies</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Salary negotiation guides</span>
                  </li>
                </ul>
              </div>
            </motion.div>
    </div>
  </div>
</section>
</div>
);
};

export default Resources
