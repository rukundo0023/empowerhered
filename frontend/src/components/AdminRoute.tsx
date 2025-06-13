import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('AdminRoute - Checking auth state:', { 
        isAuthenticated, 
        userRole: user?.role,
        path: location.pathname 
      });

      if (!isAuthenticated || !user) {
        console.log('AdminRoute - Not authenticated');
        setIsAdmin(false);
        setIsChecking(false);
        return;
      }

      if (user.role !== 'admin') {
        console.log('AdminRoute - Not admin');
        setIsAdmin(false);
        setIsChecking(false);
        return;
      }

      console.log('AdminRoute - Admin access confirmed');
      setIsAdmin(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, user, location]);

  if (isChecking) {
    console.log('AdminRoute - Checking authentication...');
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('AdminRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    console.log('AdminRoute - Not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('AdminRoute - Admin access granted, rendering admin panel');
  return <>{children}</>;
};

export default AdminRoute; 