import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  // If the user isn't logged in, redirect them immediately to /signin
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Otherwise, let them see the protected page
  return <>{children}</>;
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  // If they aren't logged in, send them straight to the Signup page
  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />
  }

  return <>{children}</>
}