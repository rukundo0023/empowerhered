import mongoose from 'mongoose';

const storySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    author: {
      type: String,
      required: [true, 'Please add an author'],
    },
    image: {
      type: String,
      required: [true, 'Please add an image'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Story = mongoose.model('Story', storySchema);

export default Story; 