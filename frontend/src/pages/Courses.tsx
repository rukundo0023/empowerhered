import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import OfflineImage from '../components/OfflineImage';
import offlineService from '../services/offlineService';

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  imageUrl?: string;
  enrolledStudents: string[];
  modules: any[];
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const fetchedCourses = await offlineService.getCourses();
      setCourses(fetchedCourses);
      
      // Check if we're in offline mode
      const status = offlineService.getOfflineStatus();
      setOfflineMode(!status.isOnline);
      
      if (!status.isOnline) {
        toast.info('You are viewing cached courses. Some features may be limited.');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const success = await offlineService.enrollInCourse(courseId);
      
      if (success) {
        toast.success('Successfully enrolled in course!');
        // Refresh courses to update enrollment status
        fetchCourses();
      } else {
        toast.error('Failed to enroll in course');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course');
    }
  };

  const isEnrolled = (courseId: string) => {
    return user?.enrolledCourses?.includes(courseId) || false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Loading courses...
            </h2>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Available Courses
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Explore our comprehensive courses designed to empower women in technology and business
          </p>
          {offlineMode && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800 text-sm">
                📱 Offline Mode - You're viewing cached courses. New enrollments will be synced when you're back online.
              </p>
            </div>
          )}
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
            <p className="text-gray-600">
              {offlineMode 
                ? "No cached courses found. Please connect to the internet to load courses."
                : "Check back later for new courses."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Course Image */}
                <div className="relative h-48 bg-gray-200">
                  <OfflineImage
                    src={course.imageUrl || '/placeholder-course.svg'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    fallbackSrc="/placeholder-course.svg"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                      course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Course Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium">Duration:</span>
                      <span className="ml-2">{course.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium">Category:</span>
                      <span className="ml-2 capitalize">{course.category}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium">Students:</span>
                      <span className="ml-2">{course.enrolledStudents?.length || 0} enrolled</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleEnroll(course._id)}
                    disabled={isEnrolled(course._id) || offlineMode}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                      isEnrolled(course._id)
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : offlineMode
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isEnrolled(course._id) 
                      ? '✓ Enrolled' 
                      : offlineMode 
                      ? 'Enrollment unavailable offline'
                      : 'Enroll Now'
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Offline Status */}
        {offlineMode && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-md">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-blue-800 text-sm">
                Offline Mode - {courses.length} courses available from cache
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses; 