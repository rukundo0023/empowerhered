export type User = {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin' | 'mentor';
  enrolledCourses?: string[];
  gender?: string;
};

export type Lesson = {
  _id: string;
  title: string;
  content?: string;
  quizzes?: QuizQuestion[];
  assignment?: Assignment;
  games?: Game[];
};

export type Assignment = {
  _id: string;
  title: string;
  description: string;
  instructions?: string;
  dueDate?: string;
  fileType?: string;
  fileUrl?: string;
  grade?: number;
  feedback?: string;
};

export type QuizQuestion = {
  _id: string;
  type: 'MCQ' | 'ShortAnswer';
  text: string;
  question?: string;
  options?: string[];
  answer?: string;
  correctAnswer?: string;
  points?: number;
};

export type Module = {
  _id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
};

export type Game = {
  title: string;
  link: string;
  type?: string;
  config?: {
    questions: QuizQuestion[];
  };
}; 