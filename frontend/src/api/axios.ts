import axios from 'axios';

// In production, use relative URLs since backend serves both API and frontend
// In development, use localhost
const API_URL = import.meta.env.PROD 
  ? '/api' 
  : (import.meta.env.VITE_API_URL || `http://localhost:${import.meta.env.VITE_API_PORT || 5000}/api`);

console.log('Environment:', import.meta.env.MODE);
console.log('API URL configured as:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased to 30 seconds
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const { token } = JSON.parse(user);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response || error);

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }

    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    const status = error.response.status;
    const message = error.response.data?.message || 'An error occurred';

    switch (status) {
      case 401:
        localStorage.removeItem('user');
        return Promise.reject(new Error(message));
      case 403:
        return Promise.reject(new Error('You do not have permission to perform this action.'));
      case 404:
        return Promise.reject(new Error('The requested resource was not found.'));
      case 500:
        return Promise.reject(new Error('Server error. Please try again later.'));
      default:
        return Promise.reject(new Error(message));
    }
  }
);

export default api;
