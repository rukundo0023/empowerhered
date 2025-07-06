import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['MCQ', 'ShortAnswer'], required: true },
  text: { type: String, required: true },
  options: [{ type: String }], // For MCQ
  correctAnswer: { type: mongoose.Schema.Types.Mixed },
  points: { type: Number, default: 1 }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [questionSchema],
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  module: { type: String },
  lesson: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz; 