import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { AUTHORIZED_USERS } from '../config/authorizedUsers.js';

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

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Check if the user is authorized based on role and email
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
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
    gender
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
      token: generateToken(user._id)
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

  // Find user and explicitly select password field
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.matchPassword(password);
  
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Verify admin and mentor authorization
  if (user.role === 'admin' && email !== AUTHORIZED_USERS.superAdmin.email) {
    res.status(403);
    throw new Error('Unauthorized admin access');
  }
  
  if (user.role === 'mentor' && !AUTHORIZED_USERS.mentors.includes(email)) {
    res.status(403);
    throw new Error('Unauthorized mentor access');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    gender: user.gender,
    token: generateToken(user._id)
  });
});

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
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

export {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  deleteUser,
  updateUser
};
