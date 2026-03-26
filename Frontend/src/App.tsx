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

  // Routes where sidebar and header should be hidden
  const noLayoutRoutes = ['/Signin', '/Signup', '/Privacy', '/Terms']
  const hideLayout = noLayoutRoutes.includes(location.pathname)

  // If it's a no-layout route, just render children without sidebar/header
  if (hideLayout) {
    return <>{children}</>
  }

  // Default layout with sidebar and header for authenticated pages
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
