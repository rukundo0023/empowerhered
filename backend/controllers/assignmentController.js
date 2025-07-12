import Assignment from '../models/assignmentModel.js';
import User from '../models/userModel.js';
import Course from '../models/courseModel.js';
import { sendEmail } from '../utils/sendEmail.js';

// @desc    Create an assignment
// @route   POST /api/assignments
// @access  Private/Admin/Instructor
const createAssignment = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      instructions, 
      dueDate, 
      course, 
      moduleId, 
      lessonId, 
      totalPoints,
      fileType,
      maxFileSize,
      allowTextSubmission,
      allowFileSubmission,
      gradingCriteria 
    } = req.body;

    // Validate required fields
    if (!title || !description || !dueDate || !course) {
      return res.status(400).json({ message: 'Title, description, due date, and course are required' });
    }

    // Validate course exists
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const assignment = await Assignment.create({
      title,
      description,
      instructions,
      dueDate: new Date(dueDate),
      course,
      moduleId,
      lessonId,
      totalPoints: totalPoints || 100,
      fileType: fileType || 'any',
      maxFileSize: maxFileSize || 10,
      allowTextSubmission: allowTextSubmission !== false,
      allowFileSubmission: allowFileSubmission !== false,
      gradingCriteria: gradingCriteria || [],
      createdBy: req.user._id
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error('Assignment creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all assignments for a course
// @route   GET /api/assignments/course/:courseId
// @access  Private
const getAssignmentsByCourse = async (req, res) => {
  try {
    const assignments = await Assignment.find({ 
      course: req.params.courseId,
      isActive: true 
    }).populate('createdBy', 'name');
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get assignments for a specific lesson
// @route   GET /api/assignments/lesson/:courseId/:moduleId/:lessonId
// @access  Private
const getAssignmentsByLesson = async (req, res) => {
  try {
    const { courseId, moduleId, lessonId } = req.params;
    
    const assignments = await Assignment.find({ 
      course: courseId,
      moduleId,
      lessonId,
      isActive: true 
    }).populate('createdBy', 'name');
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get an assignment
// @route   GET /api/assignments/:id
// @access  Private
const getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('course', 'title')
      .populate('createdBy', 'name');
      
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

    // Validate submission requirements
    if (!text && !fileUrl) {
      return res.status(400).json({ message: 'Either text or file submission is required' });
    }

    if (text && !assignment.allowTextSubmission) {
      return res.status(400).json({ message: 'Text submission is not allowed for this assignment' });
    }

    if (fileUrl && !assignment.allowFileSubmission) {
      return res.status(400).json({ message: 'File submission is not allowed for this assignment' });
    }

    // Check if assignment is past due
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const isLate = now > dueDate;

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
      submittedAt: new Date(),
      status: isLate ? 'late' : 'submitted'
    });

    await user.save();

    // Send email notification to instructor
    try {
      const instructor = await User.findById(assignment.createdBy);
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
            Status: ${isLate ? 'LATE' : 'On Time'}
            
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
                <p><strong>Status:</strong> <span style="color: ${isLate ? '#dc2626' : '#059669'}">${isLate ? 'LATE' : 'On Time'}</span></p>
              </div>
              <p>Please review the submission at your earliest convenience.</p>
              <p>Best regards,<br>EmpowerHer Learning Platform</p>
            </div>
          `
        });
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the submission if email fails
    }

    res.json({ 
      message: isLate ? 'Assignment submitted successfully (late)' : 'Assignment submitted successfully',
      submissionId: user.assignmentSubmissions[user.assignmentSubmissions.length - 1]._id,
      isLate
    });
  } catch (error) {
    console.error('Assignment submission error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade an assignment submission
// @route   POST /api/assignments/:id/grade
// @access  Private/Admin/Instructor
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
    submission.gradedBy = req.user._id;
    submission.gradedAt = new Date();
    submission.status = 'graded';
    
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
// @access  Private/Admin/Instructor
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
// @access  Private/Admin/Instructor
const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    
    // Check if user can edit this assignment
    if (assignment.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this assignment' });
    }
    
    Object.assign(assignment, req.body);
    const updatedAssignment = await assignment.save();
    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an assignment
// @route   DELETE /api/assignments/:id
// @access  Private/Admin/Instructor
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    
    // Check if user can delete this assignment
    if (assignment.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this assignment' });
    }
    
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

    res.json({ assignmentSubmissions: user.assignmentSubmissions || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { 
  createAssignment, 
  getAssignment, 
  getAssignmentsByCourse,
  getAssignmentsByLesson,
  submitAssignment, 
  gradeAssignment, 
  getAssignmentSubmissions,
  getUserAssignmentSubmissions,
  updateAssignment, 
  deleteAssignment 
}; 