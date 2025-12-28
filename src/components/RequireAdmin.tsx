import React, { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  children: ReactNode;
}

const RequireAdmin: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const { authLoading, accessToken } = useAuth();
  
  if (authLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!accessToken ) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
