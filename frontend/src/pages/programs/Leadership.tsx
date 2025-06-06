import { motion } from "framer-motion"
import assets from "../../assets/assets"

const Leadership = () => {
  const modules = [
    {
      title: "Leadership Fundamentals",
      description: "Build a strong foundation in leadership principles",
      topics: [
        "Leadership Styles",
        "Emotional Intelligence",
        "Decision Making",
        "Strategic Thinking",
        "Vision Development"
      ]
    },
    {
      title: "Communication Excellence",
      description: "Master the art of effective communication",
      topics: [
        "Public Speaking",
        "Active Listening",
        "Conflict Resolution",
        "Negotiation Skills",
        "Presentation Skills"
      ]
    },
    {
      title: "Team Management",
      description: "Learn to lead and inspire teams effectively",
      topics: [
        "Team Building",
        "Performance Management",
        "Motivation Techniques",
        "Delegation Skills",
        "Feedback & Coaching"
      ]
    },
    {
      title: "Strategic Planning",
      description: "Develop strategic thinking and planning abilities",
      topics: [
        "Goal Setting",
        "Resource Planning",
        "Risk Management",
        "Project Planning",
        "Implementation Strategy"
      ]
    },
    {
      title: "Personal Development",
      description: "Enhance your personal leadership qualities",
      topics: [
        "Self-Awareness",
        "Time Management",
        "Stress Management",
        "Work-Life Balance",
        "Continuous Learning"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="relative bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold mb-4">Leadership Training</h1>
            <p className="text-lg max-w-2xl mx-auto">
              Building the next generation of female leaders in Rwanda
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-purple-50 to-transparent"></div>
      </div>

      {/* Program Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Program Overview</h2>
            <p className="text-sm text-gray-600 mb-6">
              Our Leadership Training program is designed to empower young women with the skills and
              confidence needed to become effective leaders. Through interactive workshops, real-world
              projects, and mentorship, participants will develop essential leadership qualities and
              practical management skills.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">🎯</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Practical Skills</h3>
                  <p className="text-xs text-gray-600">Real-world leadership experience</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">👥</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Team Projects</h3>
                  <p className="text-xs text-gray-600">Collaborative learning environment</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">🤝</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Mentorship</h3>
                  <p className="text-xs text-gray-600">Guidance from experienced leaders</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="text-gray-900 font-medium">16 weeks</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Schedule:</span>
                <span className="text-gray-900 font-medium">Mon-Fri, 2PM-6PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Location:</span>
                <span className="text-gray-900 font-medium">Kigali, Rwanda</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Prerequisites:</span>
                <span className="text-gray-900 font-medium">None</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Certification:</span>
                <span className="text-gray-900 font-medium">Yes</span>
              </div>
            </div>
            <div className="mt-6">
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                Apply Now
              </button>
            </div>
          </motion.div>
        </div>

        {/* Curriculum Modules */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Curriculum Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                <ul className="space-y-2">
                  {module.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-center text-sm text-gray-700">
                      <svg
                        className="h-4 w-4 text-purple-600 mr-2"
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

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Lead the Way?
          </h2>
          <p className="text-sm text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our community of future leaders and take the first step towards becoming a
            transformative leader in Rwanda. Our program is designed to provide you with the
            skills, knowledge, and support you need to make a difference.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-purple-600 text-white py-2 px-6 rounded-lg text-sm hover:bg-purple-700 transition-colors">
              Apply Now
            </button>
            <button className="bg-white text-purple-600 py-2 px-6 rounded-lg text-sm border border-purple-600 hover:bg-purple-50 transition-colors">
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Leadership 