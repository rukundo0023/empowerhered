import React, { useEffect, useState } from 'react';
import QuizGame from '../components/QuizGame';
import axios from '../api/axios';

const LessonPage = ({ lessonId, courseId, moduleIndex, lessonIndex }) => {
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    axios.get(`/api/lessons/${lessonId}`).then(res => setLesson(res.data));
    // Mark lesson as visited
    if (courseId && moduleIndex !== undefined && lessonIndex !== undefined) {
      axios.post(`/api/courses/${courseId}/modules/${moduleIndex}/lessons/${lessonIndex}/visit`)
        .catch(() => {});
      // Fetch progress for this course
      axios.get(`/api/courses/${courseId}/lesson-progress`).then(res => {
        const moduleProgress = res.data.lessonProgress.find(lp => lp.moduleIndex === Number(moduleIndex));
        setProgress(moduleProgress ? moduleProgress.completedLessons : []);
      });
    }
  }, [lessonId, courseId, moduleIndex, lessonIndex]);

  if (!lesson) return <div>Loading...</div>;

  return (
    <div>
      <h1>{lesson.title}</h1>
      <p>{lesson.content}</p>
      {/* Progress indicator */}
      {progress && (
        <div style={{ margin: '1em 0' }}>
          <strong>Progress in this module:</strong>
          <div>
            {[0,1,2,3].map(idx => (
              <span key={idx} style={{
                display: 'inline-block',
                width: 24,
                height: 24,
                margin: 2,
                borderRadius: '50%',
                background: progress.includes(idx) ? 'green' : '#ccc',
                color: 'white',
                textAlign: 'center',
                lineHeight: '24px'
              }}>{idx+1}</span>
            ))}
          </div>
        </div>
      )}
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