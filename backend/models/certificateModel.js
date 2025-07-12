import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  certificateNumber: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  completionDate: {
    type: Date,
    required: true,
  },
  grade: {
    type: String,
    enum: ['Pass', 'Merit', 'Distinction', 'Honors'],
    default: 'Pass',
  },
  finalScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  status: {
    type: String,
    enum: ['active', 'revoked', 'expired'],
    default: 'active',
  },
  validUntil: {
    type: Date,
    default: function () {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 2);
      return date;
    },
  },
  metadata: {
    totalLessons: Number,
    completedLessons: Number,
    quizScores: [
      {
        quizId: mongoose.Schema.Types.ObjectId,
        score: Number,
        total: Number,
      },
    ],
    assignmentScores: [
      {
        assignmentId: mongoose.Schema.Types.ObjectId,
        score: Number,
        total: Number,
      },
    ],
  },
  certificateUrl: {
    type: String,
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Generate unique certificate number
certificateSchema.pre('save', async function (next) {
  if (this.isNew && !this.certificateNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Certificate').countDocuments({
      issueDate: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1),
      },
    });
    this.certificateNumber = `EMP-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// ✅ Indexes
certificateSchema.index({ student: 1, course: 1 }, { unique: true });
certificateSchema.index({ certificateNumber: 1 }, { unique: true });
certificateSchema.index({ issueDate: -1 });

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
