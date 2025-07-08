import { useEffect, useState } from 'react';
import api from '../api/axios';
import { setCache, getCache } from '../api/cacheUtil';

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

interface Lesson {
  _id: string;
  title: string;
  content?: string;
  quizzes?: Quiz[];
}

const QuizComponent = ({ lesson }: { lesson: Lesson }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [score, setScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Use the first quiz in lesson.quizzes, or null if none
    if (lesson && lesson.quizzes && lesson.quizzes.length > 0) {
      setQuiz(lesson.quizzes[0]);
    } else {
      setQuiz(null);
    }
  }, [lesson]);

  const handleChange = (qid: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    // You can implement local scoring or submission logic here if needed
    setSubmitted(true);
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