import { useState, useEffect } from 'react'
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Activity,
  DollarSign,
  PieChart,
  BarChart3,
  Brain,
  Shield,
  Clock,
  Zap,
  Play,
} from 'lucide-react'
import KPICards from '../components/KPICards'
import AllocationChart from '../components/AllocationChart'
import { Link } from 'react-router-dom'
import mockData from '../data/mockData.json'

export default function DashboardPage() {
  const { metrics: initialMetrics, recentActivity, liveSignals, performanceMetrics, holdings, quickActions } =
    mockData.dashboard
  const { totalValue } = mockData.shared.totals

  const [metrics, setMetrics] = useState(initialMetrics)
  const [isAutoRebalance, setIsAutoRebalance] = useState(false)

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

  const activityIconMap = {
    Zap,
    Brain,
    DollarSign,
    Shield,
  }

  const quickActionIconMap = {
    Play,
    Brain,
    BarChart3,
    DollarSign,
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      

      <div className="mx-auto max-w-7xl p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="gradient-bg rounded-3xl p-8 border border-[var(--color-border-soft)]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-accent-soft)] rounded-lg shadow-lg"></div>
                <div>
                  <span className="text-xs text-[var(--color-accent-soft)] uppercase tracking-wider font-medium">Live Dashboard</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3.5 w-3.5 text-green-400 animate-pulse" />
                    <span className="text-xs text-gray-400">Updated 3s ago</span>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
                Portfolio Control Center
              </h1>
              <p className="mt-3 text-lg text-gray-400 max-w-lg">
                Real-time insights • AI-powered optimization • Automated execution
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-xs text-green-400 font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <KPICards {...metrics} />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Portfolio Allocation */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-8 pulse-glow hover:pulse-glow-hover">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-soft)] rounded-2xl flex items-center justify-center shadow-2xl">
                  <PieChart className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Portfolio Allocation</h3>
                  <p className="text-gray-400">Asset distribution • 12 categories • AI optimized</p>
                </div>
              </div>
              <Link to="/allocation" className="pill text-sm group">
                View Analysis <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
            <AllocationChart />
          </div>

          {/* Live Market Signals */}
          <div className="card rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[var(--color-accent)]" />
                  Live Signals
                </h3>
                <p className="text-sm text-gray-400 mt-1">Market sentiment • 5m delay</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
            </div>

            <div className="space-y-4">
              {liveSignals.map((signal, idx) => (
                <div key={idx} className="group flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-soft)] hover:bg-[var(--color-hover-bg)] transition-all">
                  <span className="text-sm font-medium text-gray-200">{signal.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-lg ${signal.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {signal.value}
                    </span>
                    {signal.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dual Row: Performance + Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Performance Analytics */}
          <div className="card rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white">Performance Analytics</h3>
                <p className="text-gray-400 mt-1">YTD metrics • Risk-adjusted returns</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>1D</span>
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span>1M</span>
                <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full"></div>
                <span>1Y</span>
              </div>
            </div>

            <div className="space-y-6">
              {performanceMetrics.map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-green-400"></div>
                    <span className="font-medium text-gray-200">{metric.label}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-black ${metric.value.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>
                      {metric.value}
                    </div>
                    <div className={`text-xs ${metric.change.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>
                      {metric.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="card rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Recent Activity</h3>
              <button className="text-xs text-gray-400 hover:text-white transition-colors">View all</button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => {
                const Icon = activityIconMap[activity.icon as keyof typeof activityIconMap]
                return (
                  <div key={idx} className="group flex items-start gap-3 p-4 rounded-2xl bg-[var(--color-surface-soft)] hover:bg-[var(--color-hover-bg)] transition-all cursor-pointer">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      activity.status === 'success' ? 'bg-green-500/20 border-2 border-green-500/30' :
                      activity.status === 'active' ? 'bg-[var(--color-accent)]/20 border-2 border-[var(--color-accent)]/30' :
                      'bg-gray-500/20 border-2 border-gray-500/30'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm">{activity.action}</p>
                      <p className="text-xs text-gray-400 mt-1 truncate">{activity.time}</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping ml-2"></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Enhanced Holdings Table */}
        <div className="xl:col-span-3 card rounded-3xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <DollarSign className="h-7 w-7 text-[var(--color-accent)]" />
                Top Holdings
              </h3>
              <p className="text-gray-400 mt-1">Largest positions by value • 12 tickers • ₹58.4L total</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="pill text-sm bg-[var(--color-success-12)] text-[var(--color-success)] hover:bg-[var(--color-success)] hover:text-black transition-all">
                Auto Rebalance
              </button>
              <div className="flex gap-2">
                <div className="pill text-xs">Export CSV</div>
                <div className="pill text-xs">View All</div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Value</th>
                  <th className="text-right">24h</th>
                  <th className="text-right">Allocation</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding, idx) => (
                  <tr key={idx} className="group hover:bg-[var(--color-hover-bg)] transition-colors">
                    <td>
                      <div className="asset-cell">
                        <div className="symbol-badge group-hover:scale-105 transition-transform">
                          {holding.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-[var(--color-accent)] transition-colors">{holding.symbol}</div>
                          <div className="text-xs text-gray-400 truncate max-w-[200px]">{holding.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right font-mono text-gray-300">{holding.qty.toLocaleString()}</td>
                    <td className="text-right font-mono text-gray-300">₹{holding.price.toLocaleString()}</td>
                    <td className="text-right font-bold text-white font-mono">
                      ₹{(holding.qty * holding.price).toLocaleString()}
                    </td>
                    <td className="text-right">
                      <span className={`label-pill ${holding.change.startsWith("-") ? "negative" : "positive"} group-hover:scale-105 transition-transform`}>
                        {holding.change.startsWith("-") ? (
                          <ArrowDownRight className="h-2.5 w-2.5 inline mr-0.5" />
                        ) : (
                          <ArrowUpRight className="h-2.5 w-2.5 inline mr-0.5" />
                        )}
                        {holding.change}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="bg-[var(--color-accent-12)] text-[var(--color-accent)] px-2 py-1 rounded-full text-xs font-bold">
                        {holding.allocation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-sm">
            <div className="flex flex-wrap items-center gap-6">
              <span className="text-gray-400">12 holdings</span>
              <span className="font-bold text-white">
                Total:&nbsp;
                <span className="text-gradient text-2xl">
                  ₹{(totalValue / 100000).toFixed(1)}L
                </span>
              </span>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Real-time</span>
              </div>
            </div>
            <button className="pill accent text-sm shadow-lg hover:shadow-[0_0_20px_var(--color-accent-40)] transition-all">
              <DollarSign className="h-4 w-4" /> Generate Report
            </button>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="glass-card rounded-3xl p-6 border border-[var(--color-border-soft)]">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-lg text-white flex items-center gap-3">
              <Zap className="h-5 w-5 text-[var(--color-accent)]" />
              Quick Actions
            </h4>
            <button className="text-sm text-[var(--color-accent)] font-medium hover:underline">View all →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {quickActions.map((action, idx) => {
              const Icon = quickActionIconMap[action.icon as keyof typeof quickActionIconMap]
              return (
                <Link
                  key={idx}
                  to={action.href}
                  className={`group ${action.bg} p-4 rounded-2xl border border-transparent hover:border-[var(--color-accent)] transition-all hover:scale-105 hover:shadow-xl`}
                >
                  <Icon className="h-6 w-6 text-gray-300 group-hover:text-[var(--color-accent)] transition-colors mx-auto mb-2" />
                  <span className="text-sm font-medium text-center block text-gray-200 group-hover:text-white">{action.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}



