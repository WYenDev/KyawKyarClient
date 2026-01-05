import React, { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  children: ReactNode;
}

const RequireAdmin: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const { authLoading, user } = useAuth();
  
  if (authLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If user must change password, redirect to change page first
  if (user.needPasswordChange) {
    return <Navigate to="/admin/password-change" replace />;
  }

  if (!user.accessToken) {
    console.log('No access token found, redirecting to login.');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
