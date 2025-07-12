import api from './axios';

export const uploadFile = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });

  return response.data.fileUrl;
};

export const getFileUrl = (filename: string): string => {
  return `${api.defaults.baseURL}/uploads/${filename}`;
}; 