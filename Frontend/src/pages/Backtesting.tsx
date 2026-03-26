import { useState } from 'react'
import { 
  LineChart, TrendingUp, TrendingDown, Calendar, Activity, 
  BarChart3, PieChart, Target, Award, Zap, Info, Settings,
  ChevronRight, ArrowUpRight, ArrowDownRight, Clock, Sparkles,
  Play, Pause, RefreshCw, Download, Maximize2, Minimize2,
  AlertTriangle, CheckCircle, Shield, Brain, Database, Filter
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function BacktestingPage() {
  const [strategy, setStrategy] = useState('momentum')
  const [startDate, setStartDate] = useState('2023-01-01')
  const [endDate, setEndDate] = useState('2024-12-31')
  const [initialCapital, setInitialCapital] = useState(100000)
  const [isRunning, setIsRunning] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState('returns')

  const strategies = [
    { id: 'momentum', name: 'Momentum Strategy', return: '+32.4%', sharpe: '1.85', color: '#FF4500' },
    { id: 'meanReversion', name: 'Mean Reversion', return: '+24.8%', sharpe: '1.62', color: '#FF6B35' },
    { id: 'buyHold', name: 'Buy & Hold', return: '+28.1%', sharpe: '1.73', color: '#FF8C42' },
    { id: 'value', name: 'Value Investing', return: '+26.5%', sharpe: '1.68', color: '#FFA559' },
    { id: 'growth', name: 'Growth Focused', return: '+35.2%', sharpe: '1.92', color: '#FFBF6E' },
    { id: 'quant', name: 'Quantitative', return: '+38.7%', sharpe: '2.04', color: '#FFD28F' }
  ]

  const backtestResults = {
    totalReturn: '+42.3%',
    annualizedReturn: '+18.7%',
    sharpeRatio: '1.92',
    maxDrawdown: '-8.4%',
    winRate: '64.2%',
    profitFactor: '1.85',
    totalTrades: 156,
    avgWin: '+2.8%',
    avgLoss: '-1.2%',
    bestTrade: '+12.4%',
    worstTrade: '-4.2%'
  }

  const monthlyReturns = [
    { month: 'Jan', return: '+3.2%', value: 3.2 },
    { month: 'Feb', return: '+2.8%', value: 2.8 },
    { month: 'Mar', return: '+4.1%', value: 4.1 },
    { month: 'Apr', return: '+1.5%', value: 1.5 },
    { month: 'May', return: '+5.2%', value: 5.2 },
    { month: 'Jun', return: '+2.3%', value: 2.3 },
    { month: 'Jul', return: '+3.8%', value: 3.8 },
    { month: 'Aug', return: '+1.9%', value: 1.9 },
    { month: 'Sep', return: '+4.5%', value: 4.5 },
    { month: 'Oct', return: '+3.1%', value: 3.1 },
    { month: 'Nov', return: '+6.2%', value: 6.2 },
    { month: 'Dec', return: '+4.8%', value: 4.8 }
  ]

  const equityCurve = [100000, 102500, 105200, 108900, 112400, 115800, 119200, 123500, 128100, 132400, 137800, 142300]

  const tradeAnalysis = [
    { type: 'Winning Trades', count: 100, percentage: 64.2, color: '#FF8C42' },
    { type: 'Losing Trades', count: 56, percentage: 35.8, color: '#FFBF6E' }
  ]

  const handleRunBacktest = () => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
    }, 2000)
  }

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

        .pill.active {
          background: var(--accent-bg);
          border-color: rgba(255, 69, 0, 0.35);
          color: var(--accent);
        }

        .gradient-bg {
          background: linear-gradient(135deg, var(--surface) 0%, rgba(255,69,0,0.03) 50%, var(--surface-soft) 100%);
        }
        
        .glass-card {
          background: rgba(15, 15, 15, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(44, 44, 48, 0.3);
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(255, 69, 0, 0.05) 0%, rgba(255, 69, 0, 0.02) 100%);
          border: 1px solid rgba(255, 69, 0, 0.15);
        }

        .progress-bar {
          transition: width 1s ease;
        }

        .text-gradient {
          background: linear-gradient(90deg, var(--accent), var(--accent-soft));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin 2s linear infinite;
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
                  <span className="text-xs text-[var(--accent-soft)] uppercase tracking-wider font-medium">Backtesting Engine</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3.5 w-3.5 text-[#FF8C42] animate-pulse" />
                    <span className="text-xs text-gray-400">Ready to backtest</span>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
                Strategy Backtesting
              </h1>
              <p className="mt-3 text-lg text-gray-400 max-w-lg">
                Test your trading strategies • Historical performance • Risk analysis • Optimization
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="pill text-sm bg-[var(--accent-bg)] border-[var(--accent)] text-[var(--accent)]">
                <Database className="h-4 w-4" /> Historical Data
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FF8C42] rounded-full animate-ping"></div>
                <span className="text-xs text-[#FF8C42] font-medium">Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Selection & Parameters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Strategy Selection */}
          <div className="lg:col-span-1 glass-card rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF4500] to-[#FF6B35] rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Strategy Selection</h3>
                <p className="text-sm text-gray-400">Choose backtesting strategy</p>
              </div>
            </div>

            <div className="space-y-2">
              {strategies.map((strat) => (
                <button
                  key={strat.id}
                  onClick={() => setStrategy(strat.id)}
                  className={`w-full p-3 rounded-xl border transition-all group ${
                    strategy === strat.id
                      ? 'border-[#FF4500]/50 bg-[#FF4500]/5 shadow-xl'
                      : 'border-[#222222] hover:border-[#FF4500]/30 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: strat.color }} />
                      <span className={`text-sm font-medium ${strategy === strat.id ? 'text-[#FF4500]' : 'text-white'}`}>
                        {strat.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold" style={{ color: strat.color }}>{strat.return}</div>
                      <div className="text-[10px] text-gray-500">Sharpe: {strat.sharpe}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FF8C42] rounded-xl flex items-center justify-center">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Backtest Parameters</h3>
                  <p className="text-sm text-gray-400">Configure your backtest settings</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="pill text-sm"
              >
                <Filter className="h-4 w-4" />
                {showAdvanced ? 'Hide Advanced' : 'Advanced Settings'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#222222] rounded-xl px-4 py-2 text-white focus:border-[#FF4500] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#222222] rounded-xl px-4 py-2 text-white focus:border-[#FF4500] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Initial Capital ($)</label>
                <input
                  type="number"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(Number(e.target.value))}
                  className="w-full bg-[#1a1a1a] border border-[#222222] rounded-xl px-4 py-2 text-white focus:border-[#FF4500] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Benchmark</label>
                <select className="w-full bg-[#1a1a1a] border border-[#222222] rounded-xl px-4 py-2 text-white focus:border-[#FF4500] focus:outline-none transition-colors">
                  <option>NIFTY 50</option>
                  <option>SENSEX</option>
                  <option>S&P 500</option>
                  <option>Custom</option>
                </select>
              </div>
            </div>

            {showAdvanced && (
              <div className="mt-6 pt-6 border-t border-[#222222]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Commission (%)</label>
                    <input
                      type="number"
                      defaultValue="0.1"
                      step="0.01"
                      className="w-full bg-[#1a1a1a] border border-[#222222] rounded-xl px-4 py-2 text-white focus:border-[#FF4500] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Slippage (%)</label>
                    <input
                      type="number"
                      defaultValue="0.05"
                      step="0.01"
                      className="w-full bg-[#1a1a1a] border border-[#222222] rounded-xl px-4 py-2 text-white focus:border-[#FF4500] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Position Sizing</label>
                    <select className="w-full bg-[#1a1a1a] border border-[#222222] rounded-xl px-4 py-2 text-white focus:border-[#FF4500] focus:outline-none transition-colors">
                      <option>Fixed Size</option>
                      <option>Percentage Risk</option>
                      <option>Kelly Criterion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Max Positions</label>
                    <input
                      type="number"
                      defaultValue="10"
                      className="w-full bg-[#1a1a1a] border border-[#222222] rounded-xl px-4 py-2 text-white focus:border-[#FF4500] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8">
              <button
                onClick={handleRunBacktest}
                disabled={isRunning}
                className="w-full py-3 bg-gradient-to-r from-[#FF4500] to-[#FF8C42] rounded-xl font-semibold text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Running Backtest...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Run Backtest
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Dashboard */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF8C42] to-[#FFA559] rounded-xl flex items-center justify-center">
              <LineChart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Backtest Results</h2>
              <p className="text-sm text-gray-400">Strategy performance metrics</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="stat-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#FF8C42]">{backtestResults.totalReturn}</div>
              <div className="text-xs text-gray-400 mt-1">Total Return</div>
            </div>
            <div className="stat-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#FF8C42]">{backtestResults.annualizedReturn}</div>
              <div className="text-xs text-gray-400 mt-1">Annualized</div>
            </div>
            <div className="stat-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#FF8C42]">{backtestResults.sharpeRatio}</div>
              <div className="text-xs text-gray-400 mt-1">Sharpe Ratio</div>
            </div>
            <div className="stat-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#FFBF6E]">{backtestResults.maxDrawdown}</div>
              <div className="text-xs text-gray-400 mt-1">Max Drawdown</div>
            </div>
            <div className="stat-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#FF8C42]">{backtestResults.winRate}</div>
              <div className="text-xs text-gray-400 mt-1">Win Rate</div>
            </div>
            <div className="stat-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#FF8C42]">{backtestResults.profitFactor}</div>
              <div className="text-xs text-gray-400 mt-1">Profit Factor</div>
            </div>
          </div>

          {/* Equity Curve & Monthly Returns */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Equity Curve */}
  <div className="card rounded-3xl p-8 h-full">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Equity Curve</h3>
        <p className="text-xs text-gray-500 mt-1">Portfolio value progression</p>
      </div>
      <div className="flex gap-2">
        <div className="pill text-xs">Log Scale</div>
        <div className="pill text-xs active bg-[#FF4500]/20 border-[#FF4500] text-[#FF4500]">Linear</div>
      </div>
    </div>
    <div className="h-[320px] relative">
      <svg className="w-full h-full" viewBox="0 0 400 280" preserveAspectRatio="none">
        <defs>
          <linearGradient id="equityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF4500" />
            <stop offset="100%" stopColor="#FFBF6E" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF4500" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FF4500" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M 0 ${280 - (equityCurve[0] / 150000) * 260} ${equityCurve.map((val, i) => 
            ` L ${(i / (equityCurve.length - 1)) * 400} ${280 - (val / 150000) * 260}`
          ).join(' ')}`}
          fill="url(#areaGradient)"
          stroke="url(#equityGradient)"
          strokeWidth="2.5"
          fillOpacity="0.3"
        />
        {equityCurve.map((val, i) => (
          <circle
            key={i}
            cx={(i / (equityCurve.length - 1)) * 400}
            cy={280 - (val / 150000) * 260}
            r="3"
            fill="#FF8C42"
            className="hover:r-5 transition-all cursor-pointer"
          />
        ))}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Aug</span>
        <span>Sep</span>
        <span>Oct</span>
        <span>Nov</span>
        <span>Dec</span>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-[#222222] flex items-center justify-between">
      <div className="text-xs text-gray-500">Start: $100,000</div>
      <div className="text-right">
        <div className="text-xs text-gray-500">Current Value</div>
        <div className="text-sm font-bold text-[#FF8C42]">$142,300</div>
      </div>
    </div>
  </div>

  {/* Monthly Returns - 4x3 Grid */}
  <div className="card rounded-3xl p-8 h-full">
    <div>
      <h3 className="text-lg font-semibold text-white">Monthly Returns 2024</h3>
      <p className="text-xs text-gray-500 mt-1">Performance breakdown by month • Current: March</p>
    </div>
    
    <div className="mt-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { month: 'Jan', return: '+5.2%', value: 5.2, status: 'past' },
          { month: 'Feb', return: '+3.8%', value: 3.8, status: 'past' },
          { month: 'Mar', return: '+4.5%', value: 4.5, status: 'current' },
          { month: 'Apr', return: '—', value: 0, status: 'future' },
          { month: 'May', return: '—', value: 0, status: 'future' },
          { month: 'Jun', return: '—', value: 0, status: 'future' },
          { month: 'Jul', return: '—', value: 0, status: 'future' },
          { month: 'Aug', return: '—', value: 0, status: 'future' },
          { month: 'Sep', return: '—', value: 0, status: 'future' },
          { month: 'Oct', return: '—', value: 0, status: 'future' },
          { month: 'Nov', return: '—', value: 0, status: 'future' },
          { month: 'Dec', return: '—', value: 0, status: 'future' }
        ].map((month, idx) => {
          const isPast = month.status === 'past'
          const isCurrent = month.status === 'current'
          const isFuture = month.status === 'future'
          
          const percentage = isPast ? (month.value / 10) * 100 : 0
          const radius = 35
          const circumference = 2 * Math.PI * radius
          const strokeDashoffset = circumference - (percentage / 100) * circumference
          
          return (
            <div key={idx} className={`text-center transition-all duration-300 ${isFuture ? 'opacity-40 hover:opacity-60' : 'hover:scale-105'}`}>
              <div className="relative inline-block mb-2">
                <svg className="w-20 h-20 transform -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    fill="none"
                    stroke={isFuture ? '#2a2a2a' : '#222222'}
                    strokeWidth="5"
                  />
                  {/* Progress Circle - Only for past and current months */}
                  {!isFuture && (
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      fill="none"
                      stroke={isCurrent ? '#FFA559' : '#FF8C42'}
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-1000"
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className={`text-sm font-bold ${isFuture ? 'text-gray-500' : (isCurrent ? 'text-[#FFA559]' : 'text-[#FF8C42]')}`}>
                      {month.return}
                    </span>
                    {isCurrent && (
                      <div className="text-[8px] text-[#FFA559] mt-0.5">●</div>
                    )}
                  </div>
                </div>
              </div>
              <div className={`text-xs font-medium mt-1 ${isFuture ? 'text-gray-500' : 'text-white'}`}>
                {month.month}
              </div>
              {isPast && (
                <div className="text-[10px] text-[#FF8C42]/70 mt-0.5">
                  {month.value}%
                </div>
              )}
              {isFuture && (
                <div className="text-[10px] text-gray-500 mt-0.5">
                  —
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
    
    {/* Compact Summary */}
    <div className="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#FF8C42]"></div>
          <span className="text-xs text-gray-500">Past</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#FFA559]"></div>
          <span className="text-xs text-gray-500">Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gray-500"></div>
          <span className="text-xs text-gray-500">Future</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-500">YTD Return</div>
        <div className="text-sm font-bold text-[#FF8C42]">+13.5%</div>
      </div>
    </div>
  </div>
</div>

          {/* Trade Analysis & Risk Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trade Analysis */}
            <div className="card rounded-3xl p-8">
              <h3 className="text-lg font-semibold text-white mb-6">Trade Analysis</h3>
              <div className="space-y-4">
                {tradeAnalysis.map((trade, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{trade.type}</span>
                      <div className="flex gap-4">
                        <span className="text-sm text-white">{trade.count} trades</span>
                        <span className="text-sm font-semibold" style={{ color: trade.color }}>{trade.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-[#222222] overflow-hidden">
                      <div
                        className="h-full rounded-full progress-bar"
                        style={{ 
                          width: `${trade.percentage}%`,
                          backgroundColor: trade.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-[#222222] grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400">Avg Win</div>
                  <div className="text-lg font-bold text-[#FF8C42]">{backtestResults.avgWin}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Avg Loss</div>
                  <div className="text-lg font-bold text-[#FFBF6E]">{backtestResults.avgLoss}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Best Trade</div>
                  <div className="text-lg font-bold text-[#FF8C42]">{backtestResults.bestTrade}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Worst Trade</div>
                  <div className="text-lg font-bold text-[#FFBF6E]">{backtestResults.worstTrade}</div>
                </div>
              </div>
            </div>

            {/* Risk Metrics */}
            <div className="card rounded-3xl p-8">
              <h3 className="text-lg font-semibold text-white mb-6">Risk Metrics</h3>
              <div className="space-y-6">
                {[
                  { label: 'Value at Risk (95%)', value: '-2.4%', progress: 35 },
                  { label: 'Conditional VaR', value: '-3.8%', progress: 28 },
                  { label: 'Calmar Ratio', value: '2.24', progress: 72 },
                  { label: 'Sortino Ratio', value: '2.41', progress: 78 },
                  { label: 'Beta', value: '1.05', progress: 52 },
                  { label: 'Alpha', value: '+3.2%', progress: 65 }
                ].map((metric, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{metric.label}</span>
                      <span className="text-sm font-semibold text-white">{metric.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#222222] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFBF6E] progress-bar"
                        style={{ width: `${metric.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights & Recommendations */}
          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFA559] to-[#FFBF6E] rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">AI-Powered Insights</h3>
                <p className="text-sm text-gray-400">Strategy optimization recommendations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-[#FF4500]/10 to-transparent rounded-xl border border-[#FF4500]/20">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#FF8C42] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">Strong Risk-Adjusted Returns</h4>
                    <p className="text-xs text-gray-400">Sharpe ratio of 1.92 indicates excellent risk-adjusted performance compared to market average.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-[#FF6B35]/10 to-transparent rounded-xl border border-[#FF6B35]/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-[#FFBF6E] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">Drawdown Alert</h4>
                    <p className="text-xs text-gray-400">Maximum drawdown of -8.4% is acceptable but consider adding stop-loss mechanisms.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-[#FF8C42]/10 to-transparent rounded-xl border border-[#FF8C42]/20">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-[#FF8C42] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">Optimization Opportunity</h4>
                    <p className="text-xs text-gray-400">Increasing position sizing during high-conviction signals could boost returns by 2-3%.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-[#FFA559]/10 to-transparent rounded-xl border border-[#FFA559]/20">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-[#FFA559] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">Strategy Enhancement</h4>
                    <p className="text-xs text-gray-400">Adding a volatility filter could reduce drawdowns by approximately 15%.</p>
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