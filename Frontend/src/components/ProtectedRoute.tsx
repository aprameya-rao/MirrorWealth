import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // 1. If they aren't logged in, send them straight to the Signup page
  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }

  // 2. The Gatekeeper Check:
  // If the user object exists, but lacks the RRA coefficient (e.g., null or undefined)
  const isMissingCoefficient = user && (user.rra_coefficient === null || user.rra_coefficient === undefined);

  // If they are missing it, AND they aren't currently on the questionnaire page, route them there
  if (isMissingCoefficient && location.pathname !== '/questionnaire') {
    return <Navigate to="/questionnaire" replace />;
  }

  // 3. Otherwise, let them see the protected page
  return <>{children}</>;
}