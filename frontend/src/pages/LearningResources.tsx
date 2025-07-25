import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import QuizComponent from './QuizComponent';
import AssignmentComponent from './AssignmentComponent';
import { FaBook, FaCheckCircle, FaRegCircle, FaFileAlt, FaVideo, FaLink, FaQuestionCircle, FaClipboardList, FaArrowLeft, FaTrophy } from 'react-icons/fa';
import { getCache, setCache, CACHE_EXPIRY } from '../api/cacheUtil';
import localforage from 'localforage';
import { useAuth } from '../context/AuthContext';
import { generateCertificate, canGenerateCertificate } from '../api/certificateService';
import type { Lesson as GlobalLesson } from '../types';

interface Lesson extends GlobalLesson {
  resources?: Array<any>;
}

// Utility to cache a file by URL
async function cacheResourceFile(url: string) {
  try {
    const key = `resource_${btoa(url)}`;
    // Check if already cached
    const cached = await localforage.getItem(key);
    if (cached) return;
    const response = await fetch(url);
    if (!response.ok) return;
    const blob = await response.blob();
    await localforage.setItem(key, blob);
  } catch (err) {
    // Ignore errors for now
  }
}

async function getCachedResourceFile(url: string): Promise<Blob | null> {
  try {
    const key = `resource_${btoa(url)}`;
    return await localforage.getItem<Blob>(key);
  } catch {
    return null;
  }
}

interface Module {
  _id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}



interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  imageUrl: string;
}

const LearningResources = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingModules, setLoadingModules] = useState(false);
  const [error, setError] = useState('');
  // Simulated progress (replace with real user progress if available)
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const filteredCourses = courses.filter(course =>
    (categoryFilter === '' || course.category === categoryFilter) &&
    (levelFilter === '' || course.level === levelFilter) &&
    (searchTerm === '' || course.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const [courseProgress, setCourseProgress] = useState<number | null>(null);
  const [canGenerateCert, setCanGenerateCert] = useState(false);
  const [generatingCert, setGeneratingCert] = useState(false);
  const { user } = useAuth();
  
  // Pagination state for lessons (module-specific)
  const [lessonPages, setLessonPages] = useState<{ [moduleId: string]: number }>({});
  const lessonsPerPage = 3; // Show 3 lessons per page to make pagination more visible
  
  // Lesson content pagination state
  const [lessonContentPages, setLessonContentPages] = useState<{ [lessonId: string]: number }>({});
  const contentPerPage = 1500; // Characters per page for lesson content

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    setError('');
    try {
      if (!navigator.onLine) {
        // Offline: load from cache
        const cached = await getCache<Course[]>('courses');
        setCourses(cached || []);
      } else {
        const res = await api.get('/courses');
        setCourses(res.data);
        await setCache('courses', res.data, CACHE_EXPIRY.COURSES);
      }
    } catch (e) {
      setError('Failed to load courses');
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchModules = async (courseId: string) => {
    setLoadingModules(true);
    setError('');
    try {
      if (!navigator.onLine) {
        // Try to load from cache
        const cached = await getCache(`modules_${courseId}`);
        setModules(cached || []);
      } else {
        const res = await api.get(`/courses/${courseId}/modules`);
        setModules(res.data);
        await setCache(`modules_${courseId}`, res.data, CACHE_EXPIRY.DEFAULT);
        // Cache all resource files for each lesson
        for (const mod of res.data) {
          for (const lesson of mod.lessons) {
            if (lesson.resources) {
              for (const resrc of lesson.resources) {
                if (resrc.fileUrl || resrc.url) {
                  await cacheResourceFile(resrc.fileUrl || resrc.url);
                }
              }
            }
          }
        }
      }
    } catch (e) {
      setError('Failed to load modules');
      setModules([]);
    } finally {
      setLoadingModules(false);
    }
  };

  const handleSelectCourse = async (course: Course) => {
    setSelectedCourse(course);
    setSelectedLesson(null);
    setExpandedModuleId(null);
    await fetchModules(course._id);
    // Fetch real user progress
    try {
      const res = await api.get(`/courses/${course._id}/progress`);
      setCourseProgress(res.data.progress ?? 0);
      
      // Check if user can generate certificate
      if (res.data.progress === 100) {
        const certCheck = await canGenerateCertificate(course._id);
        setCanGenerateCert(certCheck.canGenerate);
      } else {
        setCanGenerateCert(false);
      }
    } catch {
      setCourseProgress(null);
      setCanGenerateCert(false);
    }
  };

  const handleExpandModule = (moduleId: string) => {
    setExpandedModuleId(expandedModuleId === moduleId ? null : moduleId);
    setSelectedLesson(null);
  };

  const handleSelectLesson = async (lesson: Lesson, moduleIndex: number, lessonIndex: number) => {
    setSelectedLesson(lesson);
    
    // Reset content pagination for new lesson
    setLessonContentPages(prev => ({
      ...prev,
      [lesson._id]: 1
    }));
    
    // Fetch quizzes and assignments for this lesson
    if (selectedCourse && moduleIndex !== undefined && lessonIndex !== undefined) {
      try {
        // Fetch quizzes
        const quizRes = await api.get(`/quizzes/lesson/${selectedCourse._id}/${modules[moduleIndex]._id}/${lesson._id}`);
        const lessonWithQuizzes = { ...lesson, quizzes: quizRes.data };
        
        // Fetch assignments
        const assignmentRes = await api.get(`/assignments/lesson/${selectedCourse._id}/${modules[moduleIndex]._id}/${lesson._id}`);
        const lessonWithAssessments = { ...lessonWithQuizzes, assignment: assignmentRes.data[0] || null };
        
        setSelectedLesson(lessonWithAssessments);
        
        // Mark as visited in backend
        await api.post(`/courses/${selectedCourse._id}/modules/${moduleIndex}/lessons/${lessonIndex}/visit`);
      } catch (e) {
        console.error('Error fetching lesson assessments:', e);
        // Optionally handle error
      }
    }
    
    // Simulate marking as complete in local state
    if (!completedLessons.includes(lesson._id)) {
      setCompletedLessons([...completedLessons, lesson._id]);
    }
    
    // Cache quiz/assignment data for offline (if present)
    if (lesson.quizzes && lesson.quizzes.length > 0) {
      setCache(`quiz_${lesson._id}`, lesson.quizzes[0], CACHE_EXPIRY.DEFAULT);
    }
    if (lesson.assignment) {
      setCache(`assignment_${lesson._id}`, lesson.assignment, CACHE_EXPIRY.DEFAULT);
    }
  };

  // Breadcrumbs helper
  const getBreadcrumbs = () => {
    const crumbs = [
      { label: 'Home', onClick: () => window.location.href = '/' },
      { label: 'Learning Resources', onClick: null },
    ];
    if (selectedCourse) crumbs.push({ label: selectedCourse.title, onClick: null });
    if (expandedModuleId) {
      const mod = modules.find(m => m._id === expandedModuleId);
      if (mod) crumbs.push({ label: mod.title, onClick: null });
    }
    if (selectedLesson) crumbs.push({ label: selectedLesson.title, onClick: null });
    return crumbs;
  };

  // Helper for resource icon
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'Video': return <FaVideo className="inline mr-1 text-blue-500" />;
      case 'Document': return <FaFileAlt className="inline mr-1 text-green-600" />;
      case 'Link': return <FaLink className="inline mr-1 text-purple-600" />;
      case 'Quiz': return <FaQuestionCircle className="inline mr-1 text-yellow-600" />;
      case 'Assignment': return <FaClipboardList className="inline mr-1 text-pink-600" />;
      default: return <FaBook className="inline mr-1 text-gray-400" />;
    }
  };

  // Pagination functions
  const getCurrentLessons = (lessons: any[], moduleId: string) => {
    const currentPage = lessonPages[moduleId] || 1;
    const startIndex = (currentPage - 1) * lessonsPerPage;
    const endIndex = startIndex + lessonsPerPage;
    return lessons.slice(startIndex, endIndex);
  };

  const totalLessonPages = (lessons: any[]) => {
    return Math.ceil(lessons.length / lessonsPerPage);
  };

  const handleLessonPageChange = (page: number, moduleId: string) => {
    setLessonPages(prev => ({
      ...prev,
      [moduleId]: page
    }));
  };

  const getCurrentPage = (moduleId: string) => {
    return lessonPages[moduleId] || 1;
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

  const handleGenerateCertificate = async () => {
    if (!selectedCourse) return;
    
    try {
      setGeneratingCert(true);
      await generateCertificate(selectedCourse._id);
      toast.success('Certificate generated successfully! You can view it in your Certificates page.');
      setCanGenerateCert(false);
    } catch (error: any) {
      console.error('Error generating certificate:', error);
      toast.error(error.response?.data?.message || 'Failed to generate certificate');
    } finally {
      setGeneratingCert(false);
    }
  };

  const handleProgressUpdate = async () => {
    if (!selectedCourse) return;
    
    try {
      // Refresh course progress
      const res = await api.get(`/courses/${selectedCourse._id}/progress`);
      setCourseProgress(res.data.progress ?? 0);
      
      // Check if user can generate certificate
      if (res.data.progress === 100) {
        const certCheck = await canGenerateCertificate(selectedCourse._id);
        setCanGenerateCert(certCheck.canGenerate);
      } else {
        setCanGenerateCert(false);
      }
    } catch (error) {
      console.error('Error refreshing progress:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col">
        <div className="bg-gradient-to-r from-blue-100 to-blue-300 py-10 mb-8 shadow">
          <div className="max-w-5xl mx-auto px-4">
            <button
              onClick={() => window.history.back()}
              className="mb-4 flex items-center text-blue-700 hover:text-blue-900 focus:outline-none"
              aria-label="Go back"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
            <h1 className="text-4xl font-bold text-blue-900 mb-2">Learning Resources</h1>
            <p className="text-lg text-blue-800">Browse courses, explore modules, and master lessons with quizzes and assignments.</p>
            {/* Progress Bar */}
            {selectedCourse && courseProgress !== null && user && !['admin', 'mentor', 'instructor'].includes(user.role) && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-900 font-semibold">Progress:</span>
                  <span className="text-blue-700">{courseProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${courseProgress}%` }}
                  ></div>
                </div>
                
                {/* Certificate Generation Button */}
                {courseProgress === 100 && canGenerateCert && (
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={handleGenerateCertificate}
                      disabled={generatingCert}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                    >
                      <FaTrophy className="text-sm" />
                      {generatingCert ? 'Generating...' : 'Generate Certificate'}
                    </button>
                    <span className="text-sm text-blue-800">
                      🎉 Congratulations! You've completed this course!
                    </span>
                  </div>
                )}
                
                {courseProgress === 100 && !canGenerateCert && (
                  <div className="mt-4 flex items-center gap-2">
                    <FaTrophy className="text-yellow-500" />
                    <span className="text-sm text-blue-800">
                      Certificate already generated! View it in your Certificates page.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-4 lg:gap-8 px-2 sm:px-4 pb-12">
          {/* Sidebar: Course & Modules */}
          <aside className="w-full lg:w-1/3 bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-6 lg:mb-0">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 flex items-center"><FaBook className="mr-2" />Courses</h2>
            {/* Filter UI */}
            <div className="mb-4 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Search by title"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="border rounded px-2 py-1"
              />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">All Categories</option>
                <option value="tech">Tech</option>
                <option value="communication">Communication</option>
                <option value="personal-development">Personal Development</option>
                <option value="leadership">Leadership</option>
              </select>
              <select
                value={levelFilter}
                onChange={e => setLevelFilter(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            {/* End Filter UI */}
            {loadingCourses ? (
              <div className="text-blue-600 animate-pulse">Loading courses...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <ul>
                {filteredCourses.map((course) => (
                  <li key={course._id} className="mb-2">
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg font-medium flex items-center gap-2 transition ${selectedCourse?._id === course._id ? 'bg-blue-100 text-blue-900' : 'hover:bg-blue-50 text-blue-700'}`}
                      onClick={() => handleSelectCourse(course)}
                    >
                      <FaBook className="text-blue-400" /> {course.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {selectedCourse && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center"><FaBook className="mr-2" />Modules</h3>
                {loadingModules ? (
                  <div className="text-blue-600 animate-pulse">Loading modules...</div>
                ) : modules.length === 0 ? (
                  <div className="text-gray-500">No modules yet.</div>
                ) : (
                  <ul>
                    {modules.map((mod, moduleIdx) => (
                      <li key={mod._id} className="mb-2">
                        <button
                          className={`w-full text-left px-2 py-2 rounded transition font-semibold flex items-center gap-2 ${expandedModuleId === mod._id ? 'bg-blue-50 text-blue-900' : 'hover:bg-blue-50 text-blue-700'}`}
                          onClick={() => handleExpandModule(mod._id)}
                        >
                          <FaBook className="text-blue-400" /> {mod.title}
                          <span className="ml-auto">{expandedModuleId === mod._id ? '▲' : '▼'}</span>
                        </button>
                        {expandedModuleId === mod._id && (
                          <div>
                            {mod.lessons.length === 0 ? (
                              <ul className="ml-4 mt-2">
                                <li className="text-gray-400 italic">No lessons yet.</li>
                              </ul>
                            ) : (
                              <>
                                <ul className="ml-4 mt-2">
                                  {getCurrentLessons(mod.lessons, mod._id).map((lesson, lessonIdx) => {
                                    const currentPage = getCurrentPage(mod._id);
                                    const actualIndex = (currentPage - 1) * lessonsPerPage + lessonIdx;
                                    return (
                                      <li key={lesson._id} className="mb-1">
                                        <button
                                          className={`w-full text-left px-2 py-1 rounded transition flex items-center gap-2 ${selectedLesson?._id === lesson._id ? 'bg-blue-200 text-blue-900' : 'hover:bg-blue-100 text-blue-700'}`}
                                          onClick={() => handleSelectLesson(lesson, moduleIdx, actualIndex)}
                                        >
                                          {completedLessons.includes(lesson._id) ? <FaCheckCircle className="text-green-500" /> : <FaRegCircle className="text-gray-400" />}
                                          {lesson.title}
                                        </button>
                                      </li>
                                    );
                                  })}
                                </ul>
                                {/* Pagination Controls */}
                                <div className="ml-4 mt-3 flex items-center justify-between">
                                  <div className="text-sm text-gray-600">
                                    Showing {getCurrentLessons(mod.lessons, mod._id).length} of {mod.lessons.length} lessons
                                    {totalLessonPages(mod.lessons) > 1 && (
                                      <span> - Page {getCurrentPage(mod._id)} of {totalLessonPages(mod.lessons)}</span>
                                    )}
                                  </div>
                                  {totalLessonPages(mod.lessons) > 1 && (
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => handleLessonPageChange(getCurrentPage(mod._id) - 1, mod._id)}
                                        disabled={getCurrentPage(mod._id) === 1}
                                        className={`px-2 py-1 text-xs rounded ${
                                          getCurrentPage(mod._id) === 1
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        }`}
                                      >
                                        Previous
                                      </button>
                                      <button
                                        onClick={() => handleLessonPageChange(getCurrentPage(mod._id) + 1, mod._id)}
                                        disabled={getCurrentPage(mod._id) === totalLessonPages(mod.lessons)}
                                        className={`px-2 py-1 text-xs rounded ${
                                          getCurrentPage(mod._id) === totalLessonPages(mod.lessons)
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        }`}
                                      >
                                        Next
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </aside>
          {/* Main Content Area */}
          <main className="flex-1 bg-white rounded-xl shadow-lg p-3 sm:p-6 min-h-[400px]">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm text-blue-700 flex flex-wrap gap-2 items-center">
              {getBreadcrumbs().map((crumb, idx, arr) => (
                <span key={idx} className="flex items-center">
                  {crumb.onClick ? (
                    <button onClick={crumb.onClick} className="hover:underline text-blue-700">{crumb.label}</button>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                  {idx < arr.length - 1 && <span className="mx-2">/</span>}
                </span>
              ))}
            </nav>
            {/* Main Content */}
            {!selectedCourse ? (
              <div className="text-gray-600 text-lg">Select a course to begin.</div>
            ) : !expandedModuleId ? (
              <div className="text-gray-600 text-lg">Select a module to view its lessons.</div>
            ) : !selectedLesson ? (
              <div className="text-gray-600 text-lg">Select a lesson to view details.</div>
            ) : (
              <div className="animate-fade-in">
                <div className="bg-blue-50 rounded-lg p-3 sm:p-6 shadow mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2">
                    {completedLessons.includes(selectedLesson._id) ? <FaCheckCircle className="text-green-500" /> : <FaRegCircle className="text-gray-400" />}
                    {selectedLesson.title}
                  </h2>
                  {/* Lesson Content with Pagination */}
                  <div className="mb-4">
                    <div className="tiptap text-gray-800 text-base sm:text-lg" 
                         dangerouslySetInnerHTML={{ 
                           __html: getContentForPage(selectedLesson.content || '', getCurrentContentPage(selectedLesson._id)) || 
                           '<span class="italic text-gray-400">No content for this lesson.</span>' 
                         }} />
                    
                    {/* Content Pagination Controls */}
                    {selectedLesson.content && getTotalContentPages(selectedLesson.content) > 1 && (
                      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mt-4">
                        <div className="text-sm text-gray-600">
                          Page {getCurrentContentPage(selectedLesson._id)} of {getTotalContentPages(selectedLesson.content)}
                          <span className="ml-2 text-xs">
                            (~{Math.ceil((selectedLesson.content?.split(/\s+/).length || 0) / 250)} pages total)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleContentPageChange(selectedLesson._id, getCurrentContentPage(selectedLesson._id) - 1)}
                            disabled={getCurrentContentPage(selectedLesson._id) === 1}
                            className={`px-4 py-2 text-sm rounded-lg font-medium transition ${
                              getCurrentContentPage(selectedLesson._id) === 1
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                          >
                            ← Previous
                          </button>
                          <button
                            onClick={() => handleContentPageChange(selectedLesson._id, getCurrentContentPage(selectedLesson._id) + 1)}
                            disabled={getCurrentContentPage(selectedLesson._id) === getTotalContentPages(selectedLesson.content)}
                            className={`px-4 py-2 text-sm rounded-lg font-medium transition ${
                              getCurrentContentPage(selectedLesson._id) === getTotalContentPages(selectedLesson.content)
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                          >
                            Next →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Resources */}
                  {selectedLesson.resources && selectedLesson.resources.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-blue-700 mb-2">Resources</h3>
                      <ul className="list-disc ml-6">
                        {selectedLesson.resources.map((res: any) => (
                          <li key={res._id} className="mb-1 flex items-center gap-2">
                            {getResourceIcon(res.type)}
                            {res.fileUrl || res.url ? (
                              navigator.onLine ? (
                                <a href={res.fileUrl || res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{res.title} ({res.type})</a>
                              ) : (
                                // Offline: try to serve cached file
                                <OfflineResourceLink url={res.fileUrl || res.url} title={res.title} type={res.type} />
                              )
                            ) : (
                              <span>{res.title} ({res.type})</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Quiz */}
                  <div className="mb-6">
                                            <QuizComponent lesson={selectedLesson} onProgressUpdate={handleProgressUpdate} />
                  </div>
                  {/* Assignment */}
                  <div className="mb-6">
                    <AssignmentComponent lesson={selectedLesson} />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default LearningResources;

function OfflineResourceLink({ url, title, type }: { url: string, title: string, type: string }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  useEffect(() => {
    getCachedResourceFile(url).then(blob => {
      if (blob) {
        setBlobUrl(URL.createObjectURL(blob));
      }
    });
  }, [url]);
  if (blobUrl) {
    return <a href={blobUrl} download={title} className="text-blue-600 underline">{title} ({type})</a>;
  }
  return <span className="text-gray-400">{title} ({type}) - Not available offline</span>;
}
