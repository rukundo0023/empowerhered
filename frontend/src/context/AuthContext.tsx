import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  role: string;
  gender?: string;
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  gender: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  signup: (data: SignupData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');
    
    if (storedAuth === 'true' && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const signup = async (data: SignupData) => {
    try {
      // Here you would typically make an API call to your backend
      // For now, we'll simulate a successful signup
      const userData: User = {
        name: data.fullName,
        email: data.email,
        role: data.role, // Use the selected role
        gender: data.gender,
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store user data and log them in
      const token = 'dummy-token'; // In a real app, this would come from your backend
      login(userData, token);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Failed to sign up. Please try again.');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 