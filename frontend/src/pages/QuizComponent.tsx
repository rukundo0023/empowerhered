import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { setCache } from '../api/cacheUtil';
import type { Lesson, Quiz } from '../types';

const QuizComponent = ({ lesson, onProgressUpdate }: { lesson: Lesson; onProgressUpdate?: () => void }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [score, setScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [attemptInfo, setAttemptInfo] = useState<{
    attemptNumber: number;
    attemptsRemaining: number;
    bestScore: number;
    bestTotal: number;
    bestPercentage: number;
  } | null>(null);

  useEffect(() => {
    if (lesson && lesson.quizzes && lesson.quizzes.length > 0) {
      const quizObj = lesson.quizzes[0];
      setQuiz({
        _id: quizObj._id || lesson._id || 'quiz_' + Date.now(),
        title: quizObj.title || lesson.title || 'Lesson Quiz',
        questions: quizObj.questions || []
      });
    } else {
      setQuiz(null);
    }
  }, [lesson]);

  const handleChange = (qid: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Check if all questions are answered
      const unansweredQuestions = quiz.questions.filter(q => !answers[q._id]);
      if (unansweredQuestions.length > 0) {
        setError(`Please answer all questions. You have ${unansweredQuestions.length} unanswered question(s).`);
        setLoading(false);
        return;
      }

      // Submit quiz to backend
      const response = await api.post(`/quizzes/${quiz._id}/submit`, { 
        answers: quiz.questions.map((q) => ({
          questionId: q._id,
          answer: answers[q._id]
        }))
      });
      
      setScore(response.data.score);
      setAttemptInfo({
        attemptNumber: response.data.attemptNumber,
        attemptsRemaining: response.data.attemptsRemaining,
        bestScore: response.data.bestScore,
        bestTotal: response.data.bestTotal,
        bestPercentage: response.data.bestPercentage
      });
      setSubmitted(true);
      
      // Show success message
      toast.success(response.data.message);
      
      // If course progress was updated, notify parent component and show special notification
      if (response.data.courseProgressUpdated && onProgressUpdate) {
        onProgressUpdate();
        toast.success('🎉 Congratulations! You have completed this course! You can now generate your certificate.');
      }
      
      // Cache the result for offline access
      setCache(`quiz_result_${quiz._id}`, {
        score: response.data.score,
        total: response.data.total,
        submittedAt: new Date().toISOString(),
        attemptInfo: response.data
      });
      
    } catch (error: any) {
      console.error('Quiz submission failed:', error);
      
      // Handle maximum attempts reached
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Maximum attempts')) {
        setError(`Maximum attempts reached. Your best score: ${error.response.data.bestScore}/${error.response.data.bestTotal}`);
        // Show the best score even when max attempts reached
        setScore(error.response.data.bestScore);
        setAttemptInfo({
          attemptNumber: 2,
          attemptsRemaining: 0,
          bestScore: error.response.data.bestScore,
          bestTotal: error.response.data.bestTotal,
          bestPercentage: error.response.data.bestTotal > 0 ? Math.round((error.response.data.bestScore / error.response.data.bestTotal) * 100) : 0
        });
        setSubmitted(true);
      } else {
        setError(error.response?.data?.message || 'Failed to submit quiz. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!quiz) return <div className="text-gray-500 italic">No quiz for this lesson.</div>;
  
  if (submitted) {
    return (
      <div className="quiz-result bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-bold text-green-800 mb-2">Quiz Completed!</h4>
        
        {/* Attempt Information */}
        {attemptInfo && (
          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <div className="flex items-center justify-between">
              <span className="text-yellow-800 font-medium">
                Attempt {attemptInfo.attemptNumber}/2
              </span>
              <span className="text-yellow-700 text-sm">
                {attemptInfo.attemptsRemaining > 0 ? 
                  `${attemptInfo.attemptsRemaining} attempt${attemptInfo.attemptsRemaining > 1 ? 's' : ''} remaining` : 
                  'No attempts remaining'
                }
              </span>
            </div>
          </div>
        )}
        
        {/* Current Score */}
        <div className="text-lg mb-2">
          <span className="font-semibold">Current Score: </span>
          <span className="text-green-600">{score !== null ? score : 'N/A'}</span>
          {quiz.questions && (
            <span className="text-gray-600"> / {quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0)}</span>
          )}
        </div>
        
        {/* Best Score */}
        {attemptInfo && attemptInfo.attemptNumber > 1 && (
          <div className="text-lg mb-2">
            <span className="font-semibold">Best Score: </span>
            <span className="text-blue-600">{attemptInfo.bestScore}</span>
            <span className="text-gray-600"> / {attemptInfo.bestTotal}</span>
            <span className="text-gray-500 text-sm ml-2">({attemptInfo.bestPercentage}%)</span>
          </div>
        )}
        
        <div className="mt-2 text-sm text-gray-600">
          Submitted on: {new Date().toLocaleDateString()}
        </div>
        
        {/* Course Completion */}
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">🎉</span>
            <span className="text-blue-800 font-medium">Course Progress: 100%</span>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            You have completed this course! You can now generate your certificate.
          </p>
        </div>
      </div>
    );
  }

  if (!isQuizOpen) {
    return (
      <div className="quiz-component bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-lg text-blue-800">Lesson Quiz</h4>
            <p className="text-gray-600 text-sm">
              {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''} • 
              {quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0)} total points
            </p>
          </div>
          <button
            onClick={() => setIsQuizOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-component bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-xl text-blue-800">{quiz.title}</h4>
        <button
          onClick={() => {
            setIsQuizOpen(false);
            setAnswers({});
            setError(null);
          }}
          className="text-gray-500 hover:text-red-500 text-lg"
        >
          ×
        </button>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}
      {/* Make the form scrollable if there are many questions */}
      <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="max-h-[60vh] overflow-y-auto pr-2">
        {quiz.questions.map((q, idx) => (
          <div key={q._id} className="mb-6 p-4 border border-gray-100 rounded-lg">
            <div className="mb-3 font-medium text-gray-800">
              <span className="text-blue-600 font-bold">Q{idx + 1}:</span> {q.text}
              {q.points && <span className="ml-2 text-sm text-gray-500">({q.points} point{q.points > 1 ? 's' : ''})</span>}
            </div>
            {q.type === 'MCQ' ? (
              <div className="space-y-2">
                {q.options?.map(opt => (
                  <label key={opt} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name={q._id}
                      value={opt}
                      checked={answers[q._id] === opt}
                      onChange={e => handleChange(q._id, e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <span className="text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            ) : (
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={answers[q._id] || ''}
                onChange={e => handleChange(q._id, e.target.value)}
                placeholder="Enter your answer..."
              />
            )}
          </div>
        ))}
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </form>
    </div>
  );
};

export default QuizComponent; 