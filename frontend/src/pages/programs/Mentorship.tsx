import { motion } from "framer-motion"

const Mentorship = () => {
  const modules = [
    {
      title: "One-on-One Mentoring",
      description: "Personalized guidance and support from experienced professionals",
      topics: [
        "Career path planning",
        "Skill development",
        "Professional networking",
        "Work-life balance",
        "Personal growth"
      ]
    },
    {
      title: "Group Mentoring",
      description: "Collaborative learning and peer support in a group setting",
      topics: [
        "Group discussions",
        "Peer learning",
        "Team projects",
        "Shared experiences",
        "Collective problem-solving"
      ]
    },
    {
      title: "Industry Insights",
      description: "Deep dive into specific industries and career paths",
      topics: [
        "Industry trends",
        "Career opportunities",
        "Required skills",
        "Professional development",
        "Industry networking"
      ]
    },
    {
      title: "Leadership Development",
      description: "Building leadership skills and confidence",
      topics: [
        "Decision making",
        "Team management",
        "Communication skills",
        "Strategic thinking",
        "Personal branding"
      ]
    },
    {
      title: "Career Transition",
      description: "Support for career changes and advancement",
      topics: [
        "Resume building",
        "Interview preparation",
        "Salary negotiation",
        "Career pivoting",
        "Professional growth"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Mentorship Program
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Connect with experienced mentors who will guide you through your professional journey
            </p>
          </motion.div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Program Overview</h2>
            <p className="text-lg text-gray-600">
              Our mentorship program pairs you with experienced professionals who provide guidance,
              support, and insights to help you achieve your career goals. Through one-on-one and
              group mentoring sessions, you'll gain valuable knowledge and build a strong professional network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalized Guidance</h3>
              <p className="text-gray-600">
                Get tailored advice and support based on your specific goals and challenges
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Industry Expertise</h3>
              <p className="text-gray-600">
                Learn from mentors with extensive experience in your target industry
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Network Building</h3>
              <p className="text-gray-600">
                Connect with professionals and expand your professional network
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Program Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Duration</h3>
                <p className="text-gray-600">6 months with optional extension</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule</h3>
                <p className="text-gray-600">Bi-weekly one-on-one sessions and monthly group meetings</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
                <p className="text-gray-600">Hybrid (In-person and virtual options available)</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Prerequisites</h3>
                <p className="text-gray-600">Open to all program participants with clear career goals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Modules */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Program Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{module.title}</h3>
                <p className="text-gray-600 mb-4">{module.description}</p>
                <ul className="space-y-2">
                  {module.topics.map((topic) => (
                    <li key={topic} className="flex items-center text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2 text-purple-600"
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
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Find Your Mentor?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join our mentorship program and take the next step in your professional journey
          </p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300">
            Apply Now
          </button>
        </div>
      </section>
    </div>
  )
}

export default Mentorship 