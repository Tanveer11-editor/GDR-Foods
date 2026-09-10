import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../store/useAdminAuth';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { isAdminLoggedIn } = useAdminAuth();

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};
