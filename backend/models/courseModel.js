import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    duration: {
      type: String,
      required: [true, 'Please add a duration'],
    },
    level: {
      type: String,
      required: [true, 'Please add a level'],
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['tech', 'business', 'personal-development', 'leadership'],
    },
    imageUrl: {
      type: String,
      default: 'https://via.placeholder.com/400x300',
    },
    enrolledStudents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    resources: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource'
    }],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);

export default Course; 