import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  children: ReactNode;
}

const SuperAdminGuard: React.FC<Props> = ({ children }) => {
  const { authLoading,  user } = useAuth();
  
  if (authLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (user?.role !== 'SUPER_ADMIN') {
    console.log('User is not super-admin, redirecting to admin dashboard.', user);
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default SuperAdminGuard;
