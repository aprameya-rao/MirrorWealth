import { RefreshCw, DollarSign, TrendingUp, Settings, AlertTriangle, CheckCircle, ArrowUpDown, Clock, Zap, Shield, BarChart3, PieChart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function RebalancePage() {
  const [frequency, setFrequency] = useState('quarterly')
  const [autoRebalance, setAutoRebalance] = useState(false)

  const rebalancingProposal = [
    { asset: 'Equity', current: 48, target: 45, action: 'Sell', amount: '₹17.5L', deviation: '+3%' },
    { asset: 'Debt', current: 28, target: 30, action: 'Buy', amount: '₹11.7L', deviation: '-2%' },
    { asset: 'Gold', current: 16, target: 15, action: 'Sell', amount: '₹5.8L', deviation: '+1%' },
    { asset: 'Crypto', current: 8, target: 10, action: 'Buy', amount: '₹11.7L', deviation: '-2%' }
  ]

  const taxImpact = {
    capitalGains: '₹2.5L',
    taxLiability: '₹37.5K',
    netBenefit: '₹2.1L',
    shortTerm: '₹1.2L',
    longTerm: '₹1.3L'
  }

  const rebalanceHistory = [
    { date: 'Dec 2024', changes: '4 positions', impact: '+8.2%', status: 'completed' },
    { date: 'Sep 2024', changes: '3 positions', impact: '+5.7%', status: 'completed' },
    { date: 'Jun 2024', changes: '5 positions', impact: '+6.1%', status: 'completed' }
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

        .text-gradient {
          background: linear-gradient(90deg, var(--accent), var(--accent-soft));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(255, 69, 0, 0.05) 0%, rgba(255, 69, 0, 0.02) 100%);
          border: 1px solid rgba(255, 69, 0, 0.15);
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #222222;
          transition: 0.3s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #FF4500;
        }

        input:checked + .slider:before {
          transform: translateX(20px);
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
                  <span className="text-xs text-[var(--accent-soft)] uppercase tracking-wider font-medium">Portfolio Management</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3.5 w-3.5 text-[#FF8C42] animate-pulse" />
                    <span className="text-xs text-gray-400">Last rebalance: Dec 2024</span>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
                Rebalance Center
              </h1>
              <p className="mt-3 text-lg text-gray-400 max-w-lg">
                Optimize portfolio allocation • Minimize drift • Maximize returns
              </p>
            </div>
 
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FF8C42] rounded-full animate-ping"></div>
                <span className="text-xs text-[#FF8C42] font-medium">Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rebalancing Proposal */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-soft)] rounded-xl flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Rebalancing Proposal</h3>
                  <p className="text-sm text-gray-400">Recommended adjustments</p>
                </div>
              </div>
              <div className="pill text-sm">
                <ArrowUpDown className="h-3 w-3" /> Target: Optimal Allocation
              </div>
            </div>

            <div className="space-y-4">
              {rebalancingProposal.map((item, idx) => (
                <div key={idx} className="group p-4 rounded-xl border border-[#222222] hover:border-[#FF4500]/30 hover:bg-[#1a1a1a] transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white group-hover:text-[#FF8C42] transition-colors">{item.asset}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF8C42]/10 text-[#FF8C42]">
                          {item.deviation}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        Current: {item.current}% → Target: {item.target}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${item.action === 'Buy' ? 'text-[#FF8C42]' : 'text-[#FFBF6E]'}`}>
                        {item.action} {item.amount}
                      </p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-[#222222] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF4500] to-[#FF8C42] rounded-full transition-all"
                      style={{ width: `${item.current}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 bg-gradient-to-r from-[#FF4500] to-[#FF8C42] hover:from-[#FF6B35] hover:to-[#FFA559] text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl">
              Execute Rebalance
            </button>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Tax Impact */}
            <div className="card rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFA559] to-[#FFBF6E] rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Tax Impact</h3>
                  <p className="text-sm text-gray-400">Estimated liability</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-400">Capital Gains</span>
                  <span className="font-semibold text-white">{taxImpact.capitalGains}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-400">Short-term Gains</span>
                  <span className="text-sm text-[#FFBF6E]">{taxImpact.shortTerm}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-400">Long-term Gains</span>
                  <span className="text-sm text-[#FF8C42]">{taxImpact.longTerm}</span>
                </div>
                <div className="h-px bg-[#222222] my-2"></div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-400">Tax Liability</span>
                  <span className="font-semibold text-[#FFBF6E]">{taxImpact.taxLiability}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-400">Net Benefit</span>
                  <span className="font-semibold text-[#FF8C42] text-lg">{taxImpact.netBenefit}</span>
                </div>
              </div>
            </div>

            {/* Rebalance Settings */}
            <div className="card rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FF8C42] rounded-xl flex items-center justify-center">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Rebalance Settings</h3>
                  <p className="text-sm text-gray-400">Frequency & thresholds</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Rebalance Frequency</label>
                  <div className="flex gap-2">
                    {['quarterly', 'semi-annual', 'annual'].map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setFrequency(freq)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${
                          frequency === freq 
                            ? 'bg-[#FF4500] text-white' 
                            : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                        }`}
                      >
                        {freq === 'semi-annual' ? 'Semi-Annual' : freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Tolerance Threshold</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    defaultValue="5"
                    className="w-full h-2 bg-[#222222] rounded-lg appearance-none cursor-pointer accent-[#FF4500]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1%</span>
                    <span>5%</span>
                    <span>10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rebalance History */}
          <div className="card rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF8C42] to-[#FFA559] rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Rebalance History</h3>
                <p className="text-sm text-gray-400">Previous rebalancing actions</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {rebalanceHistory.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1a1a1a] transition-all">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[#FF8C42]" />
                      <span className="font-medium text-white">{item.date}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{item.changes} adjusted</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#FF8C42]">{item.impact}</div>
                    <div className="text-xs text-gray-500">{item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rebalance Impact Preview */}
          <div className="card rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFBF6E] to-[#FFD28F] rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Expected Impact</h3>
                <p className="text-sm text-gray-400">Post-rebalance projections</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="stat-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#FF8C42]">+2.3%</div>
                <div className="text-xs text-gray-400 mt-1">Expected Return Boost</div>
              </div>
              <div className="stat-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#FF8C42]">-1.8%</div>
                <div className="text-xs text-gray-400 mt-1">Risk Reduction</div>
              </div>
              <div className="stat-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#FF8C42]">1.92</div>
                <div className="text-xs text-gray-400 mt-1">New Sharpe Ratio</div>
              </div>
              <div className="stat-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#FF8C42]">32.1%</div>
                <div className="text-xs text-gray-400 mt-1">Diversification Score</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#FF8C42]/10 rounded-lg border border-[#FF8C42]/20">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-[#FF8C42] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-300">
                  Rebalancing will bring your portfolio closer to target allocation, 
                  reducing concentration risk and improving risk-adjusted returns.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#FFBF6E] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">Important Note</p>
              <p className="text-xs text-gray-400 mt-1">
                Rebalancing may trigger taxable events. Consider consulting with a tax professional 
                before executing large portfolio adjustments. Estimated tax liability shown above is 
                approximate and may vary based on your tax bracket.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}