import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['MCQ', 'ShortAnswer'], required: true },
  text: { type: String, required: true },
  options: [{ type: String }], // For MCQ
  correctAnswer: { type: mongoose.Schema.Types.Mixed },
  points: { type: Number, default: 1 },
  explanation: { type: String } // For providing feedback on answers
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [questionSchema],
  totalPoints: { type: Number, default: 0 },
  passingScore: { type: Number, default: 70 }, // Percentage
  timeLimit: { type: Number }, // in minutes
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  moduleId: { type: String }, // Reference to module ID within course
  lessonId: { type: String }, // Reference to lesson ID within module
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  attemptsAllowed: { type: Number, default: 1 },
}, { timestamps: true });

// Calculate total points before saving
quizSchema.pre('save', function(next) {
  this.totalPoints = this.questions.reduce((sum, question) => sum + question.points, 0);
  next();
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz; 