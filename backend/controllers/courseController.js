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
      createdBy: req.user._id,
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
    // Only allow if admin or creator
    if (
      req.user.role !== 'admin' &&
      (!course.createdBy || course.createdBy.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
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

// @desc    Get all student progress, optionally filtered by instructorId
// @route   GET /api/progress?instructorId=...
// @access  Private/Admin or Instructor
const getProgressByInstructor = asyncHandler(async (req, res) => {
  const { instructorId } = req.query;
  let users = await User.find({})
    .select('name courseProgress')
    .populate({
      path: 'courseProgress.courseId',
      select: 'title createdBy',
    });

  let progress = users.flatMap(user =>
    user.courseProgress.map(progress => {
      // Defensive: Only include if courseId exists and is an object
      if (!progress.courseId || typeof progress.courseId !== 'object') {
        return null;
      }
      return {
        userId: user._id,
        userName: user.name,
        courseId: progress.courseId?._id,
        courseName: progress.courseId?.title,
        courseCreatedBy: progress.courseId?.createdBy,
        progress: progress.progress,
        lastAccessed: progress.lastAccessed
      };
    })
  ).filter(Boolean);

  if (instructorId) {
    progress = progress.filter(p => p.courseCreatedBy && p.courseCreatedBy.toString() === instructorId);
  }

  res.json(progress);
});

// @desc    Add a module to a course
// @route   POST /api/courses/:courseId/modules
// @access  Private/Admin
const addModule = async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    course.modules.push({ title, description, lessons: [] });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a module in a course
// @route   PUT /api/courses/:courseId/modules/:moduleId
// @access  Private/Admin
const updateModule = async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const module = course.modules.id(req.params.moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });
    module.title = title || module.title;
    module.description = description || module.description;
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a module from a course
// @route   DELETE /api/courses/:courseId/modules/:moduleId
// @access  Private/Admin
const deleteModule = async (req, res) => {
  try {
    console.log('DELETE /api/courses/:courseId/modules/:moduleId', req.params);
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      console.error('Course not found:', req.params.courseId);
      return res.status(404).json({ message: 'Course not found' });
    }
    const module = course.modules.id(req.params.moduleId);
    if (!module) {
      console.error('Module not found:', req.params.moduleId);
      return res.status(404).json({ message: 'Module not found' });
    }
    module.remove();
    await course.save();
    res.json(course);
  } catch (error) {
    console.error('Error deleting module:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a lesson to a module
// @route   POST /api/courses/:courseId/modules/:moduleId/lessons
// @access  Private/Admin
const addLesson = async (req, res) => {
  try {
    const { title, content } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const module = course.modules.id(req.params.moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });
    module.lessons.push({ title, content, resources: [] });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a lesson in a module
// @route   PUT /api/courses/:courseId/modules/:moduleId/lessons/:lessonId
// @access  Private/Admin
const updateLesson = async (req, res) => {
  try {
    const { title, content } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const module = course.modules.id(req.params.moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });
    const lesson = module.lessons.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    lesson.title = title || lesson.title;
    lesson.content = content || lesson.content;
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a lesson from a module
// @route   DELETE /api/courses/:courseId/modules/:moduleId/lessons/:lessonId
// @access  Private/Admin
const deleteLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const module = course.modules.id(req.params.moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });
    module.lessons.id(req.params.lessonId).remove();
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all modules for a course
// @route   GET /api/courses/:courseId/modules
// @access  Public (or protect if needed)
const getModules = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course.modules || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single module by ID
// @route   GET /api/courses/:courseId/modules/:moduleId
// @access  Public or protected as needed
const getModuleById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const module = course.modules.id(req.params.moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark lesson as visited (completed) for user
// @route   POST /api/courses/:courseId/modules/:moduleIndex/lessons/:lessonIndex/visit
// @access  Private
const visitLesson = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId, moduleIndex, lessonIndex } = req.params;
    console.log('visitLesson called with:', { userId, courseId, moduleIndex, lessonIndex });
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User before update:', JSON.stringify(user, null, 2));

    // Step 1: Find or create lessonProgress entry
    let progressEntry = user.lessonProgress.find(lp =>
      lp.courseId.toString() === courseId && lp.moduleIndex === Number(moduleIndex)
    );
    console.log('After finding lessonProgress:', JSON.stringify(progressEntry, null, 2));
    if (!progressEntry) {
      progressEntry = {
        courseId: new mongoose.Types.ObjectId(courseId),
        moduleIndex: Number(moduleIndex),
        completedLessons: [],
        lastAccessed: new Date(),
      };
      user.lessonProgress.push(progressEntry);
      console.log('Created new lessonProgress entry');
    }

    // Step 2: Mark lesson as completed if not already
    if (!progressEntry.completedLessons.includes(Number(lessonIndex))) {
      progressEntry.completedLessons.push(Number(lessonIndex));
      progressEntry.lastAccessed = new Date();
      console.log('Marked lesson as completed');
      user.markModified('lessonProgress');
    }

    // Step 3: Get course and count total lessons
    const course = await Course.findById(courseId);
    let totalLessons = 0;
    if (course && course.modules) {
      totalLessons = course.modules.reduce((sum, mod) => sum + (mod.lessons ? mod.lessons.length : 0), 0);
    }
    console.log('Total lessons in course:', totalLessons);

    // Step 4: Count completed lessons for this course
    const completedLessons = user.lessonProgress
      .filter(lp => lp.courseId.toString() === courseId)
      .reduce((sum, lp) => sum + (lp.completedLessons ? lp.completedLessons.length : 0), 0);
    console.log('Completed lessons for this course:', completedLessons);

    // Step 5: Update courseProgress
    let courseProgress = user.courseProgress.find(cp => cp.courseId.toString() === courseId);
    if (!courseProgress) {
      courseProgress = {
        courseId: new mongoose.Types.ObjectId(courseId),
        progress: 0,
        lastAccessed: new Date(),
      };
      user.courseProgress.push(courseProgress);
      console.log('Created new courseProgress entry');
    }
    courseProgress.progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    courseProgress.lastAccessed = new Date();
    console.log('Updated courseProgress:', JSON.stringify(courseProgress, null, 2));

    await user.save();
    console.log('User after update:', JSON.stringify(user, null, 2));
    res.json({ message: 'Lesson marked as completed', lessonProgress: user.lessonProgress, courseProgress });
  } catch (error) {
    console.error('visitLesson error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's lesson progress for a course
// @route   GET /api/courses/:courseId/lesson-progress
// @access  Private
const getUserLessonProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const progress = user.lessonProgress.filter(lp => lp.courseId.toString() === courseId);
    res.json({ lessonProgress: progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getCourseProgress,
  getAllStudentProgress,
  getProgressByInstructor,
  addModule,
  updateModule,
  deleteModule,
  addLesson,
  updateLesson,
  deleteLesson,
  getModules,
  getModuleById,
  visitLesson,
  getUserLessonProgress
}; 