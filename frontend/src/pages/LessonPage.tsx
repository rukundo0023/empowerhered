import React, { useEffect, useState } from 'react';
import QuizGame from '../components/QuizGame';
import axios from '../api/axios';

const LessonPage = ({ lessonId }) => {
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    axios.get(`/api/lessons/${lessonId}`).then(res => setLesson(res.data));
  }, [lessonId]);

  if (!lesson) return <div>Loading...</div>;

  return (
    <div>
      <h1>{lesson.title}</h1>
      <p>{lesson.content}</p>
      {lesson.games && lesson.games.map((game, idx) => {
        if (game.type === 'quiz') {
          return <QuizGame key={idx} questions={game.config.questions} />;
        }
        // Add more game types as needed
        return null;
      })}
    </div>
  );
};

export default LessonPage; 