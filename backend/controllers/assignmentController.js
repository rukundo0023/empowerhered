import Assignment from '../models/assignmentModel.js';
import User from '../models/userModel.js';
import Course from '../models/courseModel.js';
import { sendEmail } from '../utils/sendEmail.js';

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
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if user already submitted this assignment
    const existingSubmission = user.assignmentSubmissions?.find(
      sub => sub.assignmentId.toString() === assignment._id.toString()
    );
    
    if (existingSubmission) {
      return res.status(400).json({ message: 'You have already submitted this assignment' });
    }

    // Add submission to user profile
    if (!user.assignmentSubmissions) user.assignmentSubmissions = [];
    user.assignmentSubmissions.push({
      assignmentId: assignment._id,
      fileUrl,
      text,
      submittedAt: new Date()
    });

    await user.save();

    // Send email notification to instructor if assignment has a course
    if (assignment.course) {
      try {
        const course = await Course.findById(assignment.course);
        if (course && course.createdBy) {
          const instructor = await User.findById(course.createdBy);
          if (instructor && instructor.email) {
            await sendEmail({
              to: instructor.email,
              subject: `New Assignment Submission - ${assignment.title}`,
              text: `
                Hello ${instructor.name},
                
                A new assignment submission has been received:
                
                Assignment: ${assignment.title}
                Student: ${user.name} (${user.email})
                Submitted: ${new Date().toLocaleString()}
                
                Please review the submission at your earliest convenience.
                
                Best regards,
                EmpowerHer Learning Platform
              `,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #1f2937;">New Assignment Submission</h2>
                  <p>Hello ${instructor.name},</p>
                  <p>A new assignment submission has been received:</p>
                  <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Assignment:</strong> ${assignment.title}</p>
                    <p><strong>Student:</strong> ${user.name} (${user.email})</p>
                    <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                  </div>
                  <p>Please review the submission at your earliest convenience.</p>
                  <p>Best regards,<br>EmpowerHer Learning Platform</p>
                </div>
              `
            });
          }
        }
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the submission if email fails
      }
    }

    res.json({ 
      message: 'Assignment submitted successfully',
      submissionId: user.assignmentSubmissions[user.assignmentSubmissions.length - 1]._id
    });
  } catch (error) {
    console.error('Assignment submission error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade an assignment submission
// @route   POST /api/assignments/:id/grade
// @access  Private/Admin
const gradeAssignment = async (req, res) => {
  try {
    const { submissionId, grade, feedback } = req.body;
    
    // Find user with this submission
    const user = await User.findOne({
      'assignmentSubmissions._id': submissionId
    });
    
    if (!user) return res.status(404).json({ message: 'Submission not found' });
    
    const submission = user.assignmentSubmissions.id(submissionId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    
    submission.grade = grade;
    submission.feedback = feedback;
    await user.save();

    // Send email notification to student
    try {
      await sendEmail({
        to: user.email,
        subject: `Assignment Graded - ${submission.assignmentId}`,
        text: `
          Hello ${user.name},
          
          Your assignment has been graded:
          
          Grade: ${grade}%
          Feedback: ${feedback || 'No feedback provided'}
          
          You can view the full details in your learning dashboard.
          
          Best regards,
          EmpowerHer Learning Platform
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Assignment Graded</h2>
            <p>Hello ${user.name},</p>
            <p>Your assignment has been graded:</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Grade:</strong> ${grade}%</p>
              <p><strong>Feedback:</strong> ${feedback || 'No feedback provided'}</p>
            </div>
            <p>You can view the full details in your learning dashboard.</p>
            <p>Best regards,<br>EmpowerHer Learning Platform</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Failed to send grade notification email:', emailError);
      // Don't fail the grading if email fails
    }

    res.json({ message: 'Assignment graded successfully' });
  } catch (error) {
    console.error('Assignment grading error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get assignment submissions for an assignment
// @route   GET /api/assignments/:id/submissions
// @access  Private/Admin
const getAssignmentSubmissions = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // Find all users who submitted this assignment
    const users = await User.find({
      'assignmentSubmissions.assignmentId': assignment._id
    }).select('name email assignmentSubmissions');

    const submissions = users.map(user => {
      const submission = user.assignmentSubmissions.find(
        sub => sub.assignmentId.toString() === assignment._id.toString()
      );
      return {
        studentId: user._id,
        studentName: user.name,
        studentEmail: user.email,
        submission: submission
      };
    }).filter(item => item.submission);

    res.json({ submissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an assignment
// @route   PUT /api/assignments/:id
// @access  Private/Admin
const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    Object.assign(assignment, req.body);
    const updatedAssignment = await assignment.save();
    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an assignment
// @route   DELETE /api/assignments/:id
// @access  Private/Admin
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    
    await assignment.deleteOne();
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's assignment submissions
// @route   GET /api/assignments/submissions
// @access  Private
const getUserAssignmentSubmissions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('assignmentSubmissions.assignmentId');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ submissions: user.assignmentSubmissions || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { 
  createAssignment, 
  getAssignment, 
  submitAssignment, 
  gradeAssignment, 
  getAssignmentSubmissions, 
  updateAssignment, 
  deleteAssignment,
  getUserAssignmentSubmissions 
}; 