import { useEffect, useState } from 'react';
import api from '../api/axios';

interface Assignment {
  _id: string;
  title: string;
  description: string;
  grade?: number;
  feedback?: string;
}

interface Lesson {
  _id: string;
  title: string;
  content?: string;
  assignment?: Assignment;
}

const AssignmentComponent = ({ lesson }: { lesson: Lesson }) => {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [grade, setGrade] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    // Use assignment from lesson.assignment
    if (lesson && lesson.assignment) {
      setAssignment(lesson.assignment);
      if (lesson.assignment.grade) setGrade(lesson.assignment.grade);
      if (lesson.assignment.feedback) setFeedback(lesson.assignment.feedback);
    } else {
      setAssignment(null);
    }
  }, [lesson]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment) return;
    let fileUrl = '';
    if (file) {
      // Implement file upload logic here if needed
      // For now, just skip
    }
    // You can implement local submission logic here if needed
    setSubmitted(true);
  };

  if (!assignment) return <div>No assignment for this lesson.</div>;
  if (submitted)
    return <div>Assignment submitted! {grade !== null && <div>Grade: {grade}</div>} {feedback && <div>Feedback: {feedback}</div>}</div>;

  return (
    <div className="assignment-component">
      <h4 className="font-bold mb-2">{assignment.title}</h4>
      <div className="mb-2">{assignment.description}</div>
      <form onSubmit={handleSubmit}>
        <textarea
          className="border rounded px-2 py-1 w-full mb-2"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter your answer or notes here"
        />
        <input
          type="file"
          className="mb-2"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />
        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded">Submit Assignment</button>
      </form>
      {grade !== null && <div className="mt-2">Grade: {grade}</div>}
      {feedback && <div className="mt-2">Feedback: {feedback}</div>}
    </div>
  );
};

export default AssignmentComponent; 