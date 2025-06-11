import mongoose from 'mongoose';

const mentorshipSchema = mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    mentee: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    goals: [{
      description: String,
      completed: {
        type: Boolean,
        default: false,
      },
      targetDate: Date,
    }],
    meetings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meeting',
    }],
    notes: {
      type: String,
    },
    feedback: [{
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      date: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Add index for faster queries
mentorshipSchema.index({ mentor: 1, mentee: 1 }, { unique: true });

const Mentorship = mongoose.model('Mentorship', mentorshipSchema);

export default Mentorship; 