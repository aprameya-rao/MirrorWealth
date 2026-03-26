import { useMemo, useState } from 'react'
import { 
  BarChart3, PieChart, TrendingUp, Activity, Brain,
  Clock, DollarSign, Sparkles, ChevronRight, 
  AlertTriangle, Zap, Calendar, RefreshCw,
  TrendingDown, Layers, Maximize2, Minimize2, Play, Pause
} from 'lucide-react'
import AllocationChart from '../components/AllocationChart'
import { Link } from 'react-router-dom'
import mockData from '../data/mockData.json'

export default function AllocationPage() {
  const [activeChart, setActiveChart] = useState('allocation')
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showFullMetrics, setShowFullMetrics] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isAutoRebalance, setIsAutoRebalance] = useState(false)

  const { portfolioAllocation, assetKeys } = mockData.shared
  const { totalPortfolioValue, totalGain, totalGainPercent } = mockData.shared.totals
  const allocationModels = mockData.allocation.models
  const performanceData = mockData.allocation.performanceData
  const riskMetrics = mockData.allocation.riskMetrics
  const aiInsights = mockData.allocation.aiInsights

  const assetColorMap = useMemo(() => {
    return portfolioAllocation.reduce<Record<string, string>>((acc, asset) => {
      acc[asset.key] = asset.color
      return acc
    }, {})
  }, [portfolioAllocation])

  type AssetKey = (typeof assetKeys)[number]

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
                  <span className="text-xs text-[var(--color-accent-soft)] uppercase tracking-wider font-medium">Allocation Analysis</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3.5 w-3.5 text-[var(--color-accent-mid)] animate-pulse" />
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
              <div className="pill text-sm bg-[var(--color-success-12)] border-[var(--color-success)] text-[var(--color-success)]">
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
                <div className="w-3 h-3 bg-[var(--color-accent-mid)] rounded-full animate-ping"></div>
                <span className="text-xs text-[var(--color-accent-mid)] font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Portfolio Value</span>
              <DollarSign className="h-5 w-5 text-[var(--color-accent)]" />
            </div>
            <div className="text-3xl font-bold text-white">${totalPortfolioValue.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-[var(--color-accent-mid)]" />
              <span className="text-sm text-[var(--color-accent-mid)]">+{totalGainPercent}%</span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Gain/Loss</span>
              <TrendingUp className="h-5 w-5 text-[var(--color-accent-soft)]" />
            </div>
            <div className="text-3xl font-bold text-[var(--color-accent-soft)]">+${totalGain.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-2">+{totalGainPercent}% overall</div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Risk Score</span>
              <AlertTriangle className="h-5 w-5 text-[var(--color-accent-light)]" />
            </div>
            <div className="text-3xl font-bold text-white">42/100</div>
            <div className="text-sm text-gray-500 mt-2">Moderate Risk Level</div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Diversification</span>
              <Layers className="h-5 w-5 text-[var(--color-accent-lighter)]" />
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
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-mid)] rounded-2xl flex items-center justify-center shadow-2xl">
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
              <div className="w-full h-80 bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface-soft)] rounded-2xl flex items-center justify-center border-2 border-[var(--color-border)]/50">
                <div className="relative w-64 h-64">
                  {/* Center text */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center bg-black/50 backdrop-blur-sm rounded-full w-32 h-32 flex flex-col items-center justify-center border-2 border-[var(--color-accent)]/30">
                      <div className="text-2xl font-bold text-white">${totalPortfolioValue}</div>
                      <div className="text-[var(--color-accent-mid)] text-sm font-mono mt-1">+{totalGainPercent}%</div>
                    </div>
                  </div>
                  
                  {/* SVG Donut Chart */}
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {(() => {
                      let cumulativeAngle = 0
                      const radius = 40
                      const center = 50
                      
                      return portfolioAllocation.map((asset, index) => {
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
                              stroke="var(--color-black-30)"
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
                {portfolioAllocation.map((asset, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors group">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full transition-transform group-hover:scale-110`} style={{backgroundColor: asset.color}} />
                      <span className="text-sm text-gray-400">{asset.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white font-semibold text-sm">{asset.value}%</span>
                      <span className="text-xs text-[var(--color-accent-mid)]">{asset.change}</span>
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
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-accent-soft)] to-[var(--color-accent-mid)] rounded-2xl flex items-center justify-center shadow-2xl">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Performance Trend</h3>
                  <p className="text-gray-400">YTD Returns by Asset Class</p>
                </div>
              </div>
              <div className="pill text-sm">
                <BarChart3 className="h-4 w-4" /> Details
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="h-52">
                <div className="flex h-full items-end gap-2">
                  {assetKeys.map((assetKey: AssetKey, idx: number) => {
                    const latestData = performanceData[performanceData.length - 1]
                    const value = latestData[assetKey] as number
                    const colors = assetColorMap
                    const maxValue = 70
                    const height = (value / maxValue) * 100
                    
                    return (
                      <div key={assetKey} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-[var(--color-surface-2)] rounded-lg h-40 relative group">
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
                        <span className="text-xs text-gray-400 font-mono capitalize">{assetKey}</span>
                        <span className="text-sm font-semibold text-white">{value.toFixed(1)}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 pt-4 border-t border-[var(--color-border)]">
                {performanceData.slice(-6).map((data) => (
                  <span key={data.month} className="font-mono hover:text-[var(--color-accent)] transition-colors cursor-pointer">{data.month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Analysis Row */}
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
          {/* Risk Metrics */}
          <div className="lg:col-span-2 card rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-soft)] rounded-2xl flex items-center justify-center shadow-2xl">
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
                      <TrendingUp className="h-3.5 w-3.5 text-[var(--color-accent-mid)]" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-[var(--color-accent-soft)]" />
                    )}
                    <span className={`text-xs ${metric.status === 'above' ? 'text-[var(--color-accent-mid)]' : 'text-[var(--color-accent-soft)]'}`}>
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
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-accent-soft)] to-[var(--color-accent-mid)] rounded-2xl flex items-center justify-center shadow-2xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">AI Recommendations</h3>
                <p className="text-gray-400">Personalized portfolio models</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {allocationModels.map((model, idx) => {
                const Icon = modelIconMap[model.icon as keyof typeof modelIconMap]
                const isActive = selectedModel?.name === model.name
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedModel(model)}
                    className={`w-full p-4 rounded-xl border transition-all group ${
                      isActive 
                        ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/5 shadow-xl' 
                        : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-surface-2)]'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isActive ? 'bg-[var(--color-accent)] scale-110' : 'bg-[var(--color-border)]'
                      }`}>
                        <Icon className={`h-5 w-5 transition-all ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className={`font-semibold ${isActive ? 'text-[var(--color-accent)]' : 'text-white'}`}>
                          {model.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{model.allocation}</p>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-all ${isActive ? 'text-[var(--color-accent)] translate-x-1' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[var(--color-accent-mid)]">{model.apy}</span>
                        <span className="text-xs text-gray-500">APY</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">Vol: {model.volatility}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          model.risk === 'Low' ? 'bg-[var(--color-accent-mid)]/20 text-[var(--color-accent-mid)]' :
                          model.risk === 'Medium' ? 'bg-[var(--color-accent-light)]/20 text-[var(--color-accent-light)]' : 
                          'bg-[var(--color-accent-soft)]/20 text-[var(--color-accent-soft)]'
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
              <div className="mt-6 p-4 bg-[var(--color-surface-2)] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-[var(--color-accent)]" />
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
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-accent-mid)] to-[var(--color-accent-light)] rounded-2xl flex items-center justify-center shadow-2xl">
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
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left py-2 text-gray-400">Month</th>
                    <th className="text-right py-2 text-gray-400" style={{color: 'var(--color-accent)'}}>Equity</th>
                    <th className="text-right py-2 text-gray-400" style={{color: 'var(--color-accent-soft)'}}>Debt</th>
                    <th className="text-right py-2 text-gray-400" style={{color: 'var(--color-accent-mid)'}}>Gold</th>
                    <th className="text-right py-2 text-gray-400" style={{color: 'var(--color-accent-light)'}}>Crypto</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.slice(-5).map((data, idx) => (
                    <tr key={idx} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-surface-2)] transition-colors">
                      <td className="py-3 font-medium text-white">{data.month}</td>
                      <td className="text-right" style={{color: 'var(--color-accent)'}}>{data.equity}%</td>
                      <td className="text-right" style={{color: 'var(--color-accent-soft)'}}>{data.debt}%</td>
                      <td className="text-right" style={{color: 'var(--color-accent-mid)'}}>{data.gold}%</td>
                      <td className="text-right" style={{color: 'var(--color-accent-light)'}}>{data.crypto}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions & Insights */}
          <div className="card rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-accent-light)] to-[var(--color-accent-lighter)] rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">AI Insights</h3>
                <p className="text-gray-400">Smart portfolio recommendations</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {aiInsights.map((insight, idx) => {
                const Icon = insightIconMap[insight.icon as keyof typeof insightIconMap]
                return (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-r from-[var(--color-accent-10)] to-transparent rounded-xl border border-[var(--color-accent-20)] hover:scale-105 transition-transform"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[var(--color-accent-20)] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-[var(--color-accent)]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">{insight.title}</h4>
                        <p className="text-xs text-gray-400">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        
      </div>
    </div>
  )
}



