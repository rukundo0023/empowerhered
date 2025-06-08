import { motion } from "framer-motion"
import assets from "../assets/assets"

const LearningResources = () => {
  const courses = [
    {
      title: "Web Development Fundamentals",
      level: "Beginner",
      duration: "8 weeks",
      description: "Learn HTML, CSS, and JavaScript basics to build your first website.",
      topics: ["HTML", "CSS", "JavaScript", "Responsive Design"]
    },
    {
      title: "Python Programming",
      level: "Intermediate",
      duration: "10 weeks",
      description: "Master Python programming and data structures for real-world applications.",
      topics: ["Python Basics", "Data Structures", "Algorithms", "OOP"]
    },
    {
      title: "Data Science Essentials",
      level: "Advanced",
      duration: "12 weeks",
      description: "Explore data analysis, visualization, and machine learning concepts.",
      topics: ["Data Analysis", "Statistics", "Machine Learning", "Data Visualization"]
    }
  ]

  const resources = [
    {
      title: "Coding Challenges",
      description: "Practice coding with our curated collection of challenges.",
      icon: "🎯"
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides for various programming concepts.",
      icon: "🎥"
    },
    {
      title: "Documentation",
      description: "Comprehensive guides and documentation for different technologies.",
      icon: "📖"
    },
    {
      title: "Project Ideas",
      description: "Get inspired with project ideas to build your portfolio.",
      icon: "💡"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-700/20 to-gray-800/20 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Learning <span className="text-gray-700">Resources</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access comprehensive learning materials to advance your tech career
            </p>
          </motion.div>
        </div>
      </div>

      {/* Courses Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Courses</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Structured learning paths designed to help you master new skills
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {course.level}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="mb-4">
                  <p className="text-gray-600">
                    <span className="font-semibold">Duration:</span> {course.duration}
                  </p>
                </div>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Topics Covered:</h4>
                  <div className="flex flex-wrap gap-2">
                    {course.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  Enroll Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Additional Resources</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our collection of learning materials and tools
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg text-center"
              >
                <div className="text-4xl mb-4">{resource.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600">{resource.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-700 rounded-2xl p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Start Learning Today</h2>
            <p className="text-gray-100 mb-8 max-w-2xl mx-auto">
              Take the first step towards your tech career with our comprehensive learning resources.
            </p>
            <button className="bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Get Started
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LearningResources 