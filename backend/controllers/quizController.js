import Quiz from '../models/quizModel.js';
import User from '../models/userModel.js';

// @desc    Create a quiz
// @route   POST /api/quizzes
// @access  Private/Admin
const createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a quiz
// @route   GET /api/quizzes/:id
// @access  Private
const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit a quiz (auto-grade)
// @route   POST /api/quizzes/:id/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    const { answers } = req.body; // { questionId: answer }
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (q.type === 'MCQ' && answers[idx] === q.correctAnswer) score += q.points;
      if (q.type === 'ShortAnswer' && answers[idx]?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase()) score += q.points;
    });
    // Optionally, save result to user profile
    res.json({ score, total: quiz.questions.reduce((sum, q) => sum + q.points, 0) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quiz results (for user)
// @route   GET /api/quizzes/:id/results
// @access  Private
const getQuizResults = async (req, res) => {
  // Placeholder: implement if storing user quiz results
  res.json({ message: 'Not implemented' });
};

// @desc    Update a quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Admin
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    Object.assign(quiz, req.body);
    const updatedQuiz = await quiz.save();
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    await quiz.deleteOne();
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createQuiz, getQuiz, submitQuiz, getQuizResults, updateQuiz, deleteQuiz }; 