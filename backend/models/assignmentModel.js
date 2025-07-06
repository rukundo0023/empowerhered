import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileUrl: { type: String },
  text: { type: String },
  submittedAt: { type: Date, default: Date.now },
  grade: { type: Number },
  feedback: { type: String }
});

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  module: { type: String },
  lesson: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submissions: [submissionSchema]
}, { timestamps: true });

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment; 