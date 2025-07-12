import Quiz from '../models/quizModel.js';
import User from '../models/userModel.js';
import Course from '../models/courseModel.js';

// @desc    Create a quiz
// @route   POST /api/quizzes
// @access  Private/Admin/Instructor
const createQuiz = async (req, res) => {
  try {
    const { title, description, questions, course, moduleId, lessonId, passingScore, timeLimit, attemptsAllowed } = req.body;

    // Validate required fields
    if (!title || !questions || !course) {
      return res.status(400).json({ message: 'Title, questions, and course are required' });
    }

    // Validate course exists
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const quiz = await Quiz.create({
      title,
      description,
      questions,
      course,
      moduleId,
      lessonId,
      passingScore: passingScore || 70,
      timeLimit,
      attemptsAllowed: attemptsAllowed || 1,
      createdBy: req.user._id
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error('Quiz creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all quizzes for a course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
const getQuizzesByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ 
      course: req.params.courseId,
      isActive: true 
    }).populate('createdBy', 'name');
    
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quizzes for a specific lesson
// @route   GET /api/quizzes/lesson/:courseId/:moduleId/:lessonId
// @access  Private
const getQuizzesByLesson = async (req, res) => {
  try {
    const { courseId, moduleId, lessonId } = req.params;
    
    const quizzes = await Quiz.find({ 
      course: courseId,
      moduleId,
      lessonId,
      isActive: true 
    }).populate('createdBy', 'name');
    
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a quiz
// @route   GET /api/quizzes/:id
// @access  Private
const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('course', 'title')
      .populate('createdBy', 'name');
      
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
    const gradedAnswers = [];
    
    // Grade each answer
    quiz.questions.forEach((question) => {
      totalPoints += question.points || 1;
      const userAnswer = answers.find(a => a.questionId === question._id.toString());
      
      let isCorrect = false;
      if (userAnswer) {
        if (question.type === 'MCQ') {
          if (userAnswer.answer === question.correctAnswer) {
            score += question.points || 1;
            isCorrect = true;
          }
        } else if (question.type === 'ShortAnswer') {
          // Case-insensitive comparison for short answers
          const userAnswerLower = userAnswer.answer?.trim().toLowerCase();
          const correctAnswerLower = question.correctAnswer?.trim().toLowerCase();
          if (userAnswerLower === correctAnswerLower) {
            score += question.points || 1;
            isCorrect = true;
          }
        }
      }
      
      gradedAnswers.push({
        questionId: question._id,
        userAnswer: userAnswer?.answer || '',
        isCorrect,
        points: isCorrect ? question.points || 1 : 0,
        explanation: question.explanation
      });
    });

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    const passed = percentage >= quiz.passingScore;

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
      percentage,
      passed,
      gradedAnswers,
      message: passed ? 'Quiz passed!' : 'Quiz completed. Review your answers.'
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
// @access  Private/Admin/Instructor
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    // Check if user can edit this quiz
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this quiz' });
    }
    
    Object.assign(quiz, req.body);
    const updatedQuiz = await quiz.save();
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin/Instructor
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    // Check if user can delete this quiz
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this quiz' });
    }
    
    await quiz.deleteOne();
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { 
  createQuiz, 
  getQuiz, 
  getQuizzesByCourse,
  getQuizzesByLesson,
  submitQuiz, 
  getQuizResults, 
  getUserQuizResults,
  updateQuiz, 
  deleteQuiz 
}; 