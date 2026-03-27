import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // 1. Wait for auth context to finish loading (prevents flickering)
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#FF4500]"></div>
      </div>
    );
  }

  // 2. TRAP 1: Not logged in? Kick to signin
  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // 3. TRAP 2: RRA Check
  // Consider them "missing" an RRA if it's null, undefined, or 0
  const hasNoRRA = !user.rra_coefficient || user.rra_coefficient === 0;

  // If they have NO RRA and are trying to access the dashboard (or anywhere else), force them to the questionnaire
  if (hasNoRRA && location.pathname !== '/questionnaire') {
    return <Navigate to="/questionnaire" replace />;
  }

  // If they ALREADY HAVE an RRA, don't let them retake the questionnaire
  if (!hasNoRRA && location.pathname === '/questionnaire') {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. All checks passed, render the page!
  return <>{children}</>;
}