import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Profile from './Profile';
import { FaGraduationCap, FaBook, FaChartLine, FaTrophy, FaClipboardList, FaCheckCircle, FaClock } from 'react-icons/fa';
import api from '../api/axios';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [quizResults, setQuizResults] = useState([]);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses
        const coursesRes = await api.get('/courses');
        setCourses(coursesRes.data);

        // Fetch user profile (for courseProgress)
        const userRes = await api.get('/users/me');
        setUserProfile(userRes.data);
        console.log('Fetched user profile:', userRes.data);
        console.log('Course progress from user profile:', userRes.data.courseProgress);

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

  // Use courseProgress from userProfile
  const getCourseProgress = (courseId: string) => {
    console.log('getCourseProgress called for courseId:', courseId);
    console.log('userProfile:', userProfile);
    console.log('userProfile.courseProgress:', userProfile?.courseProgress);
    
    if (!userProfile || !userProfile.courseProgress) {
      console.log('No userProfile or courseProgress, returning 0');
      return 0;
    }
    
    const cp = userProfile.courseProgress.find((p: any) => {
      console.log('Checking progress entry:', p);
      // p.courseId can be an object or string
      if (typeof p.courseId === 'string') {
        const match = p.courseId === courseId;
        console.log('String comparison:', p.courseId, '===', courseId, '=', match);
        return match;
      }
      if (typeof p.courseId === 'object' && p.courseId._id) {
        const match = p.courseId._id === courseId;
        console.log('Object comparison:', p.courseId._id, '===', courseId, '=', match);
        return match;
      }
      return false;
    });
    
    console.log('Found course progress:', cp);
    const result = cp ? cp.progress : 0;
    console.log('Returning progress:', result);
    return result;
  };

  const getTotalLessons = (course: any) => {
    return course.modules?.reduce((sum: number, module: any) => sum + module.lessons.length, 0) || 0;
  };

  const getQuizScore = (quizId: string) => {
    const result = quizResults.find((qr: any) => qr.quizId === quizId);
    return result ? `${result.score}/${result.total}` : 'Not completed';
  };

  const getAssignmentStatus = (assignmentId: string) => {
    const submission = assignmentSubmissions.find((sub: any) => sub.assignmentId === assignmentId);
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
                  {courses.map((course: any) => {
                    const progress = getCourseProgress(course._id);
                    console.log(`Course: ${course.title} (${course._id}) - Progress: ${progress}%`);
                    return (
                      <div key={course._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{course.title}</h3>
                          <span className="text-sm text-gray-500">{course.level}</span>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.modules?.length || 0} modules • {getTotalLessons(course)} lessons
                        </div>
                      </div>
                    );
                  })}
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
                  {quizResults.slice(0, 5).map((result: any) => (
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
                  {assignmentSubmissions.slice(0, 5).map((submission: any) => (
                    <div key={submission._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          {submission.assignmentId?.title || 'Assignment'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">
                          {submission.grade !== undefined ? `${submission.grade}%` : 'Ungraded'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {submission.feedback || ''}
                        </div>
                      </div>
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

          {/* Profile Sidebar */}
          <div>
            <Profile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 