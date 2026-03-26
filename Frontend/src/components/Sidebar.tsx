import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Activity, 
  Brain, 
  RefreshCw, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'

export default function Sidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }): JSX.Element {
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const activeView = isMobile ? isOpen : isExpanded

  return (
    <>
      {/* BLUR OVERLAY - Fades in/out at the same speed as the sidebar */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-[25px] z-40 transition-opacity duration-500 ease-in-out ${
          activeView ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* SIDEBAR - Uses cubic-bezier for a "premium" feel during open/close */}
      <aside className={`fixed left-0 top-0 h-screen border-r border-white/10 bg-black transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-50 ${
        activeView ? 'w-80' : 'w-24'
      } ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}`}>
        
        <div className="flex h-full flex-col overflow-hidden">
          
          {/* HEADER - Text and Button layout */}
          <div className={`flex items-center h-40 pt-16 px-6 transition-all duration-500 ${activeView ? 'justify-between' : 'justify-center'}`}>
            <div className={`flex flex-col transition-all duration-500 overflow-hidden ${activeView ? 'w-48 opacity-100' : 'w-0 opacity-0'}`}>
              <span className="font-black text-white text-xl tracking-tighter whitespace-nowrap">PLATFORM</span>
              <span className="text-[10px] text-[#FF4500] font-bold tracking-[0.4em] uppercase opacity-90 whitespace-nowrap">Intelligence</span>
            </div>
            
            <button
              onClick={() => (isMobile ? onToggle() : setIsExpanded(!isExpanded))}
              className="p-3 rounded-2xl text-white hover:bg-white/10 transition-colors duration-300 flex-shrink-0"
            >
              {activeView ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 px-4 space-y-4 mt-8 overflow-y-auto no-scrollbar">
            {[
              { label: 'Overview', icon: BarChart3, href: '/dashboard' },
              { label: 'Portfolio', icon: PieChart, href: '/allocation' },
              { label: 'Analytics', icon: TrendingUp, href: '/analytics' },
              { label: 'Backtesting', icon: Activity, href: '/backtesting' },
              { label: 'AI Insights', icon: Brain, href: '/insights' },
              { label: 'Rebalance', icon: RefreshCw, href: '/rebalance' },
            ].map((item) => {
               const isActive = location.pathname === item.href
               return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => isMobile && onToggle()}
                  className={`flex items-center transition-all duration-500 rounded-2xl group relative ${
                    activeView ? 'px-6 py-4 gap-5' : 'justify-center py-4'
                  } ${
                    isActive 
                      ? 'bg-[#FF4500] text-white shadow-lg shadow-[#FF4500]/20' 
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  <item.icon size={22} className="flex-shrink-0" />
                  
                  {/* Text Container - Animate width and opacity for smooth closing */}
                  <div className={`transition-all duration-500 overflow-hidden ${activeView ? 'w-40 opacity-100' : 'w-0 opacity-0'}`}>
                    <span className="text-sm font-bold tracking-tight whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                </Link>
               )
            })}
          </nav>

          {/* FOOTER */}
          <div className="p-4 border-t border-white/5 pb-10">
            <Link 
              to="/settings" 
              className={`flex items-center text-gray-500 hover:text-white transition-all duration-500 ${
                activeView ? 'px-6 py-4 gap-5' : 'justify-center py-4'
              }`}
            >
              <Settings size={22} className="flex-shrink-0" />
              <div className={`transition-all duration-500 overflow-hidden ${activeView ? 'w-40 opacity-100' : 'w-0 opacity-0'}`}>
                <span className="text-sm font-bold whitespace-nowrap">Settings</span>
              </div>
            </Link>
            
            <button 
              className={`flex items-center w-full mt-2 text-rose-500 transition-all duration-500 overflow-hidden ${
                activeView 
                ? 'px-6 py-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 gap-5' 
                : 'justify-center py-4'
              }`}
            >
              <LogOut size={22} className="flex-shrink-0" />
              <div className={`transition-all duration-500 overflow-hidden ${activeView ? 'w-40 opacity-100' : 'w-0 opacity-0'}`}>
                <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">Logout</span>
              </div>
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  )
}