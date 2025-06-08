import { motion } from "framer-motion"

const Workshops = () => {
  const workshops = [
    {
      title: "Tech Skills Workshop",
      description: "Hands-on training in essential technical skills",
      topics: [
        "Web Development Basics",
        "Data Analysis Fundamentals",
        "Digital Marketing Tools",
        "Project Management Software",
        "Cloud Computing Basics"
      ]
    },
    {
      title: "Career Development Workshop",
      description: "Tools and strategies for career advancement",
      topics: [
        "Resume Writing",
        "Interview Preparation",
        "Personal Branding",
        "Networking Skills",
        "Career Planning"
      ]
    },
    {
      title: "Leadership Workshop",
      description: "Developing essential leadership skills",
      topics: [
        "Team Management",
        "Communication Skills",
        "Decision Making",
        "Conflict Resolution",
        "Strategic Planning"
      ]
    },
    {
      title: "Entrepreneurship Workshop",
      description: "Building and growing your business",
      topics: [
        "Business Planning",
        "Market Research",
        "Financial Management",
        "Marketing Strategy",
        "Pitch Development"
      ]
    },
    {
      title: "Digital Skills Workshop",
      description: "Mastering essential digital tools and platforms",
      topics: [
        "Social Media Management",
        "Content Creation",
        "Digital Analytics",
        "Online Collaboration",
        "Cybersecurity Basics"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Interactive Workshops
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Hands-on learning experiences designed to develop practical skills and knowledge
            </p>
          </motion.div>
        </div>
      </div>

      {/* Program Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Workshop Overview</h2>
            <p className="text-lg text-gray-600">
              Our workshops provide practical, hands-on learning experiences led by industry experts.
              Each workshop is designed to help you develop specific skills and knowledge that you can
              immediately apply in your career or business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Practical Learning</h3>
              <p className="text-gray-600">
                Hands-on activities and real-world projects to apply your knowledge
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Instructors</h3>
              <p className="text-gray-600">
                Learn from industry professionals with extensive experience
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Small Groups</h3>
              <p className="text-gray-600">
                Interactive sessions with personalized attention and feedback
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workshop Details */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Workshop Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Duration</h3>
                <p className="text-gray-600">2-4 hours per workshop</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule</h3>
                <p className="text-gray-600">Weekly workshops with flexible timing options</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
                <p className="text-gray-600">Hybrid (In-person and virtual options available)</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Prerequisites</h3>
                <p className="text-gray-600">Open to all program participants</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Modules */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Available Workshops</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workshops.map((workshop, index) => (
              <motion.div
                key={workshop.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{workshop.title}</h3>
                <p className="text-gray-600 mb-4">{workshop.description}</p>
                <ul className="space-y-2">
                  {workshop.topics.map((topic) => (
                    <li key={topic} className="flex items-center text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-700"
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
      <section className="py-16 bg-gray-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Learn?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join our workshops and develop the skills you need to succeed
          </p>
          <button className="bg-white text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300">
            Register Now
          </button>
        </div>
      </section>
    </div>
  )
}

export default Workshops 