import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../api/axios";

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  imageUrl?: string;
  enrolledStudents: number;
}

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: 'Video' | 'Document' | 'Link' | 'Quiz' | 'Assignment';
  category: string;
  url?: string;
  fileUrl?: string;
  courseId: string;
  createdBy: string;
  downloads?: number;
  views?: number;
  createdAt: string;
  updatedAt?: string;
}

interface StudentProgress {
  userId: string;
  userName: string;
  courseId: string;
  courseName: string;
  progress: number;
  lastAccessed: string;
}

interface Submission {
  _id: string;
  studentName: string;
  answer: string;
  grade?: number;
  feedback?: string;
}

interface Module {
  _id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

interface Lesson {
  _id: string;
  title: string;
  content?: string;
}

type Tab = 'courses' | 'resources' | 'progress';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [grading, setGrading] = useState<{ [submissionId: string]: { grade: string; feedback: string } }>({});

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    duration: '',
    level: 'beginner',
    category: 'Technology',
  });
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'Video',
    category: 'Technology',
    url: '',
    fileUrl: '',
    courseId: '',
    dueDate: '',
  });

  const [error, setError] = useState('');

  const [showModuleModal, setShowModuleModal] = useState(false);
  const [selectedCourseForModules, setSelectedCourseForModules] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [newModule, setNewModule] = useState({ title: '', description: '' });
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [newLesson, setNewLesson] = useState({ title: '', content: '' });

  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editLesson, setEditLesson] = useState({ title: '', content: '' });
  const [moduleLoading, setModuleLoading] = useState(false);
  const [moduleError, setModuleError] = useState('');
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonError, setLessonError] = useState('');

  const handleApiError = (error: unknown, fallback = 'Something went wrong') => {
    if (error && typeof error === 'object' && 'response' in error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || fallback);
    } else {
      toast.error(fallback);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      if (!user || !user.token) return;
      if (isInitialized) return;
      try {
        await Promise.all([
          fetchCourses(),
          fetchResources(),
          fetchProgress()
        ]);
        setIsInitialized(true);
      } catch (error) {
        handleApiError(error, 'Error initializing dashboard');
      }
    };
    initializeData();
  }, [user]);

  // Fetch only instructor's own courses
  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses?createdBy=' + user?._id);
      setCourses(res.data);
    } catch (error) {
      handleApiError(error, 'Failed to fetch courses');
    }
  };

  // Fetch only instructor's own resources
  const fetchResources = async () => {
    try {
      const res = await api.get('/resources?createdBy=' + user?._id);
      setResources(res.data);
    } catch (error) {
      handleApiError(error, 'Failed to fetch resources');
    }
  };

  // Fetch progress for instructor's courses
  const fetchProgress = async () => {
    try {
      const res = await api.get('/progress?instructorId=' + user?._id);
      setStudentProgress(res.data);
    } catch (error) {
      handleApiError(error, 'Failed to fetch progress');
    }
  };

  // Add Course
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/courses', { ...newCourse, createdBy: user?._id });
      toast.success('Course added');
      setShowCourseModal(false);
      fetchCourses();
    } catch (error) {
      handleApiError(error, 'Add course failed');
    }
  };

  // Add Resource
  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newResource.title?.trim()) {
      setError('Title is required');
      return;
    }
    if (!newResource.description?.trim()) {
      setError('Description is required');
      return;
    }
    if (!newResource.category?.trim()) {
      setError('Category is required');
      return;
    }
    if (!newResource.courseId) {
      setError('Please select a course');
      return;
    }
    if (['Video', 'Document'].includes(newResource.type) && !newResource.fileUrl?.trim()) {
      setError(`File URL is required for ${newResource.type} type`);
      return;
    }
    if (newResource.type === 'Link' && !newResource.url?.trim()) {
      setError('URL is required for Link type');
      return;
    }
    try {
      const resourceData = {
        ...newResource,
        createdBy: user?._id
      };
      await api.post('/resources', resourceData);
      setShowResourceModal(false);
      setNewResource({
        title: '',
        description: '',
        type: 'Video',
        category: 'Technology',
        url: '',
        fileUrl: '',
        courseId: '',
        dueDate: '',
      });
      fetchResources();
      toast.success('Resource added successfully');
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'response' in err) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        setError(errorObj.response?.data?.message || 'Error adding resource');
        toast.error(errorObj.response?.data?.message || 'Error adding resource');
      } else {
        setError('Error adding resource');
        toast.error('Error adding resource');
      }
    }
  };

  // Delete Course
  const handleDeleteCourse = async (id: string) => {
    if (window.confirm('Delete this course?')) {
      try {
        await api.delete(`/courses/${id}`);
        toast.success('Course deleted');
        fetchCourses();
      } catch (error) {
        handleApiError(error, 'Delete failed');
      }
    }
  };

  // Delete Resource
  const handleDeleteResource = async (id: string) => {
    if (window.confirm('Delete this resource?')) {
      try {
        await api.delete(`/resources/${id}`);
        toast.success('Resource deleted');
        fetchResources();
      } catch (error) {
        handleApiError(error, 'Delete failed');
      }
    }
  };

  const fetchModules = async (courseId: string) => {
    try {
      const res = await api.get(`/courses/${courseId}`);
      setModules(res.data.modules || []);
    } catch {
      setModules([]);
    }
  };

  const handleShowModuleModal = async (course: Course) => {
    setSelectedCourseForModules(course);
    await fetchModules(course._id);
    setShowModuleModal(true);
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForModules) return;
    setModuleLoading(true);
    setModuleError('');
    try {
      await api.post(`/courses/${selectedCourseForModules._id}/modules`, newModule);
      await fetchModules(selectedCourseForModules._id);
      setNewModule({ title: '', description: '' });
    } catch (error) {
      handleApiError(error, 'Error adding module');
    } finally {
      setModuleLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!selectedCourseForModules) return;
    await api.delete(`/courses/${selectedCourseForModules._id}/modules/${moduleId}`);
    await fetchModules(selectedCourseForModules._id);
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForModules || !selectedModule) return;
    setLessonLoading(true);
    setLessonError('');
    try {
      await api.post(`/courses/${selectedCourseForModules._id}/modules/${selectedModule._id}/lessons`, newLesson);
      await fetchModules(selectedCourseForModules._id);
      setNewLesson({ title: '', content: '' });
    } catch (error) {
      handleApiError(error, 'Error adding lesson');
    } finally {
      setLessonLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!selectedCourseForModules || !selectedModule) return;
    await api.delete(`/courses/${selectedCourseForModules._id}/modules/${selectedModule._id}/lessons/${lessonId}`);
    await fetchModules(selectedCourseForModules._id);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLessonId(lesson._id);
    setEditLesson({ title: lesson.title, content: lesson.content || '' });
  };

  const handleSaveLesson = async (lesson: Lesson) => {
    if (!selectedCourseForModules || !selectedModule) return;
    setLessonLoading(true);
    setLessonError('');
    try {
      await api.put(`/courses/${selectedCourseForModules._id}/modules/${selectedModule._id}/lessons/${lesson._id}`, editLesson);
      await fetchModules(selectedCourseForModules._id);
      setEditingLessonId(null);
    } catch (error) {
      handleApiError(error, 'Error saving lesson');
    } finally {
      setLessonLoading(false);
    }
  };

  const handleCloseModuleModal = () => {
    setShowModuleModal(false);
    setSelectedModule(null);
    setEditingLessonId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 mt-6">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold mb-6 text-center">Instructor Dashboard</h1>
          <div className="flex justify-center mb-6">
            <button className={`px-4 py-2 mx-2 rounded ${activeTab === 'courses' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('courses')}>Courses</button>
            <button className={`px-4 py-2 mx-2 rounded ${activeTab === 'resources' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('resources')}>Resources</button>
            <button className={`px-4 py-2 mx-2 rounded ${activeTab === 'progress' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('progress')}>Progress</button>
          </div>

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="mb-8">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowCourseModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Add Course
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map((course) => (
                      <tr key={course._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{course.title}</td>
                        <td className="px-6 py-4">{course.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{course.duration}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{course.level}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{course.enrolledStudents}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="text-red-600 hover:text-red-900 mr-2"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleShowModuleModal(course)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Manage Modules
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="mb-8">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowResourceModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                  Add Resource
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resources.map((resource) => (
                      <tr key={resource._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{resource.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{resource.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{resource.courseId || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {resource.type === 'Link' ? (
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Link
                            </a>
                          ) : ['Video', 'Document'].includes(resource.type) ? (
                            <a 
                              href={resource.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {resource.type === 'Video' ? 'Watch Video' : 'View Document'}
                          </a>
                          ) : (
                            <span className="text-gray-500">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4">{resource.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right flex items-center gap-3 justify-end">
                          {['Quiz', 'Assignment'].includes(resource.type) && (
                            <button
                              onClick={() => {
                                setSelectedResource(resource);
                                setSubmissions([
                                  { _id: '1', studentName: 'Alice', answer: 'Answer 1', grade: 90, feedback: 'Good job!' },
                                  { _id: '2', studentName: 'Bob', answer: 'Answer 2' },
                                ]);
                                setShowSubmissionsModal(true);
                              }}
                              className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition flex items-center justify-center"
                              title="View Submissions"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteResource(resource._id)}
                            className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition flex items-center justify-center"
                            title="Delete Resource"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="mb-8">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Accessed</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studentProgress.map((progress) => (
                      <tr key={`${progress.userId}-${progress.courseId}`}>
                        <td className="px-6 py-4 whitespace-nowrap">{progress.userName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{progress.courseName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${progress.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">{progress.progress}%</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(progress.lastAccessed).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">Add New Course</h3>
              <form onSubmit={handleAddCourse} className="mt-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Duration</label>
                  <input
                    type="text"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Level</label>
                  <select
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                  <input
                    type="text"
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCourseModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {showResourceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">Add New Resource</h3>
              <form onSubmit={handleAddResource} className="mt-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                  <input
                    type="text"
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                  <textarea
                    value={newResource.description}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="Video">Video</option>
                    <option value="Document">Document</option>
                    <option value="Link">Link</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Assignment">Assignment</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                  <select
                    value={newResource.category}
                    onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Communication</option>
                    <option value="Health">Personal Development</option>
                    <option value="Education">Leadership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Course</label>
                  <select
                    value={newResource.courseId}
                    onChange={(e) => setNewResource({ ...newResource, courseId: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                  </select>
                </div>
                {['Video', 'Document'].includes(newResource.type) && (
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">File URL</label>
                    <input
                      type="text"
                      value={newResource.fileUrl}
                      onChange={(e) => setNewResource({ ...newResource, fileUrl: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                )}
                {newResource.type === 'Link' && (
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">URL</label>
                    <input
                      type="text"
                      value={newResource.url}
                      onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                )}
                {['Quiz', 'Assignment'].includes(newResource.type) && (
                  <div className="mb-4">
                    {newResource.type === 'Quiz' ? (
                      <QuizBuilder />
                    ) : (
                      <>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Due Date</label>
                        <input
                          type="date"
                          value={newResource.dueDate || ''}
                          onChange={e => setNewResource({ ...newResource, dueDate: e.target.value })}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </>
                    )}
                  </div>
                )}
                {error && <div className="text-red-600 mb-2">{error}</div>}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowResourceModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add Resource
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {showSubmissionsModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="relative w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-0 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-blue-50">
              <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3" /></svg>
                Submissions for: <span className="ml-1 text-blue-700">{selectedResource.title}</span>
              </h3>
              <button
                onClick={() => setShowSubmissionsModal(false)}
                className="text-gray-500 hover:text-red-500 p-2 rounded-full transition"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Answer</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Grade</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Feedback</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {submissions.map((sub, idx) => (
                    <tr key={sub._id} className={idx % 2 === 0 ? 'bg-blue-50' : ''}>
                      <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {sub.studentName}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{sub.answer}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={grading[sub._id]?.grade || sub.grade || ''}
                          onChange={e => setGrading(g => ({ ...g, [sub._id]: { ...g[sub._id], grade: e.target.value } }))}
                          className="w-20 border border-blue-200 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                        />
                        {Number(grading[sub._id]?.grade ?? sub.grade ?? 0) >= 90 && <span className="ml-2 text-green-600 font-bold">A+</span>}
                        {Number(grading[sub._id]?.grade ?? sub.grade ?? 0) < 60 && <span className="ml-2 text-red-500 font-bold">F</span>}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={grading[sub._id]?.feedback || sub.feedback || ''}
                          onChange={e => setGrading(g => ({ ...g, [sub._id]: { ...g[sub._id], feedback: e.target.value } }))}
                          className="w-40 border border-blue-200 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          className="bg-blue-600 text-white px-4 py-1.5 rounded shadow hover:bg-blue-700 transition"
                          onClick={() => {
                            toast.success('Grade saved (mock)');
                          }}
                        >
                          <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Module Modal */}
      {showModuleModal && selectedCourseForModules && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-2 right-2 text-gray-500" onClick={handleCloseModuleModal}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Manage Modules for {selectedCourseForModules.title}</h2>
            {moduleLoading && <div className="mb-2 text-blue-600">Saving...</div>}
            {moduleError && <div className="mb-2 text-red-600">{moduleError}</div>}
            {/* List Modules */}
            <ul className="mb-4">
              {modules.map((mod) => (
                <li key={mod._id} className="mb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{mod.title}</span>
                    <button className="text-red-500 ml-2" onClick={() => handleDeleteModule(mod._id)}>Delete</button>
                    <button className="text-blue-500 ml-2" onClick={() => setSelectedModule(mod)}>Manage Lessons</button>
                  </div>
                  <div className="text-sm text-gray-600">{mod.description}</div>
                  {/* List Lessons if this module is selected */}
                  {selectedModule && selectedModule._id === mod._id && (
                    <div className="mt-2 ml-4 max-h-60 overflow-y-auto pr-2">
                      <h4 className="font-semibold mb-2">Lessons</h4>
                      {lessonLoading && <div className="mb-2 text-blue-600">Saving...</div>}
                      {lessonError && <div className="mb-2 text-red-600">{lessonError}</div>}
                      <ul>
                        {mod.lessons.map((lesson) => (
                          <li key={lesson._id} className="flex items-center justify-between mb-1">
                            {editingLessonId === lesson._id ? (
                              <>
                                <input
                                  type="text"
                                  value={editLesson.title}
                                  onChange={e => setEditLesson({ ...editLesson, title: e.target.value })}
                                  className="border rounded px-2 py-1 mr-2"
                                />
                                <input
                                  type="text"
                                  value={editLesson.content}
                                  onChange={e => setEditLesson({ ...editLesson, content: e.target.value })}
                                  className="border rounded px-2 py-1 mr-2"
                                />
                                <button className="text-green-600 mr-2" onClick={() => handleSaveLesson(lesson)}>Save</button>
                                <button className="text-gray-500" onClick={() => setEditingLessonId(null)}>Cancel</button>
                              </>
                            ) : (
                              <>
                                <span>{lesson.title}</span>
                                <button className="text-blue-500 ml-2" onClick={() => handleEditLesson(lesson)}>Edit</button>
                                <button className="text-red-500 ml-2" onClick={() => handleDeleteLesson(lesson._id)}>Delete</button>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                      {/* Add Lesson Form (with quiz and assignment options) */}
                      <form onSubmit={handleAddLesson} className="flex flex-col gap-2 mt-2 max-h-80 overflow-y-auto pr-2">
                        <input
                          type="text"
                          placeholder="Lesson Title"
                          value={newLesson.title}
                          onChange={e => setNewLesson({ ...newLesson, title: e.target.value })}
                          className="border rounded px-2 py-1"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Lesson Content"
                          value={newLesson.content}
                          onChange={e => setNewLesson({ ...newLesson, content: e.target.value })}
                          className="border rounded px-2 py-1"
                        />
                        {/* Quiz Section */}
                        <div className="bg-gray-50 p-2 rounded mb-2">
                          <label className="block font-semibold mb-1">Quiz (optional)</label>
                          {/* Render quiz options here, e.g. quizList.map(...) and add option to add more */}
                          {/* ...existing quiz UI... */}
                        </div>
                        {/* Assignment Section */}
                        <div className="bg-gray-50 p-2 rounded mb-2">
                          <label className="block font-semibold mb-1">Assignment (optional)</label>
                          <input
                            type="text"
                            placeholder="Assignment Instructions"
                            value={newLesson.assignment?.instructions || ''}
                            onChange={e => setNewLesson({ ...newLesson, assignment: { ...newLesson.assignment, instructions: e.target.value } })}
                            className="border rounded px-2 py-1 mb-1 w-full"
                          />
                          <input
                            type="date"
                            placeholder="Due Date"
                            value={newLesson.assignment?.dueDate || ''}
                            onChange={e => setNewLesson({ ...newLesson, assignment: { ...newLesson.assignment, dueDate: e.target.value } })}
                            className="border rounded px-2 py-1 mb-1 w-full"
                          />
                          <input
                            type="text"
                            placeholder="File Type (e.g. application/pdf)"
                            value={newLesson.assignment?.fileType || ''}
                            onChange={e => setNewLesson({ ...newLesson, assignment: { ...newLesson.assignment, fileType: e.target.value } })}
                            className="border rounded px-2 py-1 mb-1 w-full"
                          />
                          <input
                            type="text"
                            placeholder="File URL (optional)"
                            value={newLesson.assignment?.fileUrl || ''}
                            onChange={e => setNewLesson({ ...newLesson, assignment: { ...newLesson.assignment, fileUrl: e.target.value } })}
                            className="border rounded px-2 py-1 mb-1 w-full"
                          />
                        </div>
                        <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded mt-2">Add Lesson</button>
                      </form>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {/* Add Module Form */}
            <form onSubmit={handleAddModule} className="flex gap-2">
              <input
                type="text"
                placeholder="Module Title"
                value={newModule.title}
                onChange={e => setNewModule({ ...newModule, title: e.target.value })}
                className="border rounded px-2 py-1"
                required
              />
              <input
                type="text"
                placeholder="Module Description"
                value={newModule.description}
                onChange={e => setNewModule({ ...newModule, description: e.target.value })}
                className="border rounded px-2 py-1"
              />
              <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Add Module</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function QuizBuilder() {
  const [questions, setQuestions] = useState<{
    question: string;
    options: string[];
    correct: number;
  }[]>([
    { question: '', options: ['', '', '', ''], correct: 0 }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correct: 0 }]);
  };

  const updateQuestion = (idx: number, field: string, value: string) => {
    setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const updateOption = (qIdx: number, optIdx: number, value: string) => {
    setQuestions(qs => qs.map((q, i) => i === qIdx ? { ...q, options: q.options.map((o, oi) => oi === optIdx ? value : o) } : q));
  };

  const setCorrect = (qIdx: number, optIdx: number) => {
    setQuestions(qs => qs.map((q, i) => i === qIdx ? { ...q, correct: optIdx } : q));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
          <span>Quiz Builder</span>
          <span className="text-xs text-gray-400">(Add questions, options, and select the correct answer)</span>
        </h4>
        <button
          type="button"
          onClick={addQuestion}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          + Add Question
        </button>
      </div>
      {questions.map((q, qIdx) => (
        <div key={qIdx} className="bg-white rounded-lg shadow p-4 mb-4 border border-blue-100">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-medium text-blue-600">Q{qIdx + 1}:</span>
            <input
              type="text"
              value={q.question}
              onChange={e => updateQuestion(qIdx, 'question', e.target.value)}
              placeholder="Enter question text"
              className="flex-1 border-b-2 border-blue-200 focus:border-blue-500 outline-none px-2 py-1 text-gray-800 bg-blue-50 rounded"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {q.options.map((opt, optIdx) => (
              <div key={optIdx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${qIdx}`}
                  checked={q.correct === optIdx}
                  onChange={() => setCorrect(qIdx, optIdx)}
                  className="accent-blue-600"
                />
                <input
                  type="text"
                  value={opt}
                  onChange={e => updateOption(qIdx, optIdx, e.target.value)}
                  placeholder={`Option ${optIdx + 1}`}
                  className="flex-1 border-b border-blue-100 focus:border-blue-500 outline-none px-2 py-1 text-gray-700 bg-blue-50 rounded"
                />
                {q.correct === optIdx && (
                  <span className="text-green-600 text-xs font-semibold ml-1">Correct</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default InstructorDashboard; 