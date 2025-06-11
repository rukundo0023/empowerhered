import mongoose from 'mongoose';

// Drop the problematic index if it exists
mongoose.connection.on('connected', async () => {
  try {
    await mongoose.connection.db.collection('resources').dropIndex('path_1');
  } catch (error) {
    // Ignore error if index doesn't exist
    console.log('Index drop error (can be ignored):', error.message);
  }
});

const resourceSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      enum: ['Video', 'Document', 'Link', 'Quiz', 'Assignment'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Technology', 'Business', 'Health', 'Education', 'Other'],
    },
    url: {
      type: String,
      required: function() {
        return this.type === 'Link';
      },
      trim: true
    },
    fileUrl: {
      type: String,
      required: function() {
        return ['Video', 'Document'].includes(this.type);
      },
      trim: true,
      validate: {
        validator: function(v) {
          if (['Video', 'Document'].includes(this.type)) {
            return v && v.trim().length > 0;
          }
          return true;
        },
        message: props => `File URL is required for ${props.type} type`
      }
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    strict: true
  }
);

// Ensure no unique indexes are created
resourceSchema.index({ title: 1 }, { unique: false });
resourceSchema.index({ courseId: 1 }, { unique: false });
resourceSchema.index({ createdBy: 1 }, { unique: false });

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource; 