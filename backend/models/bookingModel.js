import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User',
      default: null
    },
    mentee: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    menteeName: {
      type: String,
      required: true,
    },
    menteeEmail: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: false,
      default: Date.now,
    },
    time: {
      type: String,
      required: false,
      default: 'To be scheduled',
    },
    duration: {
      type: Number,
      required: false,
      default: 60, // duration in minutes
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    topic: {
      type: String,
      required: false,
      default: 'Initial Mentorship Session',
    },
    notes: {
      type: String,
    },
    meetingLink: {
      type: String,
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
    },
  },
  {
    timestamps: true,
  }
);

// Add pre-save middleware to ensure mentor is null if not provided
bookingSchema.pre('save', function(next) {
  if (!this.mentor) {
    this.mentor = null;
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking; 