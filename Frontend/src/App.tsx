import React, { useState } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

interface AppProps {
  children: React.ReactNode
}

/**
 * Simple FlowController
 * ONLY checks authentication
 * No user / RRA logic
 */
const FlowController = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Optional loader (safe to keep)
  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  // 🔥 Step 1: must be logged in
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // 🔥 Step 2: user must exist (now it WILL exist)
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // 🔥 Step 3: optional — questionnaire logic (now safe)
  const hasNoRRA = !user.rra_coefficient || user.rra_coefficient === 0;

  if (hasNoRRA && location.pathname !== '/questionnaire') {
    return <Navigate to="/questionnaire" replace />;
  }

  if (!hasNoRRA && location.pathname === '/questionnaire') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default function App({ children }: AppProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  const noLayoutRoutes = ['/signin', '/signup', '/privacy', '/terms']
  const hideLayout = noLayoutRoutes.includes(location.pathname.toLowerCase())

  // No layout for auth/public pages
  if (hideLayout) {
    return <>{children}</>
  }

  return (
    <FlowController>
      <div className="flex h-screen bg-background">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

          <main className="flex-1 overflow-auto bg-background text-foreground">
            {children}
          </main>
        </div>
      </div>
    </FlowController>
  )
}