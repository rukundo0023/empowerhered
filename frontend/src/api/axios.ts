import axios from 'axios';

const API_PORT = import.meta.env.VITE_API_PORT || 5000;
const API_URL = `http://localhost:${API_PORT}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true
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

    // Handle specific error cases
    const status = error.response.status;
    const message = error.response.data?.message || 'An error occurred';

    switch (status) {
      case 401:
        // Clear user data on authentication errors
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