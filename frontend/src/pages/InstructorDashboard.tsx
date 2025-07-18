import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../api/axios";
import QuizBuilder, { QuizQuestion } from '../components/QuizBuilder';
import AssignmentFields, { AssignmentFieldsData } from '../components/AssignmentFields';
import Modal from '../components/Modal'; // Assume a simple Modal component exists or use a div for modal
import { FaPlus, FaEdit, FaTrash, FaClipboardList } from 'react-icons/fa';
import TiptapEditor from '../components/TiptapEditor';

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
  quizzes?: QuizQuestion[];
  assignment?: AssignmentFieldsData;
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

  const [moduleLoading, setModuleLoading] = useState(false);
  const [moduleError, setModuleError] = useState('');

  // Lesson content pagination state
  const [lessonContentPages, setLessonContentPages] = useState<{ [lessonId: string]: number }>({});
  const contentPerPage = 1000; // Characters per page for lesson content
  
  // Add missing state variables for quiz and assignment forms
  const [assignmentFields, setAssignmentFields] = useState<AssignmentFieldsData>({
    instructions: '',
    dueDate: '',
    fileType: '',
    fileUrl: ''
  });

  const [expandedProgress, setExpandedProgress] = useState<string | null>(null);
  const [detailedProgress, setDetailedProgress] = useState<any>({});

  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    if (activeTab === 'progress') {
      fetchProgress(); // Initial fetch
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = setInterval(() => {
        fetchProgress();
      }, 15000); // 15 seconds
    } else {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

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
      const res = await api.get('/progress');
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
    try {
      await api.delete(`/courses/${selectedCourseForModules._id}/modules/${moduleId}`);
      toast.success('Module deleted');
      // If the deleted module was selected, reset selection
      if (selectedModule && selectedModule._id === moduleId) {
        setSelectedModule(null);
      }
      await fetchModules(selectedCourseForModules._id);
    } catch (error) {
      handleApiError(error, 'Error deleting module');
    }
  };

  // Add state for quizzes and assignments per lesson
  const [lessonQuizzes, setLessonQuizzes] = useState<{ [lessonId: string]: any[] }>({});
  const [lessonAssignments, setLessonAssignments] = useState<{ [lessonId: string]: any[] }>({});

  // Fetch quizzes and assignments for a lesson
  const fetchLessonAssessments = async (courseId: string, moduleId: string, lessonId: string) => {
    try {
      const [quizRes, assignmentRes] = await Promise.all([
        api.get(`/quizzes/lesson/${courseId}/${moduleId}/${lessonId}`),
        api.get(`/assignments/lesson/${courseId}/${moduleId}/${lessonId}`)
      ]);
      setLessonQuizzes(prev => ({ ...prev, [lessonId]: quizRes.data }));
      setLessonAssignments(prev => ({ ...prev, [lessonId]: assignmentRes.data }));
    } catch (e) {
      setLessonQuizzes(prev => ({ ...prev, [lessonId]: [] }));
      setLessonAssignments(prev => ({ ...prev, [lessonId]: [] }));
    }
  };

  // When modules are loaded, fetch quizzes/assignments for each lesson
  useEffect(() => {
    if (!modules || !selectedCourseForModules) return;
    modules.forEach(mod => {
      mod.lessons.forEach(lesson => {
        fetchLessonAssessments(selectedCourseForModules._id, mod._id, lesson._id);
      });
    });
    // eslint-disable-next-line
  }, [modules, selectedCourseForModules]);

  // Remove embedded quiz/assignment from lesson creation
  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForModules || !selectedModule) return;
    setModuleLoading(true);
    setModuleError('');
    try {
      const lessonPayload = {
        ...newLesson
      };
      await api.post(`/courses/${selectedCourseForModules._id}/modules/${selectedModule._id}/lessons`, lessonPayload);
      await fetchModules(selectedCourseForModules._id);
      setNewLesson({ title: '', content: '' });
    } catch (error) {
      handleApiError(error, 'Error adding lesson');
    } finally {
      setModuleLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!selectedCourseForModules || !selectedModule) return;
    try {
      await api.delete(`/courses/${selectedCourseForModules._id}/modules/${selectedModule._id}/lessons/${lessonId}`);
      toast.success('Lesson deleted');
      await fetchModules(selectedCourseForModules._id);
    } catch (error) {
      handleApiError(error, 'Error deleting lesson');
    }
  };



  const handleCloseModuleModal = () => {
    setShowModuleModal(false);
    setSelectedModule(null);
    setLessonContentPages({}); // Reset lesson content pagination
  };

  // Lesson content pagination functions
  const getCurrentContentPage = (lessonId: string) => {
    return lessonContentPages[lessonId] || 1;
  };

  const getTotalContentPages = (content: string) => {
    if (!content) return 1;
    const words = content.split(/\s+/);
    const wordsPerPage = Math.floor(contentPerPage / 6); // Approximate 6 characters per word
    return Math.ceil(words.length / wordsPerPage);
  };

  const getContentForPage = (content: string, page: number) => {
    if (!content) return '';
    
    // Split content into words
    const words = content.split(/\s+/);
    const wordsPerPage = Math.floor(contentPerPage / 6); // Approximate 6 characters per word
    const startWordIndex = (page - 1) * wordsPerPage;
    const endWordIndex = startWordIndex + wordsPerPage;
    
    // Get words for this page
    const pageWords = words.slice(startWordIndex, endWordIndex);
    
    // Join words back together, preserving original spacing
    return pageWords.join(' ');
  };

  const handleContentPageChange = (lessonId: string, page: number) => {
    setLessonContentPages(prev => ({
      ...prev,
      [lessonId]: page
    }));
  };

  const handleEditModule = (module: Module) => {
    setSelectedModule(module);
    setNewModule({ title: module.title, description: module.description || '' });
    setShowModuleModal(true);
  };

  // Add handler to delete a quiz from a lesson


  const fetchLessonProgress = async (userId: string, courseId: string) => {
    try {
      const res = await api.get(`/users/${userId}`); // get user to get token if needed
      const progressRes = await api.get(`/courses/${courseId}/lesson-progress`, {
        headers: { Authorization: `Bearer ${res.data.token}` }
      });
      setDetailedProgress((prev: any) => ({ ...prev, [`${userId}-${courseId}`]: progressRes.data.lessonProgress }));
    } catch (e) {
      setDetailedProgress((prev: any) => ({ ...prev, [`${userId}-${courseId}`]: [] }));
    }
  };

  // Add state for quiz/assignment modal buffers
  const [quizModalBuffer, setQuizModalBuffer] = useState<any[]>([]);
  const [assignmentModalBuffer, setAssignmentModalBuffer] = useState<any>({ instructions: '', dueDate: '', fileType: '', fileUrl: '' });
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  // Handlers for opening modals
  const [quizModalLesson, setQuizModalLesson] = useState<Lesson | null>(null);
  const [quizModalModule, setQuizModalModule] = useState<Module | null>(null);
  const [assignmentModalLesson, setAssignmentModalLesson] = useState<Lesson | null>(null);
  const [assignmentModalModule, setAssignmentModalModule] = useState<Module | null>(null);

  function openQuizModal(lesson: Lesson, mod: Module) {
    setQuizModalLesson(lesson);
    setQuizModalModule(mod);
    setQuizModalBuffer([]);
    setShowQuizModal(true);
  }
  function openAssignmentModal(lesson: Lesson, mod: Module) {
    setAssignmentModalLesson(lesson);
    setAssignmentModalModule(mod);
    setAssignmentModalBuffer({ instructions: '', dueDate: '', fileType: '', fileUrl: '' });
    setShowAssignmentModal(true);
  }

  // Add edit/delete functions for quizzes and assignments
  const editQuiz = (quiz: any) => {
    setQuizModalLesson(quizModalLesson);
    setQuizModalModule(quizModalModule);
    setQuizModalBuffer(quiz.questions || []);
    setShowQuizModal(true);
  };

  const deleteQuiz = async (quizId: string) => {
    if (!quizModalLesson || !quizModalModule || !selectedCourseForModules) return;
    try {
      await api.delete(`/quizzes/${quizId}`);
      await fetchLessonAssessments(selectedCourseForModules._id, quizModalModule._id, quizModalLesson._id);
      toast.success('Quiz deleted');
    } catch (error) {
      handleApiError(error, 'Error deleting quiz');
    }
  };

  const editAssignment = (assignment: any) => {
    setAssignmentModalLesson(assignmentModalLesson);
    setAssignmentModalModule(assignmentModalModule);
    setAssignmentModalBuffer({
      instructions: assignment.instructions || '',
      dueDate: assignment.dueDate || '',
      fileType: assignment.fileType || '',
      fileUrl: assignment.fileUrl || ''
    });
    setShowAssignmentModal(true);
  };

  const deleteAssignment = async (assignmentId: string) => {
    if (!assignmentModalLesson || !assignmentModalModule || !selectedCourseForModules) return;
    try {
      await api.delete(`/assignments/${assignmentId}`);
      await fetchLessonAssessments(selectedCourseForModules._id, assignmentModalModule._id, assignmentModalLesson._id);
      toast.success('Assignment deleted');
    } catch (error) {
      handleApiError(error, 'Error deleting assignment');
    }
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
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Accessed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentProgress
                    .filter(progress => {
                      // If you have a users list, filter by role
                      // Otherwise, only show if userName is not 'admin', 'mentor', or 'instructor'
                      // (You may want to adjust this logic if you have access to user roles)
                      // For now, filter by userName as a fallback
                      return !['admin', 'mentor', 'instructor'].some(role => progress.userName.toLowerCase().includes(role));
                    })
                    .map((progress) => (
                    <>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className="text-blue-600 underline"
                            onClick={async () => {
                              setExpandedProgress(expandedProgress === `${progress.userId}-${progress.courseId}` ? null : `${progress.userId}-${progress.courseId}`);
                              if (!detailedProgress[`${progress.userId}-${progress.courseId}`]) {
                                await fetchLessonProgress(progress.userId, progress.courseId);
                              }
                            }}
                          >
                            {expandedProgress === `${progress.userId}-${progress.courseId}` ? 'Hide' : 'View'}
                          </button>
                        </td>
                      </tr>
                      {expandedProgress === `${progress.userId}-${progress.courseId}` && (
                        <tr>
                          <td colSpan={5} className="bg-gray-50 px-6 py-4">
                            <strong>Lesson Progress:</strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {(detailedProgress[`${progress.userId}-${progress.courseId}`] || []).map((mod: any, idx: number) => (
                                <div key={idx}>
                                  <div><b>Module {mod.moduleIndex + 1}:</b> {mod.completedLessons.length} lessons completed</div>
                                  <div>
                                    {[0,1,2,3].map(lessonIdx => (
                                      <span key={lessonIdx} style={{
                                        display: 'inline-block',
                                        width: 24,
                                        height: 24,
                                        margin: 2,
                                        borderRadius: '50%',
                                        background: mod.completedLessons.includes(lessonIdx) ? 'green' : '#ccc',
                                        color: 'white',
                                        textAlign: 'center',
                                        lineHeight: '24px'
                                      }}>{lessonIdx+1}</span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
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
                    <option value="Communication">Communication</option>
                    <option value="Business">Business</option>
                    <option value="Education">Education</option>
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
                      <QuizBuilder questions={[]} onChange={() => {}} />
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
            <ul className="space-y-6">
              {modules.map((mod) => (
                <li key={mod._id} className="bg-white rounded-lg shadow p-4 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-lg font-bold text-blue-800">{mod.title}</span>
                      <span className="ml-2 text-gray-500 text-sm">{mod.description}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700" title="Edit Module" onClick={() => handleEditModule(mod)}><FaEdit /></button>
                      <button className="text-red-500 hover:text-red-700" title="Delete Module" onClick={() => handleDeleteModule(mod._id)}><FaTrash /></button>
                      <button className="text-green-600 hover:text-green-800" title="Add Lesson" onClick={() => setSelectedModule(mod)}><FaPlus /></button>
                    </div>
                  </div>
                  {selectedModule && selectedModule._id === mod._id && (
                    <div className="ml-2">
                      <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2"><FaClipboardList /> Lessons</h4>
                      <ul className="space-y-4">
                        {mod.lessons.map((lesson) => (
                          <li key={lesson._id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-blue-900">{lesson.title}</span>
                              </div>
                              <div className="flex gap-2">
                                <button className="text-red-500 hover:text-red-700" title="Delete Lesson" onClick={() => handleDeleteLesson(lesson._id)}><FaTrash /></button>
                                <button className="text-green-600 hover:text-green-800" title="Add Quiz" onClick={() => openQuizModal(lesson, mod)}><FaPlus /> Quiz</button>
                                <button className="text-orange-600 hover:text-orange-800" title="Add Assignment" onClick={() => openAssignmentModal(lesson, mod)}><FaPlus /> Assignment</button>
                              </div>
                            </div>
                            
                            {/* List quizzes for this lesson */}
                            {lessonQuizzes[lesson._id] && lessonQuizzes[lesson._id].length > 0 && (
                              <div className="mt-2">
                                <h5 className="font-semibold text-blue-700">Quizzes</h5>
                                <ul className="ml-4">
                                  {lessonQuizzes[lesson._id].map((quiz, i) => (
                                    <li key={quiz._id || i} className="bg-blue-50 rounded p-2 border border-blue-100 mb-2">
                                      <div className="flex items-center justify-between">
                                        <div className="font-semibold">{quiz.title} <span className="ml-2 text-xs">({quiz.questions?.length || 0} questions, Passing: {quiz.passingScore}%)</span></div>
                                        <div className="flex gap-2">
                                          <button className="text-blue-500 hover:text-blue-700" title="Edit Quiz" onClick={() => editQuiz(quiz)}><FaEdit /></button>
                                          <button className="text-red-500 hover:text-red-700" title="Delete Quiz" onClick={() => deleteQuiz(quiz._id)}><FaTrash /></button>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {/* List assignments for this lesson */}
                            {lessonAssignments[lesson._id] && lessonAssignments[lesson._id].length > 0 && (
                              <div className="mt-2">
                                <h5 className="font-semibold text-orange-700">Assignments</h5>
                                <ul className="ml-4">
                                  {lessonAssignments[lesson._id].map((assignment, i) => (
                                    <li key={assignment._id || i} className="bg-orange-50 rounded p-2 border border-orange-100 mb-2">
                                      <div className="flex items-center justify-between">
                                        <div className="font-semibold">{assignment.title} <span className="ml-2 text-xs">(Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'N/A'})</span></div>
                                        <div className="flex gap-2">
                                          <button className="text-blue-500 hover:text-blue-700" title="Edit Assignment" onClick={() => editAssignment(assignment)}><FaEdit /></button>
                                          <button className="text-red-500 hover:text-red-700" title="Delete Assignment" onClick={() => deleteAssignment(assignment._id)}><FaTrash /></button>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {/* Lesson Content with Pagination */}
                            {lesson.content && (
                              <div className="mt-4">
                                <div className="prose max-w-none mb-4" 
                                     dangerouslySetInnerHTML={{ 
                                       __html: getContentForPage(lesson.content, getCurrentContentPage(lesson._id)) 
                                     }} />
                                
                                {/* Content Pagination Controls */}
                                {getTotalContentPages(lesson.content) > 1 && (
                                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                    <div className="text-sm text-gray-600">
                                      Page {getCurrentContentPage(lesson._id)} of {getTotalContentPages(lesson.content)}
                                      <span className="ml-2 text-xs">
                                        (~{Math.ceil(lesson.content.split(/\s+/).length / 167)} pages total)
                                      </span>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleContentPageChange(lesson._id, getCurrentContentPage(lesson._id) - 1)}
                                        disabled={getCurrentContentPage(lesson._id) === 1}
                                        className={`px-2 py-1 text-xs rounded ${
                                          getCurrentContentPage(lesson._id) === 1
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                      >
                                        Previous
                                      </button>
                                      <button
                                        onClick={() => handleContentPageChange(lesson._id, getCurrentContentPage(lesson._id) + 1)}
                                        disabled={getCurrentContentPage(lesson._id) === getTotalContentPages(lesson.content)}
                                        className={`px-2 py-1 text-xs rounded ${
                                          getCurrentContentPage(lesson._id) === getTotalContentPages(lesson.content)
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                      >
                                        Next
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                      {/* Add Lesson Form (unchanged) */}
                      <form onSubmit={handleAddLesson} className="flex flex-col gap-2 mt-2 max-h-80 overflow-y-auto pr-2">
                        <input
                          type="text"
                          placeholder="Lesson Title"
                          value={newLesson.title}
                          onChange={e => setNewLesson({ ...newLesson, title: e.target.value })}
                          className="border rounded px-2 py-1"
                          required
                        />
                        <TiptapEditor
                          value={newLesson.content}
                          onChange={(content) => setNewLesson({ ...newLesson, content: content })}
                        />
                        <AssignmentFields value={assignmentFields} onChange={setAssignmentFields} />
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

      {/* Quiz Modal */}
      {showQuizModal && quizModalLesson && quizModalModule && (
        <Modal onClose={() => setShowQuizModal(false)}>
          <h3 className="text-lg font-bold mb-2">Add Quiz for {quizModalLesson.title}</h3>
          <QuizBuilder questions={quizModalBuffer} onChange={setQuizModalBuffer} />
          <div className="flex gap-2 mt-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={async () => {
              if (!quizModalLesson || !quizModalModule || !selectedCourseForModules) return;
              // POST to /api/quizzes
              await api.post('/quizzes', {
                title: 'New Quiz',
                questions: quizModalBuffer,
                course: selectedCourseForModules._id,
                moduleId: quizModalModule._id,
                lessonId: quizModalLesson._id
              });
              await fetchLessonAssessments(selectedCourseForModules._id, quizModalModule._id, quizModalLesson._id);
              setShowQuizModal(false);
              toast.success('Quiz created');
            }}>Save</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setShowQuizModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
      {/* Assignment Modal */}
      {showAssignmentModal && assignmentModalLesson && assignmentModalModule && (
        <Modal onClose={() => setShowAssignmentModal(false)}>
          <h3 className="text-lg font-bold mb-2">Add Assignment for {assignmentModalLesson.title}</h3>
          <AssignmentFields value={assignmentModalBuffer} onChange={setAssignmentModalBuffer} />
          <div className="flex gap-2 mt-4">
            <button className="bg-orange-600 text-white px-4 py-2 rounded" onClick={async () => {
              if (!assignmentModalLesson || !assignmentModalModule || !selectedCourseForModules) return;
              // POST to /api/assignments
              await api.post('/assignments', {
                title: 'New Assignment',
                ...assignmentModalBuffer,
                course: selectedCourseForModules._id,
                moduleId: assignmentModalModule._id,
                lessonId: assignmentModalLesson._id
              });
              await fetchLessonAssessments(selectedCourseForModules._id, assignmentModalModule._id, assignmentModalLesson._id);
              setShowAssignmentModal(false);
              toast.success('Assignment created');
            }}>Save</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setShowAssignmentModal(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
  };
  
  export default InstructorDashboard; 