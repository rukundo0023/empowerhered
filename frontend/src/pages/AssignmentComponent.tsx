import { useEffect, useState } from 'react';
import api from '../api/axios';
import { uploadFile } from '../api/uploadService';
import type { Lesson } from '../types';

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate?: string;
  fileType?: string;
  fileUrl?: string;
  grade?: number;
  feedback?: string;
}

const AssignmentComponent = ({ lesson }: { lesson: Lesson }) => {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [grade, setGrade] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    // Use assignment from lesson.assignment
    if (lesson && lesson.assignment) {
      if (lesson.assignment) {
        setAssignment(lesson.assignment);
        if (lesson.assignment.grade) setGrade(lesson.assignment.grade);
        if (lesson.assignment.feedback) setFeedback(lesson.assignment.feedback);
      }
    } else {
      setAssignment(null);
    }
  }, [lesson]);

  const handleFileUpload = async (file: File): Promise<string> => {
    return await uploadFile(file, (progress) => {
      setUploadProgress(progress);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let fileUrl = '';
      
      // Upload file if provided
      if (file) {
        fileUrl = await handleFileUpload(file);
      }
      
      // Submit assignment
      const response = await api.post(`/assignments/${assignment._id}/submit`, {
        text,
        fileUrl,
      });
      
      setSubmitted(true);
      
      // Show success message
      console.log('Assignment submitted successfully:', response.data);
      
    } catch (error: any) {
      console.error('Assignment submission failed:', error);
      setError(error.response?.data?.message || 'Failed to submit assignment. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const isOverdue = () => {
    if (!assignment?.dueDate) return false;
    return new Date() > new Date(assignment.dueDate);
  };

  const formatDueDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!assignment) return <div className="text-gray-500 italic">No assignment for this lesson.</div>;
  
  if (submitted) {
    return (
      <div className="assignment-result bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-800 mb-2">Assignment Submitted!</h4>
        <div className="text-sm text-gray-600 mb-2">
          Submitted on: {new Date().toLocaleDateString()}
        </div>
        {grade !== null && (
          <div className="mb-2">
            <span className="font-semibold">Grade: </span>
            <span className="text-blue-600">{grade}%</span>
          </div>
        )}
        {feedback && (
          <div className="mt-3 p-3 bg-white border border-gray-200 rounded">
            <div className="font-semibold text-gray-700 mb-1">Feedback:</div>
            <div className="text-gray-600">{feedback}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="assignment-component bg-white border border-gray-200 rounded-lg p-6">
      <h4 className="font-bold text-xl mb-4 text-orange-800">{assignment.title}</h4>
      
      <div className="mb-4 text-gray-700">{assignment.description}</div>
      
      {assignment.dueDate && (
        <div className={`mb-4 p-3 rounded-lg ${
          isOverdue() ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
        }`}>
          <div className="font-semibold">
            {isOverdue() ? 'Overdue' : 'Due Date'}:
          </div>
          <div>{formatDueDate(assignment.dueDate)}</div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">
            Your Answer/Notes:
          </label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[120px]"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter your answer, notes, or explanation here..."
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">
            Attach File (Optional):
          </label>
          <input
            type="file"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={e => setFile(e.target.files?.[0] || null)}
            accept={assignment.fileType || "*/*"}
          />
          {assignment.fileType && (
            <div className="text-sm text-gray-500 mt-1">
              Accepted file type: {assignment.fileType}
            </div>
          )}
        </div>
        
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">Uploading file...</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{uploadProgress}%</div>
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading || !text.trim()}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            loading || !text.trim()
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-orange-600 hover:bg-orange-700 text-white'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit Assignment'}
        </button>
      </form>
      
      {assignment.fileUrl && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
          <div className="font-medium text-gray-700 mb-1">Assignment File:</div>
          <a 
            href={assignment.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-orange-600 hover:text-orange-700 underline"
          >
            Download Assignment File
          </a>
        </div>
      )}
    </div>
  );
};

export default AssignmentComponent; 