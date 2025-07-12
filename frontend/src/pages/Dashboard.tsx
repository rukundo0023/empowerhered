import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Profile from './Profile';
import { FaGraduationCap, FaBook, FaChartLine, FaTrophy, FaClipboardList, FaCheckCircle, FaClock } from 'react-icons/fa';
import api from '../api/axios';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [quizResults, setQuizResults] = useState([]);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses
        const coursesRes = await api.get('/courses');
        setCourses(coursesRes.data);

        // Fetch progress for each course
        const progressData = {};
        for (const course of coursesRes.data) {
          try {
            const progressRes = await api.get(`/courses/${course._id}/lesson-progress`);
            progressData[course._id] = progressRes.data.lessonProgress;
          } catch (error) {
            console.error(`Error fetching progress for course ${course._id}:`, error);
            progressData[course._id] = [];
          }
        }
        setProgress(progressData);

        // Fetch quiz results
        try {
          const quizRes = await api.get('/quizzes/results');
          setQuizResults(quizRes.data.quizResults || []);
        } catch (error) {
          console.error('Error fetching quiz results:', error);
          setQuizResults([]);
        }

        // Fetch assignment submissions
        try {
          const assignmentRes = await api.get('/assignments/submissions');
          setAssignmentSubmissions(assignmentRes.data.submissions || []);
        } catch (error) {
          console.error('Error fetching assignment submissions:', error);
          setAssignmentSubmissions([]);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCourseProgress = (courseId) => {
    const courseProgress = progress[courseId];
    if (!courseProgress || courseProgress.length === 0) return 0;
    const totalLessons = courseProgress.length;
    const completedLessons = courseProgress.filter(lesson => lesson.completed).length;
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  const getTotalLessons = (course) => {
    return course.modules?.reduce((sum, module) => sum + module.lessons.length, 0) || 0;
  };

  const getQuizScore = (quizId) => {
    const result = quizResults.find(qr => qr.quizId === quizId);
    return result ? `${result.score}/${result.total}` : 'Not completed';
  };

  const getAssignmentStatus = (assignmentId) => {
    const submission = assignmentSubmissions.find(sub => sub.assignmentId === assignmentId);
    if (!submission) return { status: 'Not submitted', color: 'text-red-600' };
    if (submission.grade !== undefined) {
      return { 
        status: `Graded: ${submission.grade}%`, 
        color: submission.grade >= 70 ? 'text-green-600' : 'text-yellow-600' 
      };
    }
    return { status: 'Submitted', color: 'text-blue-600' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="mt-2 text-gray-600">Track your learning progress and achievements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Progress */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <FaBook className="text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
              </div>
              {courses.length === 0 ? (
                <p className="text-gray-500">No courses enrolled yet.</p>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                        <span className="text-sm text-gray-500">{course.level}</span>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{getCourseProgress(course._id)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getCourseProgress(course._id)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {course.modules?.length || 0} modules • {getTotalLessons(course)} lessons
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quiz Results */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <FaTrophy className="text-green-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Quiz Results</h2>
              </div>
              {quizResults.length === 0 ? (
                <p className="text-gray-500">No quiz results yet.</p>
              ) : (
                <div className="space-y-3">
                  {quizResults.slice(0, 5).map((result) => (
                    <div key={result._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          {result.quizId?.title || 'Quiz'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Completed on {new Date(result.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          {result.score}/{result.total}
                        </div>
                        <div className="text-sm text-gray-500">
                          {Math.round((result.score / result.total) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                  {quizResults.length > 5 && (
                    <div className="text-center">
                      <button className="text-blue-600 hover:text-blue-700 text-sm">
                        View all {quizResults.length} results
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Assignment Submissions */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <FaClipboardList className="text-orange-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Assignment Submissions</h2>
              </div>
              {assignmentSubmissions.length === 0 ? (
                <p className="text-gray-500">No assignment submissions yet.</p>
              ) : (
                <div className="space-y-3">
                  {assignmentSubmissions.slice(0, 5).map((submission) => (
                    <div key={submission._id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium text-gray-900">
                            {submission.assignmentId?.title || 'Assignment'}
                          </div>
                          <div className="text-sm text-gray-500">
                            Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${getAssignmentStatus(submission.assignmentId).color}`}>
                          {getAssignmentStatus(submission.assignmentId).status}
                        </div>
                      </div>
                      {submission.feedback && (
                        <div className="text-sm text-gray-600 mt-2 p-2 bg-white rounded border">
                          <span className="font-medium">Feedback:</span> {submission.feedback}
                        </div>
                      )}
                    </div>
                  ))}
                  {assignmentSubmissions.length > 5 && (
                    <div className="text-center">
                      <button className="text-blue-600 hover:text-blue-700 text-sm">
                        View all {assignmentSubmissions.length} submissions
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaBook className="text-blue-600 mr-2" />
                    <span className="text-gray-600">Courses</span>
                  </div>
                  <span className="font-semibold">{courses.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaTrophy className="text-green-600 mr-2" />
                    <span className="text-gray-600">Quizzes Taken</span>
                  </div>
                  <span className="font-semibold">{quizResults.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaClipboardList className="text-orange-600 mr-2" />
                    <span className="text-gray-600">Assignments</span>
                  </div>
                  <span className="font-semibold">{assignmentSubmissions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaCheckCircle className="text-green-600 mr-2" />
                    <span className="text-gray-600">Completed</span>
                  </div>
                  <span className="font-semibold">
                    {assignmentSubmissions.filter(sub => sub.grade !== undefined).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[...quizResults, ...assignmentSubmissions]
                  .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="text-gray-900">
                          {item.quizId ? 'Completed quiz' : 'Submitted assignment'}
                        </div>
                        <div className="text-gray-500">
                          {new Date(item.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 