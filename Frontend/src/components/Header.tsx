// src/components/Header.tsx
import { Bell, Search, User, Settings, Menu, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../pages/logo.png'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  
  // Bring in auth context and navigation
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/signin') // Redirect to sign-in page immediately
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* Menu Button */}
        <button onClick={onMenuClick} className="md:hidden p-2 text-text-secondary hover:text-foreground transition-colors">
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <img src={logo} alt="MirrorWealth Logo" className="w-7 h-7 object-cover" />
          </div>
          <h1 className="text-lg font-bold text-foreground">MirrorWealth</h1>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 text-sm text-text-secondary hover:text-[#FF4500] transition-colors"
            title="Log Out"
          >
            <LogOut className="h-5 w-5" />
            <span className="hidden sm:inline font-medium">Log Out</span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="text-right hidden sm:block">
              {/* Note: This is currently hardcoded. We can make this dynamic next! */}
              <p className="text-sm font-medium text-foreground">John Doe</p>
              <p className="text-xs text-text-secondary">Premium</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center">
              <User className="h-4 w-4 text-foreground" />
            </div>
          </div>
          
        </div>
      </div>
    </header>
  )
}