import Resource from '../models/resourceModel.js';
import asyncHandler from 'express-async-handler';
import Course from '../models/courseModel.js';

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
const getResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({})
    .populate('courseId', 'title')
    .populate('createdBy', 'name');
  res.json(resources);
});

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (resource) {
    res.json(resource);
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc    Create a resource
// @route   POST /api/resources
// @access  Private/Admin
const createResource = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    type,
    category,
    url,
    fileUrl,
    courseId,
  } = req.body;

  // Basic validation
  if (!title || !description || !type || !category || !courseId) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Type-specific validation
  if (['Video', 'Document'].includes(type)) {
    if (!fileUrl || typeof fileUrl !== 'string' || fileUrl.trim().length === 0) {
      res.status(400);
      throw new Error(`File URL is required for ${type} type`);
    }
  }

  if (type === 'Link' && (!url || typeof url !== 'string' || url.trim().length === 0)) {
    res.status(400);
    throw new Error('URL is required for Link type');
  }

  try {
    // Create the resource with proper field handling
    const resourceData = {
      title: title.trim(),
      description: description.trim(),
    type,
    category,
    courseId,
      createdBy: req.user._id,
    };

    // Only include url or fileUrl if they are provided and valid
    if (type === 'Link' && url) {
      resourceData.url = url.trim();
    } else if (['Video', 'Document'].includes(type) && fileUrl) {
      resourceData.fileUrl = fileUrl.trim();
    }

    const resource = await Resource.create(resourceData);

    // Add the resource to the course's resources array
    const course = await Course.findById(courseId);
    if (course) {
      if (!course.resources) {
        course.resources = [];
      }
      course.resources.push(resource._id);
      await course.save();
    }

  res.status(201).json(resource);
  } catch (error) {
    console.error('Resource creation error:', error);
    if (error.code === 11000) {
      res.status(400);
      throw new Error('A resource with these details already exists');
    }
    throw error;
  }
});

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Private/Admin
const updateResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (resource) {
    resource.title = req.body.title || resource.title;
    resource.description = req.body.description || resource.description;
    resource.type = req.body.type || resource.type;
    resource.category = req.body.category || resource.category;
    resource.url = req.body.url || resource.url;
    resource.fileUrl = req.body.fileUrl || resource.fileUrl;
    resource.courseId = req.body.courseId || resource.courseId;

    const updatedResource = await resource.save();
    res.json(updatedResource);
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private/Admin
const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (resource) {
    await resource.deleteOne();
    res.json({ message: 'Resource removed' });
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc    Get resources by category
// @route   GET /api/resources/category/:category
// @access  Public
const getResourcesByCategory = asyncHandler(async (req, res) => {
  const resources = await Resource.find({ category: req.params.category });
  res.json(resources);
});

// @desc    Update resource view count
// @route   POST /api/resources/:id/view
// @access  Private
const updateResourceView = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (resource) {
    resource.views = (resource.views || 0) + 1;
    await resource.save();
    res.json({ message: 'View count updated' });
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

export {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  getResourcesByCategory,
  updateResourceView,
}; 