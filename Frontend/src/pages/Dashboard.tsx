import { useState, useEffect } from 'react'
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Eye, Bell, Settings, ChevronRight, Activity, DollarSign, PieChart, BarChart3, Clock } from 'lucide-react'
import KPICards from '../components/KPICards'
import AllocationChart from '../components/AllocationChart'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalValue: 5842500,
    dailyPnL: 12450,
    dailyPnLPercent: 2.15,
    riskScore: 72,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        dailyPnL: prev.dailyPnL + Math.random() * 1000 - 500,
        dailyPnLPercent: prev.dailyPnLPercent + (Math.random() - 0.5) * 0.1,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif;
        }
        
        .glass-card {
          background: rgba(17, 17, 17, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 69, 0, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .glass-card:hover {
          border-color: rgba(255, 69, 0, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(255, 69, 0, 0.1);
        }
        
        .gradient-border {
          position: relative;
          background: #111111;
          border-radius: 1rem;
        }
        
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(135deg, #FF4500, #FF6B35);
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }
        
        .gradient-border:hover::before {
          opacity: 1;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(255, 69, 0, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 69, 0, 0.5);
          }
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="mx-auto max-w-7xl p-6 space-y-8 animate-slide-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-8 bg-gradient-to-r from-[#FF4500] to-[#FF6B35] rounded-full"></div>
              <span className="text-xs font-medium text-[#FF4500] uppercase tracking-wider">Overview</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              Dashboard
            </h2>
            <p className="text-gray-400 mt-2">Welcome back! Here's your portfolio overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[#111111] border border-[#222222] rounded-full px-4 py-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-gray-400">Live Updates</span>
            </div>
            <button className="glass-card rounded-full p-2.5 hover:scale-105 transition-transform">
              <Bell className="h-4 w-4 text-[#FF4500]" />
            </button>
            <button className="glass-card rounded-full p-2.5 hover:scale-105 transition-transform">
              <Settings className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <KPICards {...metrics} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Portfolio Allocation</h3>
                <p className="text-xs text-gray-500 mt-1">Asset class distribution</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs text-gray-400 hover:text-[#FF4500] transition-colors">All Assets</button>
                <ChevronRight className="h-3 w-3 text-gray-500" />
              </div>
            </div>
            <AllocationChart />
          </div>

          {/* Quick Stats */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Market Overview</h3>
              <Activity className="h-4 w-4 text-[#FF4500]" />
            </div>
            <div className="space-y-3">
              {[
                { label: 'Portfolio Alpha', value: '+4.2%', trend: 'up', icon: TrendingUp },
                { label: 'Sharpe Ratio', value: '1.85', trend: 'up', icon: BarChart3 },
                { label: 'Max Drawdown', value: '-8.3%', trend: 'down', icon: TrendingDown },
                { label: 'Win Rate', value: '62%', trend: 'up', icon: PieChart }
              ].map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-black/40 transition-all duration-300 group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-[#FF4500]/10 p-2 group-hover:bg-[#FF4500]/20 transition-all">
                        <Icon className="h-4 w-4 text-[#FF4500]" />
                      </div>
                      <span className="text-sm text-gray-400">{stat.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${stat.value.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                        {stat.value}
                      </span>
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Additional Metrics */}
            <div className="mt-6 pt-4 border-t border-[#222222]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last Updated</span>
                <span className="text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Just now
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Top Holdings</h3>
              <p className="text-xs text-gray-500 mt-1">Your largest positions by value</p>
            </div>
            <button className="text-xs text-[#FF4500] hover:text-[#FF6B35] transition-colors flex items-center gap-1">
              View All
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#222222]">
                  <th className="text-left py-3 text-gray-500 font-medium">Symbol</th>
                  <th className="text-right py-3 text-gray-500 font-medium">Quantity</th>
                  <th className="text-right py-3 text-gray-500 font-medium">Price</th>
                  <th className="text-right py-3 text-gray-500 font-medium">Value</th>
                  <th className="text-right py-3 text-gray-500 font-medium">Change</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { symbol: 'RELIANCE', name: 'Reliance Industries', qty: 100, price: 2650, change: '+2.5%' },
                  { symbol: 'TCS', name: 'Tata Consultancy', qty: 50, price: 3820, change: '+1.2%' },
                  { symbol: 'INFY', name: 'Infosys Ltd', qty: 75, price: 1620, change: '+3.1%' },
                  { symbol: 'HUL', name: 'Hindustan Unilever', qty: 120, price: 2890, change: '-0.8%' }
                ].map((holding, idx) => (
                  <tr key={idx} className="border-b border-[#222222] hover:bg-black/40 transition-all duration-300 group cursor-pointer">
                    <td className="py-4">
                      <div>
                        <div className="font-semibold text-white">{holding.symbol}</div>
                        <div className="text-xs text-gray-500">{holding.name}</div>
                      </div>
                    </td>
                    <td className="text-right py-4 text-gray-300">{holding.qty}</td>
                    <td className="text-right py-4 text-gray-300">₹{holding.price.toLocaleString()}</td>
                    <td className="text-right py-4">
                      <span className="font-semibold text-white">₹{(holding.qty * holding.price).toLocaleString()}</span>
                    </td>
                    <td className="text-right py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        holding.change.startsWith('-') 
                          ? 'bg-red-500/10 text-red-500' 
                          : 'bg-green-500/10 text-green-500'
                      }`}>
                        {holding.change.startsWith('-') ? (
                          <ArrowDownRight className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                        {holding.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Summary Row */}
          <div className="mt-6 pt-4 border-t border-[#222222] flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-500">4 holdings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#FF4500]"></div>
                <span className="text-xs text-gray-500">Total value: ₹58.4L</span>
              </div>
            </div>
            <button className="text-xs text-[#FF4500] hover:text-[#FF6B35] transition-colors flex items-center gap-1">
              Export Report
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}