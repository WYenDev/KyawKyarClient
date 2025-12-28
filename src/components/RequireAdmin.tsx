import React, { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  children: ReactNode;
}

const RequireAdmin: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const { authLoading, accessToken, needPasswordChange } = useAuth();
  
  if (authLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // If user must change password, redirect to change page first
  if (needPasswordChange) {
    return <Navigate to="/admin/password-change" replace />;
  }

  if (!accessToken) {
    console.log('No access token found, redirecting to login.', accessToken);
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
