import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const Resources = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Resources</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access our comprehensive collection of learning materials, guides, and tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Resource Category 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Learning Materials</h3>
              <p className="text-gray-600 mb-6">
                Access our comprehensive collection of tutorials, guides, and learning resources
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Tutorial Videos</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Documentation</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Code Examples</span>
                </li>
              </ul>
            </div>

            {/* Resource Category 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Career Resources</h3>
              <p className="text-gray-600 mb-6">
                Tools and guides to help you advance your career in technology
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Resume Templates</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Interview Prep</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Career Path Guides</span>
                </li>
              </ul>
            </div>

            {/* Resource Category 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community Resources</h3>
              <p className="text-gray-600 mb-6">
                Connect with other learners and access community support
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Discussion Forums</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Study Groups</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Mentorship Program</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Materials Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Learning Materials</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Programming Fundamentals */}
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Programming Fundamentals</h3>
                <p className="text-gray-600 mb-4">
                  Master the basics of programming with our comprehensive guides and tutorials.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Introduction to Programming</li>
                  <li>• Data Structures & Algorithms</li>
                  <li>• Object-Oriented Programming</li>
                  <li>• Version Control with Git</li>
                </ul>
              </div>
            </motion.div>

            {/* Web Development */}
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Web Development</h3>
                <p className="text-gray-600 mb-4">
                  Learn modern web development technologies and frameworks.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• HTML5 & CSS3</li>
                  <li>• JavaScript & TypeScript</li>
                  <li>• React & Next.js</li>
                  <li>• Node.js & Express</li>
                </ul>
              </div>
            </motion.div>

            {/* Data Science */}
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Science</h3>
                <p className="text-gray-600 mb-4">
                  Explore the world of data science and machine learning.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Python for Data Science</li>
                  <li>• Data Analysis & Visualization</li>
                  <li>• Machine Learning Basics</li>
                  <li>• SQL & Database Management</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tools & Software Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Tools & Software</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Development Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Development Tools</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>• Visual Studio Code</li>
                <li>• Git & GitHub</li>
                <li>• Docker</li>
                <li>• Postman</li>
              </ul>
            </motion.div>

            {/* Design Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Tools</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>• Figma</li>
                <li>• Adobe XD</li>
                <li>• Canva</li>
                <li>• Sketch</li>
              </ul>
            </motion.div>

            {/* Cloud Platforms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cloud Platforms</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>• AWS</li>
                <li>• Google Cloud</li>
                <li>• Microsoft Azure</li>
                <li>• Heroku</li>
              </ul>
            </motion.div>

            {/* Learning Platforms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Platforms</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>• Coursera</li>
                <li>• Udemy</li>
                <li>• freeCodeCamp</li>
                <li>• Codecademy</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Career Resources Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Career Resources</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* Resume & Interview Prep */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Resume & Interview Prep</h3>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Resume writing guides and templates</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Technical interview preparation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gray-700 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Behavioral interview questions</span>
                  </li>
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
    </div>
  )
}

export default Resources
