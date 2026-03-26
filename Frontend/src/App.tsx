// src/App.tsx
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

interface AppProps {
  children: React.ReactNode
}

export default function App({ children }: AppProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  // Converted to lowercase to safely match the route
  // Converted to lowercase to match the React Router paths safely
  const noLayoutRoutes = ['/signin', '/signup', '/privacy', '/terms']
  const hideLayout = noLayoutRoutes.includes(location.pathname.toLowerCase())

  if (hideLayout) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto bg-background text-foreground">
          {children}
        </main>
      </div>
    </div>
  )
}