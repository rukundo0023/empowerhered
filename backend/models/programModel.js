import mongoose from 'mongoose';

const programSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a program name'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    path: {
      type: String,
      required: [true, 'Please add a path'],
      unique: true,
    },
    image: {
      type: String,
      required: [true, 'Please add an image'],
    },
    duration: {
      type: String,
      required: [true, 'Please add program duration'],
    },
    level: {
      type: String,
      required: [true, 'Please add program level'],
    },
  },
  {
    timestamps: true,
  }
);

const Program = mongoose.model('Program', programSchema);

export default Program; 