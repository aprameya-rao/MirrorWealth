import React, { useState } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext' // Ensure this path is correct
import Sidebar from './components/Sidebar'
import Header from './components/Header'

interface AppProps {
  children: React.ReactNode
}

/**
 * Navigation Guard: FlowController
 * Logic: 
 * 1. If not authenticated -> Redirect to /signin
 * 2. If authenticated but RRA is 0/null -> Force to /questionnaire
 * 3. If authenticated and RRA > 0 -> Allow access to Dashboard
 */
const FlowController = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Prevent flicker while checking auth status
  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  // 1. Check Authentication
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // 2. Check RRA Status
  // If the user is NOT on the questionnaire page and has no RRA, force them there
  const hasNoRRA = !user.rra_coefficient || user.rra_coefficient === 0;
  if (hasNoRRA && location.pathname.toLowerCase() !== '/questionnaire') {
    return <Navigate to="/questionnaire" replace />;
  }

  // 3. Prevent access to Questionnaire if they ALREADY have an RRA
  if (!hasNoRRA && location.pathname.toLowerCase() === '/questionnaire') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default function App({ children }: AppProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const { user } = useAuth();

  const noLayoutRoutes = ['/signin', '/signup', '/privacy', '/terms']
  const hideLayout = noLayoutRoutes.includes(location.pathname.toLowerCase())

  // If it's a login/signup page, just render children without Sidebar/Header
  if (hideLayout) {
    return <>{children}</>
  }

  return (
    <FlowController>
      <div className="flex h-screen bg-background">
        {/* Only show Sidebar/Header if the user is fully authorized (RRA > 0) 
            or if you want them visible during the questionnaire */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
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