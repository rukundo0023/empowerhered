import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  gender: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;  // indicate loading auth status
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // initially loading true
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize auth state synchronously from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'admin');
      } catch (error) {
        console.error('Failed to parse user from storage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } else {
      // No stored user/token: clear state
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }

    setLoading(false); // done reading storage
  }, []);

  // Validate token by calling /users/me, but only if user is set and not already validated
  useEffect(() => {
    const validateToken = async () => {
      if (!user || !localStorage.getItem('token')) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await api.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Only update if the data has changed
        if (JSON.stringify(response.data) !== JSON.stringify(user)) {
          setUser(response.data);
          setIsAuthenticated(true);
          setIsAdmin(response.data.role === 'admin');
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);

        // If user is on protected route, redirect to login
        if (location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
      }
    };

    validateToken();
  }, [navigate, location.pathname]); // Remove user from dependencies

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsAdmin(userData.role === 'admin');
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/dashboard'); // you can customize this based on role
    toast.success('Logged in successfully!');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    window.location.href = '/login';
  };

  if (loading) {
    // Show loading spinner or empty fragment while loading auth state
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
