import { useState, useEffect } from 'react'
import { 
  ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Bell, Settings, ChevronRight, Activity, 
  DollarSign, PieChart, BarChart3, Sparkles, Brain, Shield, Star, Flame, Clock, Zap, Play, Pause 
} from "lucide-react"
import KPICards from "../components/KPICards"
import AllocationChart from "../components/AllocationChart"
import { Link } from "react-router-dom"

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalValue: 5842500,
    dailyPnL: 12450,
    dailyPnLPercent: 2.15,
    riskScore: 72,
  })

  const [activeTab, setActiveTab] = useState('overview')
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

  const recentActivity = [
    { time: '2m ago', action: 'Portfolio rebalanced', status: 'success', icon: Zap },
    { time: '5m ago', action: 'AI signal triggered', status: 'active', icon: Brain },
    { time: '12m ago', action: 'Dividend received', status: 'success', icon: DollarSign },
    { time: '1h ago', action: 'Risk alert cleared', status: 'resolved', icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <style>{`
        * {
          font-family: "Space Grotesk", system-ui, -apple-system, sans-serif;
        }

        :root {
          --bg: #000000;
          --surface: #0a0a0a;
          --surface-soft: #0f0f0f;
          --border: #222222;
          --border-soft: #2c2c2c;
          --text: #e0e0e0;
          --text-muted: #999999;
          --accent: #FF4500;
          --accent-soft: #FF6B35;
          --accent-mid: #FF8C42;
          --accent-light: #FFA559;
          --accent-bg: rgba(255, 69, 0, 0.12);
          --hover-bg: rgba(44, 44, 48, 0.6);
          --success: #FF8C42;
          --success-bg: rgba(255, 140, 66, 0.12);
        }

        body {
          background: var(--surface);
        }

        .card {
          background: #0f0f0f;
          border: 1px solid var(--border-soft);
          border-radius: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
          transition: all 0.2s ease;
        }

        .card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);
          border-color: rgba(255, 69, 0, 0.2);
        }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.9rem;
          border-radius: 1.2rem;
          border: 1px solid var(--border-soft);
          background: rgba(32, 32, 35, 0.7);
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pill:hover {
          background: var(--hover-bg);
          border-color: rgba(255, 69, 0, 0.3);
          transform: translateY(-1px);
        }

        .pill.accent {
          background: var(--accent-bg);
          border-color: rgba(255, 69, 0, 0.35);
          color: var(--accent);
        }

        .pill.accent:hover {
          background: rgba(255, 69, 0, 0.18);
          border-color: rgba(255, 69, 0, 0.45);
        }

        .gradient-bg {
          background: linear-gradient(135deg, var(--surface) 0%, rgba(255,69,0,0.03) 50%, var(--surface-soft) 100%);
        }
        
        .glass-card {
          background: rgba(15, 15, 15, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(44, 44, 48, 0.3);
        }

        .text-gradient {
          background: linear-gradient(90deg, var(--accent), var(--accent-soft));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .symbol-badge {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          background: rgba(40, 40, 44, 0.7);
          border: 1px solid rgba(80, 80, 84, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
          color: #ddd;
        }

        .label-pill {
          padding: 0.15rem 0.4rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(55, 55, 59, 0.4);
          background: rgba(55, 55, 59, 0.5);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .label-pill.positive {
          color: #FF8C42;
          border-color: rgba(255, 140, 66, 0.3);
        }

        .label-pill.negative {
          color: #FFBF6E;
          border-color: rgba(255, 191, 110, 0.3);
        }

        .asset-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8125rem;
        }

        .table th {
          text-align: left;
          padding: 0.8rem 0.5rem 0.8rem 0;
          font-weight: 400;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border);
        }

        .table td {
          padding: 0.8rem 0.5rem 0.8rem 0;
          border-bottom: 1px solid rgba(40, 40, 44, 0.2);
        }

        .table tr:hover td {
          background: rgba(44, 44, 48, 0.4);
        }
      `}</style>

      <div className="mx-auto max-w-7xl p-6 space-y-8">
        {/* Header */}
        <div className="gradient-bg rounded-3xl p-8 border border-[var(--border-soft)]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-[var(--accent)] to-[var(--accent-soft)] rounded-lg shadow-lg"></div>
                <div>
                  <span className="text-xs text-[var(--accent-soft)] uppercase tracking-wider font-medium">Live Dashboard</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3.5 w-3.5 text-[#FF8C42] animate-pulse" />
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
              <div className="pill text-sm bg-[var(--accent-bg)] border-[var(--accent)] text-[var(--accent)]">
                <Sparkles className="h-4 w-4" /> AI Active
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FF8C42] rounded-full animate-ping"></div>
                <span className="text-xs text-[#FF8C42] font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <KPICards {...metrics} />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Allocation */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-soft)] rounded-2xl flex items-center justify-center shadow-2xl">
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
          <div className="card rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[var(--accent)]" />
                  Live Signals
                </h3>
                <p className="text-sm text-gray-400 mt-1">Market sentiment • 5m delay</p>
              </div>
              <div className="w-3 h-3 bg-[#FF8C42] rounded-full animate-ping"></div>
            </div>

            <div className="space-y-4">
              {[
                { label: "NIFTY 50", value: "+2.14%", trend: "up" },
                { label: "SENSEX", value: "+1.87%", trend: "up" },
                { label: "GOLD", value: "+0.42%", trend: "up" },
                { label: "USD/INR", value: "-0.23%", trend: "down" },
              ].map((signal, idx) => (
                <div key={idx} className="group flex items-center justify-between p-3 rounded-xl bg-[var(--surface-soft)] hover:bg-[var(--hover-bg)] transition-all">
                  <span className="text-sm font-medium text-gray-200">{signal.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-lg ${signal.trend === 'up' ? 'text-[#FF8C42]' : 'text-[#FFBF6E]'}`}>
                      {signal.value}
                    </span>
                    {signal.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-[#FF8C42]" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-[#FFBF6E]" />
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
                <span className="hover:text-white cursor-pointer">1D</span>
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="hover:text-white cursor-pointer">1M</span>
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full"></div>
                <span className="hover:text-white cursor-pointer">1Y</span>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { label: "Portfolio Alpha", value: "+4.2%", change: "+0.3%" },
                { label: "Sharpe Ratio", value: "1.85", change: "+0.12" },
                { label: "Sortino Ratio", value: "2.41", change: "+0.08" },
                { label: "Max Drawdown", value: "-8.3%", change: "-0.2%" },
                { label: "Win Rate", value: "62%", change: "+2%" },
              ].map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[var(--accent)] to-[#FF8C42]"></div>
                    <span className="font-medium text-gray-200">{metric.label}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-black ${metric.value.startsWith('-') ? 'text-[#FFBF6E]' : 'text-[#FF8C42]'}`}>
                      {metric.value}
                    </div>
                    <div className={`text-xs ${metric.change.startsWith('-') ? 'text-[#FFBF6E]' : 'text-[#FF8C42]'}`}>
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
                const Icon = activity.icon
                return (
                  <div key={idx} className="group flex items-start gap-3 p-4 rounded-2xl bg-[var(--surface-soft)] hover:bg-[var(--hover-bg)] transition-all cursor-pointer">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      activity.status === 'success' ? 'bg-[#FF8C42]/20 border-2 border-[#FF8C42]/30' :
                      activity.status === 'active' ? 'bg-[var(--accent)]/20 border-2 border-[var(--accent)]/30' :
                      'bg-gray-500/20 border-2 border-gray-500/30'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm">{activity.action}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="card rounded-3xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <DollarSign className="h-7 w-7 text-[var(--accent)]" />
                Top Holdings
              </h3>
              <p className="text-gray-400 mt-1">Largest positions by value • 12 tickers • ₹58.4L total</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="pill text-sm bg-[var(--accent-bg)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all">
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
                {[
                  { symbol: "RELIANCE", name: "Reliance Industries", qty: 100, price: 2650, change: "+2.5%", allocation: "28%" },
                  { symbol: "TCS", name: "Tata Consultancy", qty: 50, price: 3820, change: "+1.2%", allocation: "19%" },
                  { symbol: "INFY", name: "Infosys Ltd", qty: 75, price: 1620, change: "+3.1%", allocation: "15%" },
                  { symbol: "HUL", name: "Hindustan Unilever", qty: 120, price: 2890, change: "-0.8%", allocation: "12%" },
                  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", qty: 80, price: 1450, change: "+0.9%", allocation: "11%" },
                ].map((holding, idx) => (
                  <tr key={idx} className="group hover:bg-[var(--hover-bg)] transition-colors">
                    <td>
                      <div className="asset-cell">
                        <div className="symbol-badge group-hover:scale-105 transition-transform">
                          {holding.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-[var(--accent)] transition-colors">{holding.symbol}</div>
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
                      <span className="bg-[var(--accent-bg)] text-[var(--accent)] px-2 py-1 rounded-full text-xs font-bold">
                        {holding.allocation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-sm">
            <div className="flex flex-wrap items-center gap-6">
              <span className="text-gray-400">12 holdings</span>
              <span className="font-bold text-white">
                Total:&nbsp;
                <span className="text-gradient text-2xl">
                  ₹{(metrics.totalValue / 100000).toFixed(1)}L
                </span>
              </span>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-[#FF8C42] rounded-full"></div>
                <span>Real-time</span>
              </div>
            </div>
            <button className="pill accent text-sm">
              <DollarSign className="h-4 w-4" /> Generate Report
            </button>
          </div>
        </div>
        </div>
      </div>
  )
}