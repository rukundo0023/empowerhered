import mongoose from 'mongoose';

const meetingSchema = mongoose.Schema(
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
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    notes: {
      type: String,
    },
    duration: {
      type: Number, // Duration in minutes
      default: 60,
    },
    meetingType: {
      type: String,
      enum: ['video', 'audio', 'in-person'],
      default: 'video',
    },
    meetingLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting; 