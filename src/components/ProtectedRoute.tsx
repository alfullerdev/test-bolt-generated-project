import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { UserType } from '../types';

interface Props {
  children: React.ReactNode;
  allowedTypes?: UserType[];
}

export function ProtectedRoute({ children, allowedTypes }: Props) {
  const { auth } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to sign in
  if (!auth) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If user type not allowed, redirect to appropriate dashboard
  if (allowedTypes && !allowedTypes.includes(auth.type)) {
    switch (auth.type) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'vendor':
        return <Navigate to="/vendor/dashboard" replace />;
      default:
        return <Navigate to="/user/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
