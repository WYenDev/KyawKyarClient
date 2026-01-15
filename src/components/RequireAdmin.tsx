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
    // Avoid redirect loop if already on login page
    if (!location.pathname.startsWith('/admin/login')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // If we're already on the login page, render nothing here so the login
    // route/component can render separately (RequireAdmin normally isn't
    // mounted on the login page, but this guard keeps behavior safe).
    return null;
  }

  // If user must change password, redirect to change page first
  if (user.needPasswordChange) {
    // Avoid redirecting if already on the password-change page
    if (!location.pathname.startsWith('/admin/password-change')) {
      return <Navigate to="/admin/password-change" replace />;
    }

    return null;
  }

  if (user.resetPassword) {
    if (!location.pathname.startsWith('/admin/rest-password')) {
      return <Navigate to="/admin/reset-password" state={{ from: location }} replace />;
    }
    
  }

  // If super admin hasn't saved recovery codes, redirect them to setup
  // but avoid redirecting if they're already on the setup page (prevents loop).
  if (
    user.role === "SUPER_ADMIN" &&
    user.recoverCodesSaved === false &&
    !location.pathname.startsWith('/admin/recover-codes-setup')
  ) {
    return <Navigate to="/admin/recover-codes-setup" replace />;
  }

  if (!user.accessToken) {
    console.log('No access token found, redirecting to login.');
    if (!location.pathname.startsWith('/admin/login')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return null;
  }

  return <>{children}</>;
};

export default RequireAdmin;
