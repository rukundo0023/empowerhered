import Course from '../models/courseModel.js';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate({
        path: 'resources',
        select: 'title type fileUrl url description category'
      });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate({
        path: 'resources',
        select: 'title type fileUrl url description category'
      });
    
    if (course) {
      // Ensure resources array exists
      if (!course.resources) {
        course.resources = [];
      }
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Error fetching course' });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  try {
    const { title, description, duration, level, category, imageUrl } = req.body;

    // Validate required fields
    if (!title || !description || !duration || !level || !category) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, description, duration, level, and category'
      });
    }

    // Validate level
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({
        message: 'Invalid level. Must be one of: beginner, intermediate, advanced'
      });
    }

    // Validate category
    const validCategories = ['tech', 'business', 'personal-development', 'leadership'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: 'Invalid category. Must be one of: tech, business, personal-development, leadership'
      });
    }

    const course = await Course.create({
      title: title.trim(),
      description: description.trim(),
      duration: duration.trim(),
      level,
      category,
      imageUrl: imageUrl || 'https://via.placeholder.com/400x300',
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ 
      message: error.message || 'Error creating course',
      details: error.errors // Include validation errors if any
    });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  try {
    const { title, description, duration, level, category, imageUrl } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.duration = duration || course.duration;
    course.level = level || course.level;
    course.category = category || course.category;
    course.imageUrl = imageUrl || course.imageUrl;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Error updating course' });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.deleteOne();
    res.json({ message: 'Course removed' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error deleting course' });
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already enrolled
    const isEnrolled = user.enrolledCourses.includes(course._id);

    if (!isEnrolled) {
      // First time enrollment
    user.enrolledCourses.push(course._id);
    user.courseProgress.push({
      courseId: course._id,
      progress: 0,
        lastAccessed: new Date(),
        enrollmentId: new mongoose.Types.ObjectId()
      });
      await user.save();
      return res.json({ message: 'Successfully enrolled in course' });
    } else {
      // Already enrolled - just update last accessed
      const progressIndex = user.courseProgress.findIndex(
        p => p.courseId.toString() === course._id.toString()
      );
      
      if (progressIndex !== -1) {
        user.courseProgress[progressIndex].lastAccessed = new Date();
    await user.save();
      }
      
      return res.json({ message: 'Already enrolled in course' });
    }
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Error enrolling in course' });
  }
};


// @desc    Get course progress
// @route   GET /api/courses/:id/progress
// @access  Private
const getCourseProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const progress = user.courseProgress.find(
      (p) => p.courseId.toString() === req.params.id
    );

    if (!progress) {
      return res.status(404).json({ message: 'Course progress not found' });
    }

    res.json(progress);
  } catch (error) {
    console.error('Error fetching course progress:', error);
    res.status(500).json({ message: 'Error fetching course progress' });
  }
};

// @desc    Get all student progress (admin only)
// @route   GET /api/courses/progress
// @access  Private/Admin
const getAllStudentProgress = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select('name courseProgress')
    .populate({
      path: 'courseProgress.courseId',
      select: 'title',
    });

  const progress = users.flatMap(user => 
    user.courseProgress.map(progress => ({
      userId: user._id,
      userName: user.name,
      courseId: progress.courseId._id,
      courseName: progress.courseId.title,
      progress: progress.progress,
      lastAccessed: progress.lastAccessed
    }))
  );

  res.json(progress);
});

export {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getCourseProgress,
  getAllStudentProgress,
}; 