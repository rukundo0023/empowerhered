import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { AUTHORIZED_USERS } from '../config/authorizedUsers.js';
import bcrypt from 'bcrypt';
import { getOAuthClient } from '../config/googleClient.js';
import { sendWelcomeEmail } from '../utils/SendWelcomeEmail.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, gender } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Gender-based registration limits
  const totalUsers = await User.countDocuments();
  const menCount = await User.countDocuments({ gender: 'male' });
  // If registering a male, check if adding one would exceed 20% of total users
  if (gender === 'male') {
    const projectedMen = menCount + 1;
    const projectedTotal = totalUsers + 1;
    if (projectedMen / projectedTotal > 0.2) {
      res.status(400);
      throw new Error('Registration denied: Men cannot exceed 20% of total users.');
    }
  }

  // Role-based authorization
  if (role === 'admin') {
    if (email !== AUTHORIZED_USERS.superAdmin.email) {
      res.status(403);
      throw new Error('Unauthorized admin registration');
    }
  } else if (role === 'mentor') {
    if (!AUTHORIZED_USERS.mentors.includes(email)) {
      res.status(403);
      throw new Error('Unauthorized mentor registration');
    }
  } else if (role === 'instructor') {
    if (!AUTHORIZED_USERS.instructors.includes(email)) {
      res.status(403);
      throw new Error('Unauthorized instructor registration');
    }
  }

  // Create user with plain password - it will be hashed by the pre-save hook
  const user = await User.create({
    name,
    email,
    password, // The pre-save hook will hash this
    role,
    gender,
  });
   
  try {
    await sendWelcomeEmail({ email: user.email, name: user.name });
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }


  console.log('Created user:', {
    name: user.name,
    email: user.email,
    role: user.role,
    hasPassword: !!user.password,
    passwordLength: user.password ? user.password.length : 0
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Find user and explicitly select password
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Match password using the model's method
  const isMatch = await user.matchPassword(password);
  
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check if user is admin
  if (email === AUTHORIZED_USERS.superAdmin.email) {
    console.log('Authorized admin login attempt:', { email, currentRole: user.role });
    // Update role to admin if it's not already
    if (user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
      console.log('Updated user role to admin:', { email, newRole: user.role });
    }
  }

  // Generate token and send response
  const token = generateToken(user._id);
  
  const responseData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    gender: user.gender,
    token
  };

  console.log('Login response:', { ...responseData, token: '***' });
  
  res.json(responseData);
});

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log('getCurrentUser - Found user:', {
    _id: user?._id,
    name: user?.name,
    email: user?.email,
    role: user?.role,
    courseProgress: user?.courseProgress
  });
  
  if (user) {
    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      courseProgress: user.courseProgress || []
    };
    console.log('getCurrentUser - Sending response:', response);
    res.json(response);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Google login
// @route   POST /api/users/google-login
// @access  Public
export const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(400);
    throw new Error('Google token is required');
  }

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name,
        email,
        password: Math.random().toString(36).slice(-8), // Generate random password
        profilePicture: picture,
        isGoogleUser: true
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      token
    });
  } catch (error) {
    res.status(401);
    throw new Error('Invalid Google token');
  }
});

export {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  deleteUser,
  updateUser
};
