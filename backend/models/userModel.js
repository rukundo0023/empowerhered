import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'mentor', 'admin', 'instructor'],
      default: 'student',
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Please specify your gender'],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    courseProgress: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
        progress: {
          type: Number,
          default: 0,
        },
        lastAccessed: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // --- NEW: Mentor availability field ---
    availability: [
      {
        type: Date,
      },
    ],

    // --- Google OAuth fields for mentors ---
    googleId: {
      type: String,
    },
    googleAccessToken: {
      type: String,
    },
    googleRefreshToken: {
      type: String,
    },
    googleTokenExpiry: {
      type: Date,
    },
    lessonProgress: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
        moduleIndex: {
          type: Number,
          required: true,
        },
        completedLessons: [
          {
            type: Number, // index of the lesson in the module
          }
        ],
        lastAccessed: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    
    // --- NEW: Quiz results tracking with multiple attempts ---
    quizResults: [
      {
        quizId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Quiz',
        },
        attempts: [
          {
            score: {
              type: Number,
              required: true,
            },
            total: {
              type: Number,
              required: true,
            },
            submittedAt: {
              type: Date,
              default: Date.now,
            },
            attemptNumber: {
              type: Number,
              required: true,
            },
          }
        ],
        bestScore: {
          type: Number,
          default: 0,
        },
        bestTotal: {
          type: Number,
          default: 0,
        },
        lastSubmittedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    
    // --- NEW: Assignment submissions tracking ---
    assignmentSubmissions: [
      {
        assignmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Assignment',
        },
        fileUrl: {
          type: String,
        },
        text: {
          type: String,
        },
        submittedAt: {
          type: Date,
          default: Date.now,
        },
        grade: {
          type: Number,
          min: 0,
          max: 100,
        },
        feedback: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    console.log('Attempting password comparison');
    console.log('User password exists:', !!this.password);
    console.log('Entered password exists:', !!enteredPassword);

    if (!this.password) {
      console.error('No password hash found for user');
      return false;
    }

    if (!enteredPassword) {
      console.error('No password provided for comparison');
      return false;
    }

    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log('Password comparison result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Password comparison error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return false;
  }
};

const User = mongoose.model('User', userSchema);

export default User;
