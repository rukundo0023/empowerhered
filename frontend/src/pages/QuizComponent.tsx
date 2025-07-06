import { useEffect, useState } from 'react';
import api from '../api/axios';

interface Question {
  _id: string;
  type: 'MCQ' | 'ShortAnswer';
  text: string;
  options?: string[];
}

interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
}

const QuizComponent = ({ lessonId }: { lessonId: string }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [score, setScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // Assume API: /api/quizzes?lesson=lessonId
        const res = await api.get(`/quizzes?lesson=${lessonId}`);
        setQuiz(res.data);
      } catch (e) {
        setQuiz(null);
      }
    };
    fetchQuiz();
  }, [lessonId]);

  const handleChange = (qid: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    try {
      const res = await api.post(`/quizzes/${quiz._id}/submit`, { answers: quiz.questions.map(q => answers[q._id] || '') });
      setScore(res.data.score);
      setSubmitted(true);
    } catch (e) {
      setScore(null);
      setSubmitted(true);
    }
  };

  if (!quiz) return <div>No quiz for this lesson.</div>;
  if (submitted)
    return <div>Your score: {score !== null ? score : 'N/A'}</div>;

  return (
    <div className="quiz-component">
      <h4 className="font-bold mb-2">{quiz.title}</h4>
      <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        {quiz.questions.map((q, idx) => (
          <div key={q._id} className="mb-4">
            <div className="mb-1">{idx + 1}. {q.text}</div>
            {q.type === 'MCQ' ? (
              <div>
                {q.options?.map(opt => (
                  <label key={opt} className="block">
                    <input
                      type="radio"
                      name={q._id}
                      value={opt}
                      checked={answers[q._id] === opt}
                      onChange={e => handleChange(q._id, e.target.value)}
                    /> {opt}
                  </label>
                ))}
              </div>
            ) : (
              <input
                type="text"
                className="border rounded px-2 py-1"
                value={answers[q._id] || ''}
                onChange={e => handleChange(q._id, e.target.value)}
              />
            )}
          </div>
        ))}
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit Quiz</button>
      </form>
    </div>
  );
};

export default QuizComponent; 