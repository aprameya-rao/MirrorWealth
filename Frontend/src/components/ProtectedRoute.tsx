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