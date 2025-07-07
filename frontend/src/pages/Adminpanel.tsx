import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../api/axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  gender: string;
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  imageUrl: string;
  enrolledStudents: number;
}

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: 'Video' | 'Document' | 'Link' | 'Quiz' | 'Assignment';  // enum types
  category: 'Technology' | 'Communication' | 'Business' | 'Education' | 'Other'; // enum types
  url?: string;      // optional, required only if type === 'Link'
  fileUrl?: string;  // optional, required if type is Document or Video
  courseId: string;  // references course ObjectId
  createdBy: string; // references user ObjectId
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

type Tab = 'users' | 'courses' | 'resources' | 'progress';

const Adminpanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    gender: 'other',
  });

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
});

const [showModuleModal, setShowModuleModal] = useState(false);
const [selectedCourseForModules, setSelectedCourseForModules] = useState<Course | null>(null);
const [modules, setModules] = useState<Module[]>([]);
const [newModule, setNewModule] = useState({ title: '', description: '' });
const [selectedModule, setSelectedModule] = useState<Module | null>(null);
const [newLesson, setNewLesson] = useState({ title: '', content: '', quizzes: [], assignment: { instructions: '', dueDate: '', fileType: '', fileUrl: '' } });
const [quizQuestion, setQuizQuestion] = useState({ question: '', options: ['', '', '', ''], answer: '', fileType: '', fileUrl: '' });
const [quizList, setQuizList] = useState([]);

const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
const [editModule, setEditModule] = useState({ title: '', description: '' });
const [editLesson, setEditLesson] = useState({ title: '', content: '' });
const [moduleLoading, setModuleLoading] = useState(false);
const [lessonLoading, setLessonLoading] = useState(false);
const [moduleError, setModuleError] = useState('');
const [lessonError, setLessonError] = useState('');

  // Handle type change
  const handleTypeChange = (type: string) => {
    setNewResource(prev => ({
      ...prev,
      type,
      // Reset fileUrl and url when type changes
      fileUrl: ['Video', 'Document'].includes(type) ? prev.fileUrl : '',
      url: type === 'Link' ? prev.url : ''
    }));
  };

  // Handle fileUrl change

  // Handle URL change

  // Helper to handle API errors
  const handleApiError = (error: unknown, fallback = 'Something went wrong') => {
    if (error && typeof error === 'object' && 'response' in error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || fallback);
    } else {
      toast.error(fallback);
    }
  };

  // Gender and mentor stats
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [mentorCount, setMentorCount] = useState(0);
  const [maleMentorProgress, setMaleMentorProgress] = useState<{ [userId: string]: number }>({});

  // Calculate gender and mentor stats when users change
  useEffect(() => {
    let males = 0, females = 0, mentors = 0;
    let maleMentorProgressObj: { [userId: string]: number } = {};
    users.forEach(u => {
      if (u.gender === 'male') males++;
      if (u.gender === 'female') females++;
      if (u.role === 'mentor') mentors++;
    });
    setMaleCount(males);
    setFemaleCount(females);
    setMentorCount(mentors);
    // Track progress for male users (mentors)
    studentProgress.forEach(sp => {
      const user = users.find(u => u._id === sp.userId);
      if (user && user.gender === 'male') {
        if (!maleMentorProgressObj[user._id] || sp.progress > maleMentorProgressObj[user._id]) {
          maleMentorProgressObj[user._id] = sp.progress;
        }
      }
    });
    setMaleMentorProgress(maleMentorProgressObj);
  }, [users, studentProgress]);

  // Notification for male user reaching 20%
  useEffect(() => {
    Object.entries(maleMentorProgress).forEach(([userId, progress]) => {
      if (progress >= 20) {
        const user = users.find(u => u._id === userId);
        if (user && user.gender === 'male') {
          toast.info(`Notification: Male user ${user.name} has reached 20% progress!`);
        }
      }
    });
  }, [maleMentorProgress, users]);

  useEffect(() => {
    const initializeData = async () => {
      if (!user || !user.token) {
        console.log('No user or token found');
        return;
      }

      if (isInitialized) {
        console.log('Already initialized');
        return;
      }

      console.log('Initializing admin panel with user:', { email: user.email, role: user.role });
      
      try {
        setIsLoading(true);
        await Promise.all([
          fetchData(),
          fetchCourses()
        ]);
        setIsInitialized(true);
        console.log('Admin panel initialized successfully');
      } catch (error) {
        console.error('Initialization error:', error);
        handleApiError(error, 'Error initializing admin panel');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'users': {
          const res = await api.get('/users');
          setUsers(Array.isArray(res.data) ? res.data : []);
          break;
        }
        case 'courses': {
          const res = await api.get('/courses');
          setCourses(Array.isArray(res.data) ? res.data : []);
          break;
        }
        case 'resources': {
          const res = await api.get('/resources');
          setResources(Array.isArray(res.data) ? res.data : []);
          break;
        }
        case 'progress': {
          const res = await api.get('/courses/progress');
          setStudentProgress(Array.isArray(res.data) ? res.data : []);
          break;
        }
        default:
          break;
      }
    } catch (error: unknown) {
      console.error('Fetch error:', error);
      handleApiError(error, 'Error fetching data');
      if (activeTab === 'users') setUsers([]);
      if (activeTab === 'resources') setResources([]);
      if (activeTab === 'progress') setStudentProgress([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users', newUser);
      toast.success('User added');
      setShowUserModal(false);
      fetchData();
    } catch (error: unknown) {
      handleApiError(error, 'Add user failed');
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/courses', newCourse);
      toast.success('Course added');
      setShowCourseModal(false);
      fetchData();
    } catch (error: unknown) {
      handleApiError(error, 'Add course failed');
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Error fetching courses');
    }
  };

  const handleShowResourceModal = async () => {
    await fetchCourses();
    setShowResourceModal(true);
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    
    // Validate required fields
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
        title: newResource.title.trim(),
        description: newResource.description.trim(),
        type: newResource.type,
        category: newResource.category.trim(),
        courseId: newResource.courseId,
        fileUrl: newResource.fileUrl?.trim(),
        url: newResource.url?.trim(),
        createdBy: user?._id
      };

      console.log('Submitting resource data:', resourceData);

      const response = await api.post('/resources', resourceData);
      console.log('Server response:', response.data);
      
      setResources(prev => [...prev, response.data]);
      setNewResource({
        title: '',
        description: '',
        type: 'Video',
        category: 'Technology',
        url: '',
        fileUrl: '',
        courseId: '',
      });
      setError('');
      setShowResourceModal(false);
      toast.success('Resource added successfully');
    } catch (err: any) {
      console.error('Error adding resource:', err);
      setError(err.response?.data?.message || 'Error adding resource');
      toast.error(err.response?.data?.message || 'Error adding resource');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('User deleted');
        fetchData();
      } catch (error: unknown) {
        handleApiError(error, 'Delete failed');
      }
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (window.confirm('Delete this course?')) {
      try {
        await api.delete(`/courses/${id}`);
        toast.success('Course deleted');
        fetchData();
      } catch (error: unknown) {
        handleApiError(error, 'Delete failed');
      }
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (window.confirm('Delete this resource?')) {
      try {
        await api.delete(`/resources/${id}`);
        toast.success('Resource deleted');
        fetchData();
      } catch (error: unknown) {
        handleApiError(error, 'Delete failed');
      }
    }
  };

  const fetchModules = async (courseId: string) => {
    try {
      const res = await api.get(`/courses/${courseId}`);
      setModules(res.data.modules || []);
    } catch (e) {
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
    try {
      await api.post(`/courses/${selectedCourseForModules._id}/modules`, newModule);
      await fetchModules(selectedCourseForModules._id);
      setNewModule({ title: '', description: '' });
      toast.success('Module added successfully');
    } catch (error) {
      toast.error('Failed to add module');
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
    const lessonPayload = {
      ...newLesson,
      quizzes: quizList,
      assignment: newLesson.assignment,
    };
    await api.post(`/courses/${selectedCourseForModules._id}/modules/${selectedModule._id}/lessons`, lessonPayload);
    await fetchModules(selectedCourseForModules._id);
    setNewLesson({ title: '', content: '', quizzes: [], assignment: { instructions: '', dueDate: '', fileType: '', fileUrl: '' } });
    setQuizList([]);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!selectedCourseForModules || !selectedModule) return;
    await api.delete(`/courses/${selectedCourseForModules._id}/modules/${selectedModule._id}/lessons/${lessonId}`);
    await fetchModules(selectedCourseForModules._id);
  };

  const handleEditModule = (mod: Module) => {
    setEditingModuleId(mod._id);
    setEditModule({ title: mod.title, description: mod.description || '' });
  };
  const handleSaveModule = async (mod: Module) => {
    setModuleLoading(true);
    setModuleError('');
    try {
      await api.put(`/courses/${selectedCourseForModules?._id}/modules/${mod._id}`, editModule);
      await fetchModules(selectedCourseForModules!._id);
      setEditingModuleId(null);
      toast.success('Module updated');
    } catch (e) {
      setModuleError('Failed to update module');
      toast.error('Failed to update module');
    } finally {
      setModuleLoading(false);
    }
  };
  const handleEditLesson = (lesson: Lesson) => {
    setEditingLessonId(lesson._id);
    setEditLesson({ title: lesson.title, content: lesson.content || '' });
  };
  const handleSaveLesson = async (lesson: Lesson) => {
    setLessonLoading(true);
    setLessonError('');
    try {
      await api.put(`/courses/${selectedCourseForModules?._id}/modules/${selectedModule?._id}/lessons/${lesson._id}`, editLesson);
      await fetchModules(selectedCourseForModules!._id);
      setEditingLessonId(null);
      toast.success('Lesson updated');
    } catch (e) {
      setLessonError('Failed to update lesson');
      toast.error('Failed to update lesson');
    } finally {
      setLessonLoading(false);
    }
  };
  const handleCloseModuleModal = () => {
    setShowModuleModal(false);
    setSelectedCourseForModules(null);
    setModules([]);
    setSelectedModule(null);
    setEditingModuleId(null);
    setEditingLessonId(null);
    setEditModule({ title: '', description: '' });
    setEditLesson({ title: '', content: '' });
    setModuleError('');
    setLessonError('');
  };

  if (!user || user.role !== 'admin') {
    console.log('Not an admin user:', user);
    return null;
  }

  if (isLoading && !isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 mt-6">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowUserModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add User
              </button>
              <button
                onClick={() => setShowCourseModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Course
              </button>
              <button
                onClick={handleShowResourceModal}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                Add Resource
              </button>
            </div>
          </div>

          {/* Gender and Mentor Stats */}
          <div className="flex flex-wrap gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4 flex-1 min-w-[180px]">
              <div className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                Women
              </div>
              <div className="text-2xl font-bold text-pink-600">{femaleCount}</div>
            </div>
            <div className={`bg-white rounded-lg shadow p-4 flex-1 min-w-[180px] ${maleCount / (maleCount + femaleCount) >= 0.2 ? 'border-2 border-red-500' : ''}`}> 
              <div className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                Men
                <span className="text-xs text-gray-500">({((maleCount / (maleCount + femaleCount)) * 100).toFixed(1)}% of users)</span>
                {maleCount / (maleCount + femaleCount) >= 0.2 && <span title="20% limit reached" className="text-red-500 ml-1">&#9888;</span>}
              </div>
              <div className={`text-2xl font-bold ${maleCount / (maleCount + femaleCount) >= 0.2 ? 'text-red-600' : 'text-blue-600'}`}>{maleCount}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex-1 min-w-[180px]">
              <div className="text-lg font-semibold text-gray-700">Mentors</div>
              <div className="text-2xl font-bold text-green-600">{mentorCount}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('users')}
                className={`${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`${
                  activeTab === 'courses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Courses
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`${
                  activeTab === 'resources'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Resources
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`${
                  activeTab === 'progress'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Student Progress
              </button>
            </nav>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {activeTab === 'users' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'courses' && (
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
                          <td className="px-6 py-4 whitespace-nowrap  ">{course.level}</td>
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
              )}

              {activeTab === 'resources' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
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
                          <td className="px-6 py-4 whitespace-nowrap">{resource.courseId?.title || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{resource.createdBy?.name || 'N/A'}</td>
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteResource(resource._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'progress' && (
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
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
              <form onSubmit={handleAddUser} className="mt-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                  <select
                    value={newUser.gender}
                    onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
  <select
    value={newCourse.category}
    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    required
  >
                    <option value="">Select category</option>
                    <option value="tech">Technology</option>
                    <option value="business">Communication</option>
                    <option value="personal-development">Personal Development</option>
                    <option value="leadership">Leadership</option>
  </select>
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
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
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
              {error && (
                <div className="mt-2 text-sm text-red-600">
                  {error}
                </div>
              )}
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
                    onChange={(e) => handleTypeChange(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="Video">Video</option>
              <option value="Document">Document</option>
              <option value="Link">Link</option>
              <option value="Quiz">Quiz</option>
              <option value="Assignment">Assignment</option>
            </select>
          </div>

                {['Video', 'Document'].includes(newResource.type) && (
          <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      File URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={newResource.fileUrl || ''}
                      onChange={(e) => setNewResource({ ...newResource, fileUrl: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
                      placeholder={`Enter ${newResource.type.toLowerCase()} file URL`}
                    />
          </div>
                )}

          {newResource.type === 'Link' && (
            <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      URL <span className="text-red-500">*</span>
                    </label>
              <input
                type="url"
                      value={newResource.url}
                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                      placeholder="Enter URL"
              />
            </div>
          )}

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
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <select
              value={newResource.courseId}
              onChange={(e) => setNewResource({ ...newResource, courseId: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
                  >
                    <option value="">Select a course</option>
                    {courses && courses.length > 0 ? (
                      courses.map(course => (
                        <option key={course._id} value={course._id}>
                          {course.title}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No courses available</option>
                    )}
                  </select>
                  {!newResource.courseId && (
                    <p className="text-sm text-red-500 mt-1">Please select a course</p>
                  )}
                </div>

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
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                  >
                    Add Resource
                  </button>
                </div>
              </form>
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
                    {editingModuleId === mod._id ? (
                      <>
                        <input
                          type="text"
                          value={editModule.title}
                          onChange={e => setEditModule({ ...editModule, title: e.target.value })}
                          className="border rounded px-2 py-1 mr-2"
                        />
                        <input
                          type="text"
                          value={editModule.description}
                          onChange={e => setEditModule({ ...editModule, description: e.target.value })}
                          className="border rounded px-2 py-1 mr-2"
                        />
                        <button className="text-green-600 mr-2" onClick={() => handleSaveModule(mod)}>Save</button>
                        <button className="text-gray-500" onClick={() => setEditingModuleId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <span className="font-semibold">{mod.title}</span>
                        <button className="text-blue-500 ml-2" onClick={() => handleEditModule(mod)}>Edit</button>
                        <button className="text-red-500 ml-2" onClick={() => {
                          if(window.confirm('Delete this module?')) handleDeleteModule(mod._id);
                        }}>Delete</button>
                        <button className="text-blue-500 ml-2" onClick={() => setSelectedModule(mod)}>Manage Lessons</button>
                      </>
                    )}
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
                          <input
                            type="text"
                            placeholder="Question"
                            value={quizQuestion.question}
                            onChange={e => setQuizQuestion({ ...quizQuestion, question: e.target.value })}
                            className="border rounded px-2 py-1 mb-1 w-full"
                          />
                          <div className="flex gap-1 mb-1">
                            {quizQuestion.options.map((opt, idx) => (
                              <input
                                key={idx}
                                type="text"
                                placeholder={`Option ${idx + 1}`}
                                value={opt}
                                onChange={e => {
                                  const newOpts = [...quizQuestion.options];
                                  newOpts[idx] = e.target.value;
                                  setQuizQuestion({ ...quizQuestion, options: newOpts });
                                }}
                                className="border rounded px-2 py-1 flex-1"
                              />
                            ))}
                          </div>
                          <input
                            type="text"
                            placeholder="Correct Answer"
                            value={quizQuestion.answer}
                            onChange={e => setQuizQuestion({ ...quizQuestion, answer: e.target.value })}
                            className="border rounded px-2 py-1 mb-1 w-full"
                          />
                          <input
                            type="text"
                            placeholder="File Type (e.g. image/png, application/pdf)"
                            value={quizQuestion.fileType}
                            onChange={e => setQuizQuestion({ ...quizQuestion, fileType: e.target.value })}
                            className="border rounded px-2 py-1 mb-1 w-full"
                          />
                          <input
                            type="text"
                            placeholder="File URL (optional)"
                            value={quizQuestion.fileUrl}
                            onChange={e => setQuizQuestion({ ...quizQuestion, fileUrl: e.target.value })}
                            className="border rounded px-2 py-1 mb-1 w-full"
                          />
                          <button type="button" className="bg-blue-500 text-white px-2 py-1 rounded mb-2" onClick={() => {
                            if (quizQuestion.question && quizQuestion.answer && quizQuestion.options.every(opt => opt)) {
                              setQuizList([...quizList, quizQuestion]);
                              setQuizQuestion({ question: '', options: ['', '', '', ''], answer: '', fileType: '', fileUrl: '' });
                            }
                          }}>Add Question</button>
                          <ul className="list-disc ml-5">
                            {quizList.map((q, i) => (
                              <li key={i}>{q.question} (Answer: {q.answer}) {q.fileUrl && (<span>- <a href={q.fileUrl} target='_blank' rel='noopener noreferrer'>File</a></span>)}</li>
                            ))}
                          </ul>
                        </div>
                        {/* Assignment Section */}
                        <div className="bg-gray-50 p-2 rounded mb-2">
                          <label className="block font-semibold mb-1">Assignment (optional)</label>
                          <input
                            type="text"
                            placeholder="Assignment Instructions"
                            value={newLesson.assignment.instructions}
                            onChange={e => setNewLesson({ ...newLesson, assignment: { ...newLesson.assignment, instructions: e.target.value } })}
                            className="border rounded px-2 py-1 mb-1 w-full"
                          />
                          <input
                            type="date"
                            placeholder="Due Date"
                            value={newLesson.assignment.dueDate}
                            onChange={e => setNewLesson({ ...newLesson, assignment: { ...newLesson.assignment, dueDate: e.target.value } })}
                            className="border rounded px-2 py-1 mb-1 w-full"
                          />
                          <input
                            type="text"
                            placeholder="File Type (e.g. application/pdf)"
                            value={newLesson.assignment.fileType}
                            onChange={e => setNewLesson({ ...newLesson, assignment: { ...newLesson.assignment, fileType: e.target.value } })}
                            className="border rounded px-2 py-1 mb-1 w-full"
                          />
                          <input
                            type="text"
                            placeholder="File URL (optional)"
                            value={newLesson.assignment.fileUrl}
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

export default Adminpanel;
