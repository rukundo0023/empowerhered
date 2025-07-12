import api from './axios';

export interface Certificate {
  _id: string;
  certificateNumber: string;
  student: {
    _id: string;
    name: string;
    email: string;
  };
  course: {
    _id: string;
    title: string;
    description: string;
    level: string;
    category: string;
  };
  issueDate: string;
  completionDate: string;
  grade: 'Pass' | 'Merit' | 'Distinction' | 'Honors';
  finalScore: number;
  status: 'active' | 'revoked' | 'expired';
  validUntil: string;
  certificateUrl?: string;
  issuedBy: {
    _id: string;
    name: string;
  };
  metadata: {
    totalLessons: number;
    completedLessons: number;
    quizScores: Array<{
      quizId: string;
      score: number;
      total: number;
    }>;
    assignmentScores: Array<{
      assignmentId: string;
      score: number;
      total: number;
    }>;
  };
}

export interface CertificateVerification {
  valid: boolean;
  certificate: {
    certificateNumber: string;
    studentName: string;
    courseTitle: string;
    issueDate: string;
    completionDate: string;
    grade: string;
    finalScore: number;
    issuedBy: string;
    status: string;
    validUntil: string;
  };
}

// Generate certificate for course completion
export const generateCertificate = async (courseId: string): Promise<{ message: string; certificate: Certificate }> => {
  const response = await api.post('/certificates/generate', { courseId });
  return response.data;
};

// Get user's certificates
export const getMyCertificates = async (): Promise<Certificate[]> => {
  const response = await api.get('/certificates/my-certificates');
  return response.data;
};

// Get certificate by ID
export const getCertificateById = async (certificateId: string): Promise<Certificate> => {
  const response = await api.get(`/certificates/${certificateId}`);
  return response.data;
};

// Download certificate PDF
export const downloadCertificate = async (certificateId: string): Promise<void> => {
  const response = await api.get(`/certificates/${certificateId}/download`, {
    responseType: 'blob',
  });
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `certificate-${certificateId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Verify certificate (public endpoint)
export const verifyCertificate = async (certificateNumber: string): Promise<CertificateVerification> => {
  const response = await api.get(`/certificates/verify/${certificateNumber}`);
  return response.data;
};

// Check if user can generate certificate for a course
export const canGenerateCertificate = async (courseId: string): Promise<{ canGenerate: boolean; reason?: string; currentProgress?: number }> => {
  try {
    const response = await api.post('/certificates/generate', { courseId });
    return { canGenerate: true };
  } catch (error: any) {
    if (error.response?.status === 400) {
      return {
        canGenerate: false,
        reason: error.response.data.message,
        currentProgress: error.response.data.currentProgress,
      };
    }
    throw error;
  }
}; 