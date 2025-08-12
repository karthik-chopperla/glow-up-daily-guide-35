import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'user' | 'partner';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireRole }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to auth
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If authenticated but no role, redirect to role selection
  if (!profile?.role && location.pathname !== '/role-selection') {
    return <Navigate to="/role-selection" replace />;
  }

  // If role is required and doesn't match, redirect to appropriate dashboard
  if (requireRole && profile?.role !== requireRole) {
    if (profile?.role === 'user') {
      return <Navigate to="/home" replace />;
    } else if (profile?.role === 'partner') {
      return <Navigate to="/partner-dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;