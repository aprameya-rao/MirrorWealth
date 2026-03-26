import { useState } from 'react'
import { 
  TrendingUp, TrendingDown, Calendar, Activity, BarChart3, 
  LineChart, PieChart, Target, Award, Zap, Info, 
  ChevronRight, ArrowUpRight, ArrowDownRight, Clock, Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('1Y')
  const [selectedMetric, setSelectedMetric] = useState('returns')

  const monthlyReturns = [
    { month: 'January', return: '+5.2%', value: 5.2, color: '#FF4500' },
    { month: 'February', return: '+3.8%', value: 3.8, color: '#FF6B35' },
    { month: 'March', return: '+4.5%', value: 4.5, color: '#FF8C42' },
    { month: 'April', return: '+2.1%', value: 2.1, color: '#FFA559' },
    { month: 'May', return: '+6.3%', value: 6.3, color: '#FFBF6E' },
    { month: 'June', return: '+2.6%', value: 2.6, color: '#FFD28F' },
    { month: 'July', return: '+4.8%', value: 4.8, color: '#FF4500' },
    { month: 'August', return: '+3.2%', value: 3.2, color: '#FF6B35' },
    { month: 'September', return: '+1.8%', value: 1.8, color: '#FF8C42' },
    { month: 'October', return: '+5.1%', value: 5.1, color: '#FFA559' },
    { month: 'November', return: '+7.2%', value: 7.2, color: '#FFBF6E' },
    { month: 'December', return: '+4.9%', value: 4.9, color: '#FFD28F' }
  ]

  const quarterlyReturns = [
    { quarter: 'Q1 2024', return: '+13.5%', value: 13.5 },
    { quarter: 'Q2 2024', return: '+11.2%', value: 11.2 },
    { quarter: 'Q3 2024', return: '+8.9%', value: 8.9 },
    { quarter: 'Q4 2024', return: '+17.3%', value: 17.3 }
  ]

  const riskMetrics = [
    { label: 'Volatility (Annualized)', value: '14.2%', benchmark: '12.5%', status: 'above', progress: 68 },
    { label: 'Beta (vs NIFTY)', value: '1.05', benchmark: '1.00', status: 'above', progress: 52 },
    { label: 'Max Drawdown', value: '-8.3%', benchmark: '-10.2%', status: 'above', progress: 35 },
    { label: 'Sharpe Ratio', value: '1.85', benchmark: '1.50', status: 'above', progress: 78 },
    { label: 'Sortino Ratio', value: '2.41', benchmark: '1.80', status: 'above', progress: 82 },
    { label: 'Alpha', value: '+3.2%', benchmark: '0%', status: 'above', progress: 65 }
  ]

  const performanceMetrics = [
    { label: 'YTD Return', value: '+24.5%', change: '+5.2%', color: '#FF4500' },
    { label: '1Y Return', value: '+32.1%', change: '+8.3%', color: '#FF6B35' },
    { label: '3Y Return (CAGR)', value: '+18.7%', change: '+2.1%', color: '#FF8C42' },
    { label: 'Best Day', value: '+5.2%', date: 'May 15, 2024', color: '#FFA559' },
    { label: 'Worst Day', value: '-3.8%', date: 'Aug 12, 2024', color: '#FFBF6E' },
    { label: 'Win Rate', value: '68.4%', change: '+4.2%', color: '#FFD28F' }
  ]

  const cumulativeReturns = [12.4, 18.7, 24.5, 29.8, 35.2, 42.1, 48.5, 53.2, 58.9, 64.3, 71.2, 78.5]

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
      `}</style>

      <div className="mx-auto max-w-7xl p-6 space-y-8">
        {/* Header */}
        <div className="gradient-bg rounded-3xl p-8 border border-[var(--border-soft)]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-[var(--accent)] to-[var(--accent-soft)] rounded-lg shadow-lg"></div>
                <div>
                  <span className="text-xs text-[var(--accent-soft)] uppercase tracking-wider font-medium">Analytics</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3.5 w-3.5 text-[#FF8C42] animate-pulse" />
                    <span className="text-xs text-gray-400">Updated just now</span>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
                Performance Analytics
              </h1>
              <p className="mt-3 text-lg text-gray-400 max-w-lg">
                Detailed insights into your portfolio performance • Risk metrics • Return analysis
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="pill text-sm bg-[var(--accent-bg)] border-[var(--accent)] text-[var(--accent)]">
                <Sparkles className="h-4 w-4" /> AI Analysis
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FF8C42] rounded-full animate-ping"></div>
                <span className="text-xs text-[#FF8C42] font-medium">Live Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex flex-wrap gap-2">
          {['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`pill text-sm ${timeframe === tf ? 'active' : ''}`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceMetrics.slice(0, 6).map((metric, idx) => (
            <div key={idx} className="card p-5 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">{metric.label}</span>
                {metric.label.includes('Worst') ? (
                  <TrendingDown className="h-5 w-5 text-[#FFBF6E]" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-[#FF8C42]" />
                )}
              </div>
              <div className="text-3xl font-bold" style={{ color: metric.color }}>
                {metric.value}
              </div>
              {metric.change && (
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#FF8C42]" />
                  <span className="text-xs text-[#FF8C42]">{metric.change} vs prev</span>
                </div>
              )}
              {metric.date && (
                <div className="text-xs text-gray-500 mt-2">{metric.date}</div>
              )}
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cumulative Returns Chart */}
          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF4500] to-[#FF6B35] rounded-xl flex items-center justify-center">
                  <LineChart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Cumulative Returns</h3>
                  <p className="text-sm text-gray-400">Total return over time</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#FF8C42]">+78.5%</div>
                <div className="text-xs text-gray-500">Since inception</div>
              </div>
            </div>
            
            <div className="h-64 relative">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF4500" />
                    <stop offset="100%" stopColor="#FFBF6E" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0 ${200 - cumulativeReturns[0]} ${cumulativeReturns.map((val, i) => 
                    ` L ${(i / (cumulativeReturns.length - 1)) * 400} ${200 - (val / 100) * 180}`
                  ).join(' ')}`}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                />
                {cumulativeReturns.map((val, i) => (
                  <circle
                    key={i}
                    cx={(i / (cumulativeReturns.length - 1)) * 400}
                    cy={200 - (val / 100) * 180}
                    r="3"
                    fill="#FF8C42"
                    className="hover:r-4 transition-all cursor-pointer"
                  />
                ))}
              </svg>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
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
          </div>

          {/* Quarterly Returns */}
          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FF8C42] rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Quarterly Returns</h3>
                <p className="text-sm text-gray-400">Performance by quarter</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {quarterlyReturns.map((quarter, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{quarter.quarter}</span>
                    <span className="font-semibold text-[#FF8C42]">{quarter.return}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#222222] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFBF6E] progress-bar"
                      style={{ width: `${(quarter.value / 20) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#222222]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Best Quarter</span>
                <span className="text-[#FF8C42] font-bold">Q4 2024 (+17.3%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Returns Detail */}
        <div className="card rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF8C42] to-[#FFA559] rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Monthly Returns Breakdown</h3>
                <p className="text-sm text-gray-400">Performance by month</p>
              </div>
            </div>
            <div className="pill text-sm">2024</div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-full space-y-3">
              {monthlyReturns.map((data, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <span className="text-sm text-gray-400 w-24">{data.month}</span>
                  <div className="flex-1 h-8 rounded-lg bg-[#222222] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF4500] to-[#FFBF6E] progress-bar group-hover:opacity-80 transition-opacity"
                      style={{ width: `${(data.value / 10) * 100}%` }}
                    >
                      <div className="h-full flex items-center justify-end px-2">
                        <span className="text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {data.return}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#FF8C42] w-16 text-right">{data.return}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Metrics & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Metrics Detail */}
          <div className="card rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFA559] to-[#FFBF6E] rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Risk Metrics Analysis</h3>
                <p className="text-sm text-gray-400">Comprehensive risk assessment</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {riskMetrics.map((metric, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{metric.label}</span>
                      {metric.status === 'above' && (
                        <div className="px-1.5 py-0.5 bg-[#FF8C42]/20 rounded text-[10px] text-[#FF8C42]">Above Benchmark</div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white">{metric.value}</span>
                      <span className="text-xs text-gray-500">vs {metric.benchmark}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-[#222222] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFBF6E] progress-bar"
                      style={{ width: `${metric.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 stat-card rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Overall Risk Rating</p>
                  <p className="text-2xl font-bold text-white mt-1">Moderate</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Risk Score</p>
                  <p className="text-2xl font-bold text-[#FF8C42]">42/100</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="card rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFBF6E] to-[#FFD28F] rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Performance Insights</h3>
                <p className="text-sm text-gray-400">AI-powered analysis</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-[#FF4500]/10 to-transparent rounded-xl border border-[#FF4500]/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FF4500]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-[#FF4500]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">Consistent Growth Pattern</h4>
                    <p className="text-xs text-gray-400">Your portfolio has shown positive returns in 9 out of 12 months this year, demonstrating strong consistency.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-[#FF6B35]/10 to-transparent rounded-xl border border-[#FF6B35]/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FF6B35]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="h-4 w-4 text-[#FF6B35]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">Above Average Sharpe Ratio</h4>
                    <p className="text-xs text-gray-400">Your Sharpe ratio of 1.85 indicates excellent risk-adjusted returns compared to market average of 1.2.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-[#FF8C42]/10 to-transparent rounded-xl border border-[#FF8C42]/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FF8C42]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-[#FF8C42]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">Optimization Opportunity</h4>
                    <p className="text-xs text-gray-400">Increasing exposure to high-performing sectors could boost returns by an estimated 3-5% annually.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#222222]">
              <Link to="/insights" className="flex items-center justify-between group">
                <span className="text-sm text-[#FF8C42] font-medium">View detailed insights</span>
                <ChevronRight className="h-4 w-4 text-[#FF8C42] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat-card rounded-xl p-6 text-center">
            <div className="inline-flex p-3 bg-[#FF4500]/20 rounded-xl mb-3">
              <PieChart className="h-6 w-6 text-[#FF4500]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">12</div>
            <div className="text-sm text-gray-400">Asset Classes</div>
          </div>
          
          <div className="stat-card rounded-xl p-6 text-center">
            <div className="inline-flex p-3 bg-[#FF6B35]/20 rounded-xl mb-3">
              <TrendingUp className="h-6 w-6 text-[#FF6B35]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">84%</div>
            <div className="text-sm text-gray-400">Win Rate (Monthly)</div>
          </div>
          
          <div className="stat-card rounded-xl p-6 text-center">
            <div className="inline-flex p-3 bg-[#FF8C42]/20 rounded-xl mb-3">
              <Activity className="h-6 w-6 text-[#FF8C42]" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">2.41</div>
            <div className="text-sm text-gray-400">Sortino Ratio</div>
          </div>
        </div>
      </div>
    </div>
  )
}