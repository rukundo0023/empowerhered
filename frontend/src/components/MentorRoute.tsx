import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface MentorRouteProps {
  children: React.ReactNode;
}

const MentorRoute: React.FC<MentorRouteProps> = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'mentor') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default MentorRoute; 