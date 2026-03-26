import { useState } from 'react'
import { 
  BarChart3, PieChart, TrendingUp, Activity, Brain, Shield, Star, Flame, 
  ArrowRight, Clock, DollarSign, Percent, Sparkles, ChevronRight, 
  AlertTriangle, Target, Award, Zap, Info, Calendar, RefreshCw,
  TrendingDown, Wallet, Layers, Maximize2, Minimize2, Play, Pause
} from 'lucide-react'
import AllocationChart from '../components/AllocationChart'
import { Link } from 'react-router-dom'

export default function AllocationPage() {
  const [activeChart, setActiveChart] = useState('allocation')
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showFullMetrics, setShowFullMetrics] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isAutoRebalance, setIsAutoRebalance] = useState(false)

  const allocationModels = [
    { name: 'Conservative', allocation: '60% Debt, 40% Equity', risk: 'Low', apy: '7.2%', volatility: '4.2%', icon: Shield, color: '#FF8C42' },
    { name: 'Balanced', allocation: '50% Equity, 30% Debt, 20% Gold', risk: 'Medium', apy: '12.8%', volatility: '8.7%', icon: Star, color: '#FFA559' },
    { name: 'Aggressive', allocation: '70% Equity, 20% Crypto, 10% Gold', risk: 'High', apy: '22.4%', volatility: '15.3%', icon: Flame, color: '#FF6B35' }
  ]

  // Orange to yellow gradient color scheme
  const portfolioData = [
    { name: 'Equity', value: 40, color: '#FF4500', change: '+12.4%', icon: TrendingUp },
    { name: 'Debt', value: 30, color: '#FF6B35', change: '+5.2%', icon: TrendingUp },
    { name: 'Gold', value: 20, color: '#FF8C42', change: '+8.1%', icon: TrendingUp },
    { name: 'Crypto', value: 10, color: '#FFA559', change: '+24.3%', icon: TrendingUp }
  ]

  interface PerformanceData {
    month: string
    equity: number
    debt: number
    gold: number
    crypto: number
  }

  const performanceData: PerformanceData[] = [
    { month: 'Jan', equity: 15, debt: 5, gold: 8, crypto: 35 },
    { month: 'Feb', equity: 18, debt: 6, gold: 10, crypto: 42 },
    { month: 'Mar', equity: 22, debt: 6.2, gold: 12, crypto: 45 },
    { month: 'Apr', equity: 25, debt: 6.5, gold: 11, crypto: 48 },
    { month: 'May', equity: 28, debt: 6.8, gold: 13, crypto: 52 },
    { month: 'Jun', equity: 31, debt: 7.2, gold: 14, crypto: 58 },
    { month: 'Jul', equity: 34, debt: 7.5, gold: 15, crypto: 62 }
  ]

  const riskMetrics = [
    { name: 'Sharpe Ratio', value: 1.42, color: '#FF4500', benchmark: '1.2', status: 'above' },
    { name: 'Max Drawdown', value: '-8.2%', color: '#FF6B35', benchmark: '-12%', status: 'above' },
    { name: 'Volatility', value: '12.4%', color: '#FF8C42', benchmark: '15%', status: 'below' },
    { name: 'Beta', value: 0.89, color: '#FFA559', benchmark: '1.0', status: 'below' },
    { name: 'Alpha', value: '+3.2%', color: '#FFBF6E', benchmark: '0%', status: 'above' },
    { name: 'Sortino Ratio', value: '1.85', color: '#FFD28F', benchmark: '1.5', status: 'above' }
  ]

  const assetKeys = ['equity', 'debt', 'gold', 'crypto'] as const
  type AssetKey = typeof assetKeys[number]

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 1000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const totalPortfolioValue = 124800
  const totalGain = 12480
  const totalGainPercent = 11.2

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
          --accent-lighter: #FFBF6E;
          --accent-bg: rgba(255, 69, 0, 0.12);
          --hover-bg: rgba(44, 44, 48, 0.6);
          --success: #FF8C42;
          --success-bg: rgba(255, 140, 66, 0.12);
          --gold: #FFA559;
        }

        body {
          background: var(--surface);
        }

        .card {
          background: #0f0f0f;
          border: 1px solid var(--border-soft);
          border-radius: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
          color: var(--text);
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

        .stat-card {
          background: linear-gradient(135deg, rgba(255, 69, 0, 0.05) 0%, rgba(255, 69, 0, 0.02) 100%);
          border: 1px solid rgba(255, 69, 0, 0.15);
        }

        .metric-value {
          font-size: 1.875rem;
          font-weight: 800;
          background: linear-gradient(135deg, #fff 0%, var(--accent-soft) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .w-1 {
          width: 2rem;
          height: 0.25rem;
          background: linear-gradient(90deg, var(--accent), var(--accent-soft));
          border-radius: 9999px;
        }

        .text-gradient {
          background: linear-gradient(90deg, var(--accent), var(--accent-soft));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .gradient-bg {
          background: linear-gradient(135deg, var(--surface) 0%, rgba(255,69,0,0.03) 50%, var(--surface-soft) 100%);
        }
        
        .glass-card {
          background: rgba(15, 15, 15, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(44, 44, 48, 0.3);
        }
        
        .pulse-glow {
          box-shadow: 0 0 20px rgba(255, 69, 0, 0.3);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .animate-pulse-slow {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .donut-segment {
          transition: all 0.3s ease;
        }
        
        .donut-segment:hover {
          filter: brightness(1.2);
          transform: scale(1.02);
        }
      `}</style>

      <div className="mx-auto max-w-7xl p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="gradient-bg rounded-3xl p-8 border border-[var(--border-soft)]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-[var(--accent)] to-[var(--accent-soft)] rounded-lg shadow-lg"></div>
                <div>
                  <span className="text-xs text-[var(--accent-soft)] uppercase tracking-wider font-medium">Allocation Analysis</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3.5 w-3.5 text-[#FF8C42] animate-pulse" />
                    <span className="text-xs text-gray-400">Updated {formatTime(lastUpdated)}</span>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
                Portfolio Allocation
              </h1>
              <p className="mt-3 text-lg text-gray-400 max-w-lg">
                Real-time allocation insights • AI-optimized recommendations • Performance metrics
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="pill text-sm bg-[var(--success-bg)] border-[var(--success)] text-[var(--success)]">
                <Sparkles className="h-4 w-4" /> AI Optimized
              </div>
              <button 
                onClick={handleRefresh}
                className="pill text-sm group"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform`} />
                Refresh
              </button>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FF8C42] rounded-full animate-ping"></div>
                <span className="text-xs text-[#FF8C42] font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Portfolio Value</span>
              <DollarSign className="h-5 w-5 text-[#FF4500]" />
            </div>
            <div className="text-3xl font-bold text-white">${totalPortfolioValue.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-[#FF8C42]" />
              <span className="text-sm text-[#FF8C42]">+{totalGainPercent}%</span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Gain/Loss</span>
              <TrendingUp className="h-5 w-5 text-[#FF6B35]" />
            </div>
            <div className="text-3xl font-bold text-[#FF6B35]">+${totalGain.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-2">+{totalGainPercent}% overall</div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Risk Score</span>
              <AlertTriangle className="h-5 w-5 text-[#FFA559]" />
            </div>
            <div className="text-3xl font-bold text-white">42/100</div>
            <div className="text-sm text-gray-500 mt-2">Moderate Risk Level</div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Diversification</span>
              <Layers className="h-5 w-5 text-[#FFBF6E]" />
            </div>
            <div className="text-3xl font-bold text-white">4</div>
            <div className="text-sm text-gray-500 mt-2">Asset Classes</div>
          </div>
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Allocation - Fixed Donut Chart */}
          <div className="glass-card rounded-3xl p-8 pulse-glow">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF4500] to-[#FF8C42] rounded-2xl flex items-center justify-center shadow-2xl">
                  <PieChart className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Current Allocation</h3>
                  <p className="text-gray-400">Portfolio breakdown • Real-time distribution</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAutoRebalance(!isAutoRebalance)}
                className="pill text-sm group"
              >
                {isAutoRebalance ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isAutoRebalance ? 'Auto-Rebalance Active' : 'Auto-Rebalance'}
              </button>
            </div>
            
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl flex items-center justify-center border-2 border-[#222222]/50">
                <div className="relative w-64 h-64">
                  {/* Center text */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center bg-black/50 backdrop-blur-sm rounded-full w-32 h-32 flex flex-col items-center justify-center border-2 border-[#FF4500]/30">
                      <div className="text-2xl font-bold text-white">${totalPortfolioValue}</div>
                      <div className="text-[#FF8C42] text-sm font-mono mt-1">+{totalGainPercent}%</div>
                    </div>
                  </div>
                  
                  {/* SVG Donut Chart */}
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {(() => {
                      let cumulativeAngle = 0
                      const radius = 40
                      const center = 50
                      
                      return portfolioData.map((asset, index) => {
                        const percentage = asset.value
                        const angle = (percentage / 100) * 360
                        const startAngle = cumulativeAngle
                        const endAngle = cumulativeAngle + angle
                        cumulativeAngle += angle
                        
                        const startRad = (startAngle * Math.PI) / 180
                        const endRad = (endAngle * Math.PI) / 180
                        
                        const x1 = center + radius * Math.cos(startRad)
                        const y1 = center + radius * Math.sin(startRad)
                        const x2 = center + radius * Math.cos(endRad)
                        const y2 = center + radius * Math.sin(endRad)
                        
                        const largeArcFlag = angle > 180 ? 1 : 0
                        
                        const pathData = `
                          M ${center} ${center}
                          L ${x1} ${y1}
                          A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
                          Z
                        `
                        
                        return (
                          <g key={index} className="donut-segment cursor-pointer">
                            <path
                              d={pathData}
                              fill={asset.color}
                              stroke="rgba(0,0,0,0.3)"
                              strokeWidth="0.5"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.filter = 'brightness(1.2)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.filter = 'brightness(1)'
                              }}
                            />
                          </g>
                        )
                      })
                    })()}
                  </svg>
                </div>
              </div>
              
              {/* Legend with updated colors */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {portfolioData.map((asset, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors group">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full transition-transform group-hover:scale-110`} style={{backgroundColor: asset.color}} />
                      <span className="text-sm text-gray-400">{asset.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white font-semibold text-sm">{asset.value}%</span>
                      <span className="text-xs text-[#FF8C42]">{asset.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Trend */}
          <div className="glass-card rounded-3xl p-8">
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#FF8C42] rounded-2xl flex items-center justify-center shadow-2xl">
        <TrendingUp className="h-8 w-8 text-white" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white">Performance Trend</h3>
        <p className="text-gray-400">Current Returns by Asset Class</p>
      </div>
    </div>
    <div className="pill text-sm">
      <BarChart3 className="h-4 w-4" /> Details
    </div>
  </div>
  
  <div className="space-y-6">
    <div className="h-80 relative">
     
      
      <div className="flex h-full items-end gap-4 relative z-0">
        {assetKeys.map((assetKey: AssetKey, idx: number) => {
          const latestData = performanceData[performanceData.length - 1]
          const value = latestData[assetKey] as number
          const colors = {
            equity: '#FF4500',
            debt: '#FF6B35',
            gold: '#FF8C42',
            crypto: '#FFA559'
          }
          const maxValue = 70
          const height = (value / maxValue) * 100
          
          return (
            <div key={assetKey} className="flex-1 flex flex-col items-center gap-3">
              <div className="w-full bg-[#1a1a1a] rounded-lg h-64 relative group">
                <div 
                  className="absolute bottom-0 left-0 right-0 rounded-lg transition-all duration-1000 group-hover:opacity-80"
                  style={{ 
                    height: `${height}%`,
                    backgroundColor: colors[assetKey],
                    opacity: 0.9
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded-full">{value.toFixed(1)}%</span>
                </div>
              </div>
              <span className="text-sm font-semibold text-white capitalize">{assetKey}</span>
              <span className="text-lg font-bold" style={{ color: colors[assetKey] }}>{value.toFixed(1)}%</span>
            </div>
          )
        })}
      </div>
    </div>
    
    {/* Legend */}
    <div className="pt-4 border-t border-[#222222] flex items-center justify-between">
      <div className="flex items-center gap-4">
        {assetKeys.map((assetKey, idx) => {
          const colors = {
            equity: '#FF4500',
            debt: '#FF6B35',
            gold: '#FF8C42',
            crypto: '#FFA559'
          }
          return (
            <div key={assetKey} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[assetKey] }} />
              <span className="text-xs text-gray-400 capitalize">{assetKey}</span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-px border-t border-dashed border-[#FF8C42]"></div>
        <span className="text-xs text-gray-500">Target (70%)</span>
      </div>
    </div>
  </div>
</div></div>

        {/* Bottom Analysis Row */}
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
          {/* Risk Metrics */}
          <div className="lg:col-span-2 card rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF4500] to-[#FF6B35] rounded-2xl flex items-center justify-center shadow-2xl">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Risk & Return Metrics</h3>
                  <p className="text-gray-400">Portfolio health indicators vs benchmarks</p>
                </div>
              </div>
              <div 
                className="pill text-sm cursor-pointer"
                onClick={() => setShowFullMetrics(!showFullMetrics)}
              >
                {showFullMetrics ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                {showFullMetrics ? 'Show Less' : 'View All'}
              </div>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ${showFullMetrics ? '' : 'max-h-96 overflow-hidden'}`}>
              {(showFullMetrics ? riskMetrics : riskMetrics.slice(0, 4)).map((metric, idx) => (
                <div key={idx} className="stat-card rounded-xl p-4 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full`} style={{backgroundColor: metric.color}} />
                      <span className="text-gray-400 font-mono text-sm">{metric.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">Benchmark: {metric.benchmark}</div>
                  </div>
                  <div className="text-3xl font-black" style={{color: metric.color}}>
                    {metric.value}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {metric.status === 'above' ? (
                      <TrendingUp className="h-3.5 w-3.5 text-[#FF8C42]" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-[#FF6B35]" />
                    )}
                    <span className={`text-xs ${metric.status === 'above' ? 'text-[#FF8C42]' : 'text-[#FF6B35]'}`}>
                      {metric.status === 'above' ? 'Above' : 'Below'} benchmark
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Recommendations */}
          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#FF8C42] rounded-2xl flex items-center justify-center shadow-2xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">AI Recommendations</h3>
                <p className="text-gray-400">Personalized portfolio models</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {allocationModels.map((model, idx) => {
                const Icon = model.icon
                const isActive = selectedModel?.name === model.name
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedModel(model)}
                    className={`w-full p-4 rounded-xl border transition-all group ${
                      isActive 
                        ? 'border-[#FF4500]/50 bg-[#FF4500]/5 shadow-xl' 
                        : 'border-[#222222] hover:border-[#FF4500]/30 hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isActive ? 'bg-[#FF4500] scale-110' : 'bg-[#222222]'
                      }`}>
                        <Icon className={`h-5 w-5 transition-all ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className={`font-semibold ${isActive ? 'text-[#FF4500]' : 'text-white'}`}>
                          {model.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{model.allocation}</p>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-all ${isActive ? 'text-[#FF4500] translate-x-1' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#FF8C42]">{model.apy}</span>
                        <span className="text-xs text-gray-500">APY</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">Vol: {model.volatility}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          model.risk === 'Low' ? 'bg-[#FF8C42]/20 text-[#FF8C42]' :
                          model.risk === 'Medium' ? 'bg-[#FFA559]/20 text-[#FFA559]' : 
                          'bg-[#FF6B35]/20 text-[#FF6B35]'
                        }`}>
                          {model.risk} Risk
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {selectedModel && (
              <div className="mt-6 p-4 bg-[#1a1a1a] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-[#FF4500]" />
                  <span className="text-sm font-semibold text-white">Why this model?</span>
                </div>
                <p className="text-xs text-gray-400">
                  Based on your risk tolerance and market conditions, this {selectedModel.name.toLowerCase()} model 
                  offers optimal risk-adjusted returns with {selectedModel.volatility} volatility.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Insights Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Asset Performance Timeline */}
          <div className="card rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF8C42] to-[#FFA559] rounded-2xl flex items-center justify-center shadow-2xl">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Monthly Performance</h3>
                <p className="text-gray-400">Asset class returns over time</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#222222]">
                    <th className="text-left py-2 text-gray-400">Month</th>
                    <th className="text-right py-2 text-gray-400" style={{color: '#FF4500'}}>Equity</th>
                    <th className="text-right py-2 text-gray-400" style={{color: '#FF6B35'}}>Debt</th>
                    <th className="text-right py-2 text-gray-400" style={{color: '#FF8C42'}}>Gold</th>
                    <th className="text-right py-2 text-gray-400" style={{color: '#FFA559'}}>Crypto</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.slice(-5).map((data, idx) => (
                    <tr key={idx} className="border-b border-[#222222]/50 hover:bg-[#1a1a1a] transition-colors">
                      <td className="py-3 font-medium text-white">{data.month}</td>
                      <td className="text-right" style={{color: '#FF4500'}}>{data.equity}%</td>
                      <td className="text-right" style={{color: '#FF6B35'}}>{data.debt}%</td>
                      <td className="text-right" style={{color: '#FF8C42'}}>{data.gold}%</td>
                      <td className="text-right" style={{color: '#FFA559'}}>{data.crypto}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions & Insights */}
          <div className="card rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FFA559] to-[#FFBF6E] rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">AI Insights</h3>
                <p className="text-gray-400">Smart portfolio recommendations</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-[#FF4500]/10 to-transparent rounded-xl border border-[#FF4500]/20 hover:scale-105 transition-transform">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FF4500]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-[#FF4500]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">Crypto Allocation Alert</h4>
                    <p className="text-xs text-gray-400">Your crypto allocation has increased by 15% this month. Consider rebalancing to maintain risk profile.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-[#FF6B35]/10 to-transparent rounded-xl border border-[#FF6B35]/20 hover:scale-105 transition-transform">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FF6B35]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="h-4 w-4 text-[#FF6B35]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">Optimization Opportunity</h4>
                    <p className="text-xs text-gray-400">Increasing equity allocation by 5% could improve expected returns by 2.3% annually.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-[#FF8C42]/10 to-transparent rounded-xl border border-[#FF8C42]/20 hover:scale-105 transition-transform">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FF8C42]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="h-4 w-4 text-[#FF8C42]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">Risk Score Improvement</h4>
                    <p className="text-xs text-gray-400">Your risk-adjusted returns have improved by 8% this quarter. Great job!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  )
}