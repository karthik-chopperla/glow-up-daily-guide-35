import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'patient' | 'doctor' | 'pharmacy_partner' | 'elder_expert' | 'nurse' | 'user' | 'partner';
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

  // If not authenticated, redirect to welcome
  if (!user) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  // If authenticated but no role, redirect to role selection
  if (!profile?.role && location.pathname !== '/role-selection') {
    return <Navigate to="/role-selection" replace />;
  }

  // If role is required and doesn't match, redirect to appropriate dashboard
  if (requireRole && profile?.role) {
    // Check for role compatibility (backward compatibility)
    const isRoleMatch = 
      requireRole === profile.role ||
      (requireRole === 'user' && profile.role === 'patient') ||
      (requireRole === 'partner' && ['doctor', 'pharmacy_partner', 'elder_expert', 'nurse'].includes(profile.role));

    if (!isRoleMatch) {
      if (profile.role === 'patient') {
        return <Navigate to="/patient-dashboard" replace />;
      } else if (['doctor', 'pharmacy_partner', 'elder_expert', 'nurse'].includes(profile.role)) {
        return <Navigate to="/partner-dashboard" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;