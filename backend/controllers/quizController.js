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
    
    const { answers } = req.body; // Array of { questionId, answer }
    let score = 0;
    let totalPoints = 0;
    
    // Grade each answer
    quiz.questions.forEach((question) => {
      totalPoints += question.points || 1;
      const userAnswer = answers.find(a => a.questionId === question._id.toString());
      
      if (userAnswer) {
        if (question.type === 'MCQ') {
          if (userAnswer.answer === question.correctAnswer) {
            score += question.points || 1;
          }
        } else if (question.type === 'ShortAnswer') {
          // Case-insensitive comparison for short answers
          const userAnswerLower = userAnswer.answer?.trim().toLowerCase();
          const correctAnswerLower = question.correctAnswer?.trim().toLowerCase();
          if (userAnswerLower === correctAnswerLower) {
            score += question.points || 1;
          }
        }
      }
    });

    // Save result to user profile
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if user already submitted this quiz
    const existingResult = user.quizResults?.find(qr => qr.quizId.toString() === quiz._id.toString());
    
    if (existingResult) {
      // Update existing result
      existingResult.score = score;
      existingResult.total = totalPoints;
      existingResult.submittedAt = new Date();
    } else {
      // Add new result
      if (!user.quizResults) user.quizResults = [];
      user.quizResults.push({
        quizId: quiz._id,
        score,
        total: totalPoints,
        submittedAt: new Date()
      });
    }

    await user.save();

    res.json({ 
      score, 
      total: totalPoints,
      percentage: totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0,
      message: 'Quiz submitted successfully'
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quiz results (for user)
// @route   GET /api/quizzes/:id/results
// @access  Private
const getQuizResults = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const result = user.quizResults?.find(qr => qr.quizId.toString() === req.params.id);
    if (!result) return res.status(404).json({ message: 'Quiz result not found' });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all quiz results for a user
// @route   GET /api/quizzes/results
// @access  Private
const getUserQuizResults = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('quizResults.quizId');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ quizResults: user.quizResults || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { 
  createQuiz, 
  getQuiz, 
  submitQuiz, 
  getQuizResults, 
  getUserQuizResults,
  updateQuiz, 
  deleteQuiz 
}; 