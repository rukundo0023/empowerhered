import api from './axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  gender: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  gender: string;
  token: string;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role: string;
  gender: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        gender: response.data.gender
      }));
    }
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Login failed';
  }
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      // Format the data according to backend expectations
      const formattedData = {
        name: userData.fullName,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'student',
        gender: userData.gender
      };

      console.log('Sending registration request with data:', formattedData);

      const response = await api.post<AuthResponse>('/users/register', formattedData);
      
      console.log('Registration response:', response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          gender: response.data.gender
        }));
      }
      return response.data;
    } catch (error: any) {
      console.error(`Registration attempt ${retryCount + 1} failed:`, error);
      
      if (retryCount === maxRetries - 1) {
        // On last retry, throw the error
        const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
        throw new Error(errorMessage);
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      retryCount++;
    }
  }

  throw new Error('Registration failed after multiple attempts');
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/users/me');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to get user profile';
  }
};

export const updateProfile = async (userData: Partial<User>): Promise<AuthResponse> => {
  try {
    const response = await api.put<AuthResponse>('/users/profile', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        gender: response.data.gender
      }));
    }
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to update profile';
  }
}; 