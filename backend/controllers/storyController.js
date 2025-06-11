import Story from '../models/storyModel.js';

// @desc    Get all stories
// @route   GET /api/stories
// @access  Public
export const getStories = async (req, res) => {
  try {
    const stories = await Story.find({}).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured stories
// @route   GET /api/stories/featured
// @access  Public
export const getFeaturedStories = async (req, res) => {
  try {
    const stories = await Story.find({ featured: true }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single story
// @route   GET /api/stories/:id
// @access  Public
export const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (story) {
      res.json(story);
    } else {
      res.status(404).json({ message: 'Story not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a story
// @route   POST /api/stories
// @access  Private/Admin
export const createStory = async (req, res) => {
  try {
    const story = new Story(req.body);
    const createdStory = await story.save();
    res.status(201).json(createdStory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a story
// @route   PUT /api/stories/:id
// @access  Private/Admin
export const updateStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (story) {
      Object.assign(story, req.body);
      const updatedStory = await story.save();
      res.json(updatedStory);
    } else {
      res.status(404).json({ message: 'Story not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a story
// @route   DELETE /api/stories/:id
// @access  Private/Admin
export const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (story) {
      await story.deleteOne();
      res.json({ message: 'Story removed' });
    } else {
      res.status(404).json({ message: 'Story not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle story featured status
// @route   PUT /api/stories/:id/feature
// @access  Private/Admin
export const toggleStoryFeatured = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (story) {
      story.featured = !story.featured;
      const updatedStory = await story.save();
      res.json(updatedStory);
    } else {
      res.status(404).json({ message: 'Story not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 