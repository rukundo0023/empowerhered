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
      enum: ['student', 'mentor', 'admin'],
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
