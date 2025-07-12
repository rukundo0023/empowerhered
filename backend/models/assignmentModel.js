import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String },
  text: { type: String },
  submittedAt: { type: Date, default: Date.now },
  grade: { type: Number, min: 0, max: 100 },
  feedback: { type: String },
  gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gradedAt: { type: Date },
  status: { type: String, enum: ['submitted', 'graded', 'late'], default: 'submitted' }
});

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructions: { type: String },
  dueDate: { type: Date, required: true },
  totalPoints: { type: Number, default: 100 },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  moduleId: { type: String }, // Reference to module ID within course
  lessonId: { type: String }, // Reference to lesson ID within module
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  submissions: [submissionSchema],
  fileType: { type: String, enum: ['pdf', 'doc', 'docx', 'txt', 'any'], default: 'any' },
  maxFileSize: { type: Number, default: 10 }, // in MB
  allowTextSubmission: { type: Boolean, default: true },
  allowFileSubmission: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  gradingCriteria: [{
    criterion: { type: String, required: true },
    points: { type: Number, required: true },
    description: { type: String }
  }]
}, { timestamps: true });

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment; 