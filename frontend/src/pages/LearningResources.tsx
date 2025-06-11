import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import { toast } from "react-toastify"
import assets from "../assets/assets"

interface Course {
  _id: string
  title: string
  description: string
  duration: string
  level: string
  category: string
  imageUrl: string
  resources?: string[]
}

const LearningResources = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses')
      setCourses(Array.isArray(response.data) ? response.data : [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Failed to load courses')
      setCourses([])
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      toast.error('Please login to enroll in courses')
      return
    }

    try {
      // First try to get the course details
      const courseResponse = await api.get(`/courses/${courseId}`)
      const course = courseResponse.data

      // Check if course has resources
      if (!course.resources || course.resources.length === 0) {
        toast.info('This course has no resources yet. Check back later!')
        return
      }

      // Try to enroll in the course
      try {
        await api.post(`/courses/${courseId}/enroll`)
        toast.success('Successfully enrolled in course!')
      } catch (enrollError: any) {
        // If already enrolled, that's fine - we'll still try to open the resource
        if (!enrollError.response?.data?.message?.includes('Already enrolled')) {
          throw enrollError
        }
        // Don't show a toast for already enrolled - just proceed to open resource
      }

      // Open the first resource
      const firstResource = course.resources[0]
      if (firstResource.type === 'Video' || firstResource.type === 'Document') {
        if (!firstResource.fileUrl) {
          toast.error('Resource URL is not available')
          return
        }
        window.open(firstResource.fileUrl, '_blank')
      } else if (firstResource.type === 'Link') {
        if (!firstResource.url) {
          toast.error('Resource URL is not available')
          return
        }
        window.open(firstResource.url, '_blank')
      }

      // Refresh courses to update enrollment status
      fetchCourses()
    } catch (error: any) {
      console.error('Error:', error)
      // Only show error if it's not the "already enrolled" case
      if (!error.response?.data?.message?.includes('Already enrolled')) {
        toast.error(error.response?.data?.message || 'Failed to process your request')
      }
    }
  }

  const handleViewResource = async (resourceId: string, type: string, url: string) => {
    if (!user) {
      toast.error('Please login to view resources')
      return
    }

    try {
      // Update view count
      await api.post(`/resources/${resourceId}/view`)
      
      // Open the resource in a new tab
      if (type === 'Link') {
        window.open(url, '_blank')
      } else if (['Video', 'Document'].includes(type)) {
        window.open(url, '_blank')
      }
    } catch (error) {
      console.error('Error viewing resource:', error)
      toast.error('Failed to view resource')
    }
  }

  const additionalResources = [
    {
      title: "Practice Exercises",
      description: "Hands-on activities to reinforce your learning of computer skills.",
      icon: "🖱️"
    },
    {
      title: "Step-by-Step Guides",
      description: "Simple tutorials covering each topic with clear instructions.",
      icon: "📘"
    },
    {
      title: "FAQs & Troubleshooting",
      description: "Quick solutions to common beginner problems.",
      icon: "❓"
    },
    {
      title: "Sample Documents",
      description: "Download example Word files and email templates to get started.",
      icon: "📄"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-700/20 to-gray-800/20 pt-28"
        style={{ backgroundImage: `url(${assets.resourcesbg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-black mb-6">
              Learning <span className="text-black">Resources</span>
            </h1>
            <p className="text-xl text-black max-w-3xl mx-auto">
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
              Structured learning paths designed to help you master essential computer skills
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center">
              <p className="text-gray-600">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600">No courses available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-lg"
                >
                  <div className="relative pb-48 mb-4">
                    <img
                      className="absolute h-full w-full object-cover rounded-lg"
                      src={course.imageUrl || 'https://via.placeholder.com/400x300'}
                      alt={course.title}
                    />
                  </div>
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
                    <p className="text-gray-600">
                      <span className="font-semibold">Category:</span> {course.category}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEnroll(course._id)}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Enroll Now
                  </button>
                  {course.resources && course.resources.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Course Resources:</h4>
                      <div className="space-y-2">
                        {course.resources.map((resource: any) => (
                          <button
                            key={resource._id}
                            onClick={() => handleViewResource(resource._id, resource.type, resource.type === 'Link' ? resource.url : resource.fileUrl)}
                            className="w-full text-left px-3 py-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md"
                          >
                            {resource.title} ({resource.type})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
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
            {additionalResources.map((resource, index) => (
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
