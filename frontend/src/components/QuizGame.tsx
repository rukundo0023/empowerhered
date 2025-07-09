import React, { useState } from 'react';

type Question = {
  question: string;
  options: string[];
  answer: string;
};

type QuizGameProps = {
  questions: Question[];
};

const QuizGame: React.FC<QuizGameProps> = ({ questions }) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswer = (option: string) => {
    if (option === questions[current].answer) setScore(score + 1);
    if (current + 1 < questions.length) setCurrent(current + 1);
    else setShowScore(true);
  };

  if (showScore) return <div>Your score: {score} / {questions.length}</div>;

  return (
    <div>
      <h3>{questions[current].question}</h3>
      {questions[current].options.map((opt) => (
        <button key={opt} onClick={() => handleAnswer(opt)}>{opt}</button>
      ))}
    </div>
  );
};

export default QuizGame; 