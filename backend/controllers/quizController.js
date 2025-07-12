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
            // Case-insensitive comparison for MCQ
            const userAnswerLower = userAnswer.answer?.trim().toLowerCase();
            const correctAnswerLower = question.correctAnswer?.trim().toLowerCase();
            if (userAnswerLower === correctAnswerLower) {
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

    // Save result to user profile with attempt tracking
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if user already has results for this quiz
    let existingResult = user.quizResults?.find(qr => qr.quizId.toString() === quiz._id.toString());
    
    if (existingResult) {
      // Check if user has reached the maximum attempts (2)
      if (existingResult.attempts.length >= 2) {
        return res.status(400).json({ 
          message: 'Maximum attempts (2) reached for this quiz. Your best score will be recorded.',
          bestScore: existingResult.bestScore,
          bestTotal: existingResult.bestTotal,
          attemptsUsed: existingResult.attempts.length
        });
      }
      
      // Add new attempt
      const attemptNumber = existingResult.attempts.length + 1;
      existingResult.attempts.push({
        score,
        total: totalPoints,
        submittedAt: new Date(),
        attemptNumber
      });
      
      // Update best score if current attempt is better
      if (score > existingResult.bestScore) {
        existingResult.bestScore = score;
        existingResult.bestTotal = totalPoints;
      }
      
      existingResult.lastSubmittedAt = new Date();
    } else {
      // Create new quiz result
      if (!user.quizResults) user.quizResults = [];
      user.quizResults.push({
        quizId: quiz._id,
        attempts: [{
          score,
          total: totalPoints,
          submittedAt: new Date(),
          attemptNumber: 1
        }],
        bestScore: score,
        bestTotal: totalPoints,
        lastSubmittedAt: new Date()
      });
    }

    // Update course progress to 100% when quiz is completed
    if (quiz.course) {
      let courseProgress = user.courseProgress.find(cp => cp.courseId.toString() === quiz.course.toString());
      if (!courseProgress) {
        courseProgress = {
          courseId: quiz.course,
          progress: 100,
          lastAccessed: new Date(),
        };
        user.courseProgress.push(courseProgress);
      } else {
        courseProgress.progress = 100;
        courseProgress.lastAccessed = new Date();
      }
    }

    await user.save();

    // Get current attempt info
    const currentResult = user.quizResults.find(qr => qr.quizId.toString() === quiz._id.toString());
    const currentAttempt = currentResult.attempts.length;
    const bestScore = currentResult.bestScore;
    const bestTotal = currentResult.bestTotal;

    res.json({ 
      score, 
      total: totalPoints,
      percentage,
      passed,
      gradedAnswers,
      courseProgressUpdated: true,
      attemptNumber: currentAttempt,
      attemptsRemaining: 2 - currentAttempt,
      bestScore,
      bestTotal,
      bestPercentage: bestTotal > 0 ? Math.round((bestScore / bestTotal) * 100) : 0,
      message: passed ? 
        `Quiz passed! Course progress set to 100%. Attempt ${currentAttempt}/2.` : 
        `Quiz completed. Course progress set to 100%. Attempt ${currentAttempt}/2.`
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

    // Map quizResults to always include title, score, total, and submittedAt
    const quizResults = (user.quizResults || []).map(qr => {
      // Use best attempt or last attempt for display
      const lastAttempt = qr.attempts && qr.attempts.length > 0 ? qr.attempts[qr.attempts.length - 1] : null;
      return {
        _id: qr._id,
        quizId: qr.quizId ? { _id: qr.quizId._id, title: qr.quizId.title } : undefined,
        score: lastAttempt ? lastAttempt.score : qr.bestScore || 0,
        total: lastAttempt ? lastAttempt.total : qr.bestTotal || 0,
        submittedAt: lastAttempt ? lastAttempt.submittedAt : qr.lastSubmittedAt || null,
      };
    });

    res.json({ quizResults });
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