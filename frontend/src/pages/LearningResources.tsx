import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import { toast } from "react-toastify"
import assets from "../assets/assets"
import { useTranslation } from 'react-i18next'

interface Course {
  _id: string
  title: string
  description: string
  duration: string
  level: string
  category: string
  imageUrl: string
  resources?: Array<{
    type: string
    fileUrl?: string
    url?: string
  }>
}

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

const LearningResources = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { t } = useTranslation()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses')
      setCourses(Array.isArray(response.data) ? response.data : [])
      setLoading(false)
    } catch (error: unknown) {
      const apiError = error as ApiError
      console.error('Error fetching courses:', apiError)
      toast.error(apiError.response?.data?.message || 'Failed to load courses')
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
      } catch (enrollError: unknown) {
        const error = enrollError as ApiError
        // If already enrolled, that's fine - we'll still try to open the resource
        if (!error.response?.data?.message?.includes('Already enrolled')) {
          throw error
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
    } catch (error: unknown) {
      const apiError = error as ApiError
      console.error('Error:', apiError)
      // Only show error if it's not the "already enrolled" case
      if (!apiError.response?.data?.message?.includes('Already enrolled')) {
        toast.error(apiError.response?.data?.message || 'Failed to process your request')
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
              {t('learningResources.hero.title')}
            </h1>
            <p className="text-xl text-black max-w-3xl mx-auto">
              {t('learningResources.hero.description')}
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('learningResources.courses.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('learningResources.courses.description')}
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center">
              <p className="text-gray-600">{t('learningResources.courses.loading')}</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600">{t('learningResources.courses.noCourses')}</p>
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
                      <span className="font-semibold">{t('learningResources.courses.duration')}:</span> {course.duration}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">{t('learningResources.courses.category')}:</span> {course.category}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEnroll(course._id)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('learningResources.courses.enroll')}
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('learningResources.additionalResources.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('learningResources.additionalResources.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* Tools & Software */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('learningResources.additionalResources.sections.tools.title')}</h3>
              <p className="text-gray-600 mb-4">{t('learningResources.additionalResources.sections.tools.description')}</p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>• Operating System (Windows/Linux)</li>
                <li>• File Explorer</li>
                <li>• Device Manager</li>
                <li>• Task Manager</li>
              </ul>
            </motion.div>

            {/* Career Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('learningResources.additionalResources.sections.career.title')}</h3>
              <p className="text-gray-600 mb-4">{t('learningResources.additionalResources.sections.career.description')}</p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>• Resume Writing Guides</li>
                <li>• Interview Preparation</li>
                <li>• Career Development</li>
                <li>• Networking Tips</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('learningResources.cta.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              {t('learningResources.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                {t('learningResources.cta.primaryButton')}
              </button>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors">
                {t('learningResources.cta.secondaryButton')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LearningResources
