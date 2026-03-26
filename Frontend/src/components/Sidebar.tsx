import { BarChart3, PieChart, TrendingUp, Activity, Brain, RefreshCw, Settings, ChevronRight, X } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const menuItems = [
  { label: 'Overview', icon: BarChart3, href: '/dashboard' },
  { label: 'Portfolio Allocation', icon: PieChart, href: '/allocation' },
  { label: 'Performance Analytics', icon: TrendingUp, href: '/analytics' },
  { label: 'Backtesting Suite', icon: Activity, href: '/backtesting' },
  { label: 'AI Insights', icon: Brain, href: '/insights' },
  { label: 'Rebalance Center', icon: RefreshCw, href: '/rebalance' },
]

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 h-[calc(100vh-64px)] border-r border-[#222222] bg-black transition-all duration-300 z-40 ${
        collapsed ? 'w-20' : 'w-64'
      } ${isMobile && !isOpen ? '-translate-x-full' : ''} md:translate-x-0`}>
        <div className="flex h-full flex-col">
          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={onToggle}
              className="absolute top-4 right-4 md:hidden text-gray-500 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 p-4 mt-8 md:mt-0">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => isMobile && onToggle()}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all duration-200 ${
                    isActive
                      ? 'bg-[#FF4500] text-white'
                      : 'text-gray-500 hover:bg-white/5 hover:text-white'
                  } ${collapsed ? 'justify-center px-2' : ''}`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-[#222222] p-4 space-y-3">
            {/* Settings */}
            <Link
              to="/settings"
              onClick={() => isMobile && onToggle()}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-gray-500 transition-all duration-200 hover:bg-white/5 hover:text-white ${collapsed ? 'justify-center px-2' : ''}`}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">Settings</span>}
            </Link>

            {/* API Status */}
            <div className={`flex items-center gap-2 pt-2 ${collapsed ? 'justify-center' : 'px-2'}`}>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              {!collapsed && (
                <span className="text-xs text-gray-500">Connected</span>
              )}
            </div>
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-full items-center justify-center border-t border-[#222222] p-4 text-gray-500 hover:text-white transition-colors"
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </aside>
    </>
  )
}