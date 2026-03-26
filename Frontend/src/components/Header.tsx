import { Bell, Search, User, Settings, Menu } from 'lucide-react'
import { useState } from 'react'

import logo from '../pages/logo.png'
interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)

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

        {/* Search Bar */}
        <div className="hidden flex-1 mx-12 sm:flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              type="search"
              placeholder="Search assets, accounts..."
              className="w-full bg-card border border-border rounded-lg py-2 pl-10 pr-4 text-sm text-foreground placeholder-text-secondary focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button className="relative p-2 text-text-secondary hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full"></span>
            </button>
          </div>

          {/* Settings */}
          <button className="p-2 text-text-secondary hover:text-foreground transition-colors">
            <Settings className="h-5 w-5" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="text-right">
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
