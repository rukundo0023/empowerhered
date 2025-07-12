import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  getMyCertificates, 
  downloadCertificate, 
} from '../api/certificateService';
import type { Certificate } from '../api/certificateService';
import { 
  FaDownload, 
  FaEye, 
  FaTrophy, 
  FaGraduationCap, 
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle
} from 'react-icons/fa';

const Certificates: React.FC = () => {

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const data = await getMyCertificates();
      setCertificates(data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificateId: string) => {
    try {
      await downloadCertificate(certificateId);
      toast.success('Certificate downloaded successfully');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Failed to download certificate');
    }
  };

  const handleViewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowModal(true);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'Honors': return 'text-yellow-600 bg-yellow-100';
      case 'Distinction': return 'text-purple-600 bg-purple-100';
      case 'Merit': return 'text-blue-600 bg-blue-100';
      case 'Pass': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <FaCheckCircle className="text-green-500" />;
      case 'expired': return <FaClock className="text-yellow-500" />;
      case 'revoked': return <FaExclamationTriangle className="text-red-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-yellow-600 bg-yellow-100';
      case 'revoked': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg p-8 mb-8">
          <div className="flex items-center gap-4">
            <FaTrophy className="text-4xl text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-blue-900">My Certificates</h1>
              <p className="text-blue-800 mt-2">
                View and download your course completion certificates
              </p>
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <div className="text-center py-12">
            <FaGraduationCap className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No certificates yet
            </h3>
            <p className="text-gray-500">
              Complete courses to earn certificates. Your achievements will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <div
                key={certificate._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Certificate Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Certificate</span>
                    {getStatusIcon(certificate.status)}
                  </div>
                  <h3 className="text-lg font-bold mb-1">{certificate.course.title}</h3>
                  <p className="text-blue-100 text-sm">{certificate.certificateNumber}</p>
                </div>

                {/* Certificate Body */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getGradeColor(certificate.grade)}`}>
                      {certificate.grade}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(certificate.status)}`}>
                      {certificate.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Final Score</p>
                      <p className="text-2xl font-bold text-gray-900">{certificate.finalScore}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Issued Date</p>
                      <p className="text-gray-900">
                        {new Date(certificate.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valid Until</p>
                      <p className="text-gray-900">
                        {new Date(certificate.validUntil).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewCertificate(certificate)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaEye className="text-sm" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownload(certificate._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FaDownload className="text-sm" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificate Detail Modal */}
      {showModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Certificate Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Certificate Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Certificate Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Certificate Number</p>
                      <p className="font-medium">{selectedCertificate.certificateNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-medium">{selectedCertificate.status}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Grade</p>
                      <p className="font-medium">{selectedCertificate.grade}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Final Score</p>
                      <p className="font-medium">{selectedCertificate.finalScore}%</p>
                    </div>
                  </div>
                </div>

                {/* Course Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Course Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-500">Course Title</p>
                      <p className="font-medium">{selectedCertificate.course.title}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Level</p>
                      <p className="font-medium">{selectedCertificate.course.level}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Category</p>
                      <p className="font-medium">{selectedCertificate.course.category}</p>
                    </div>
                  </div>
                </div>

                {/* Performance Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Performance Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Total Lessons</p>
                      <p className="font-medium">{selectedCertificate.metadata.totalLessons}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Completed Lessons</p>
                      <p className="font-medium">{selectedCertificate.metadata.completedLessons}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Quiz Attempts</p>
                      <p className="font-medium">{selectedCertificate.metadata.quizScores.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Assignments</p>
                      <p className="font-medium">{selectedCertificate.metadata.assignmentScores.length}</p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Important Dates</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Issue Date</p>
                      <p className="font-medium">
                        {new Date(selectedCertificate.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Completion Date</p>
                      <p className="font-medium">
                        {new Date(selectedCertificate.completionDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Valid Until</p>
                      <p className="font-medium">
                        {new Date(selectedCertificate.validUntil).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Issued By</p>
                      <p className="font-medium">{selectedCertificate.issuedBy.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleDownload(selectedCertificate._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaDownload className="text-sm" />
                  Download PDF
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates; 