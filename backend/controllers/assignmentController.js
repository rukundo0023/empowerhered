import Assignment from '../models/assignmentModel.js';
import User from '../models/userModel.js';

// @desc    Create an assignment
// @route   POST /api/assignments
// @access  Private/Admin
const createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create(req.body);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get an assignment
// @route   GET /api/assignments/:id
// @access  Private
const getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit an assignment
// @route   POST /api/assignments/:id/submit
// @access  Private
const submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    const { fileUrl, text } = req.body;
    assignment.submissions.push({ student: req.user._id, fileUrl, text });
    await assignment.save();
    res.json({ message: 'Assignment submitted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade an assignment submission
// @route   POST /api/assignments/:id/grade
// @access  Private/Admin
const gradeAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    const { submissionId, grade, feedback } = req.body;
    const submission = assignment.submissions.id(submissionId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    submission.grade = grade;
    submission.feedback = feedback;
    await assignment.save();
    res.json({ message: 'Assignment graded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all submissions for an assignment
// @route   GET /api/assignments/:id/submissions
// @access  Private/Admin
const getAssignmentSubmissions = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment.submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createAssignment, getAssignment, submitAssignment, gradeAssignment, getAssignmentSubmissions }; 