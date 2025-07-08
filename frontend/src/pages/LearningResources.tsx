import { useState, useEffect } from 'react';
import api from '../api/axios';
import QuizComponent from './QuizComponent';
import AssignmentComponent from './AssignmentComponent';
import Navbar from '../components/Navbar';
import { FaBook, FaCheckCircle, FaRegCircle, FaFileAlt, FaVideo, FaLink, FaQuestionCircle, FaClipboardList, FaArrowLeft } from 'react-icons/fa';

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
  resources?: Array<any>;
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

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    setError('');
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
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
      const res = await api.get(`/courses/${courseId}/modules`);
      setModules(res.data);
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
  };

  const handleExpandModule = (moduleId: string) => {
    setExpandedModuleId(expandedModuleId === moduleId ? null : moduleId);
    setSelectedLesson(null);
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    // Simulate marking as complete
    if (!completedLessons.includes(lesson._id)) {
      setCompletedLessons([...completedLessons, lesson._id]);
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex flex-col mt-16">
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
          </div>
        </div>
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-8 px-4 pb-12">
          {/* Sidebar: Course & Modules */}
          <aside className="w-full md:w-1/3 bg-white rounded-xl shadow-lg p-4 mb-8 md:mb-0">
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
                <option value="business">Business</option>
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
                    {modules.map((mod) => (
                      <li key={mod._id} className="mb-2">
                        <button
                          className={`w-full text-left px-2 py-2 rounded transition font-semibold flex items-center gap-2 ${expandedModuleId === mod._id ? 'bg-blue-50 text-blue-900' : 'hover:bg-blue-50 text-blue-700'}`}
                          onClick={() => handleExpandModule(mod._id)}
                        >
                          <FaBook className="text-blue-400" /> {mod.title}
                          <span className="ml-auto">{expandedModuleId === mod._id ? '▲' : '▼'}</span>
                        </button>
                        {expandedModuleId === mod._id && (
                          <ul className="ml-4 mt-2">
                            {mod.lessons.length === 0 ? (
                              <li className="text-gray-400 italic">No lessons yet.</li>
                            ) : (
                              mod.lessons.map((lesson) => (
                                <li key={lesson._id} className="mb-1">
                                  <button
                                    className={`w-full text-left px-2 py-1 rounded transition flex items-center gap-2 ${selectedLesson?._id === lesson._id ? 'bg-blue-200 text-blue-900' : 'hover:bg-blue-100 text-blue-700'}`}
                                    onClick={() => handleSelectLesson(lesson)}
                                  >
                                    {completedLessons.includes(lesson._id) ? <FaCheckCircle className="text-green-500" /> : <FaRegCircle className="text-gray-400" />}
                                    {lesson.title}
                                  </button>
                                </li>
                              ))
                            )}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </aside>
          {/* Main Content Area */}
          <main className="flex-1 bg-white rounded-xl shadow-lg p-6 min-h-[400px]">
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
                <div className="bg-blue-50 rounded-lg p-6 shadow mb-6">
                  <h2 className="text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2">
                    {completedLessons.includes(selectedLesson._id) ? <FaCheckCircle className="text-green-500" /> : <FaRegCircle className="text-gray-400" />}
                    {selectedLesson.title}
                  </h2>
                  <div className="tiptap mb-4 text-gray-800 text-lg" dangerouslySetInnerHTML={{ __html: selectedLesson.content || '<span class="italic text-gray-400">No content for this lesson.</span>' }} />
                  {/* Resources */}
                  {selectedLesson.resources && selectedLesson.resources.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-blue-700 mb-2">Resources</h3>
                      <ul className="list-disc ml-6">
                        {selectedLesson.resources.map((res: any) => (
                          <li key={res._id} className="mb-1 flex items-center gap-2">
                            {getResourceIcon(res.type)}
                            <a href={res.fileUrl || res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{res.title} ({res.type})</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Quiz */}
                  <div className="mb-6">
                    <QuizComponent lesson={selectedLesson} />
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
