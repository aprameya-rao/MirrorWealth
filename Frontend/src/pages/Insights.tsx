import { Brain, TrendingUp, AlertCircle, Sparkles, Target, Award, Zap, ChevronRight, Clock, Activity, Shield, Star, Flame, BarChart3, PieChart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState('recommendations')

  const recommendations = [
    {
      title: 'Increase Equity Exposure',
      description: 'Based on current market conditions, consider increasing equity allocation by 5-10%',
      confidence: 92,
      impact: 'High',
      timeline: 'Short-term'
    },
    {
      title: 'Rebalance Sector Allocation',
      description: 'Tech sector is overweight. Consider shifting 3% to Healthcare',
      confidence: 85,
      impact: 'Medium',
      timeline: 'Medium-term'
    },
    {
      title: 'Lock In Profits',
      description: 'Some positions have reached target levels. Consider taking partial profits',
      confidence: 78,
      impact: 'Medium',
      timeline: 'Immediate'
    },
    {
      title: 'Add Gold Exposure',
      description: 'Hedge against market volatility with 5% allocation to Gold',
      confidence: 88,
      impact: 'Low',
      timeline: 'Long-term'
    }
  ]

  const opportunities = [
    { asset: 'INFY', reason: 'Breaking above resistance', potential: '+12%', confidence: 'High' },
    { asset: 'HDFCBANK', reason: 'Oversold conditions', potential: '+8%', confidence: 'Medium' },
    { asset: 'MARUTI', reason: 'Strong fundamentals', potential: '+15%', confidence: 'High' },
    { asset: 'RELIANCE', reason: 'New business verticals', potential: '+10%', confidence: 'High' }
  ]

  const riskAlerts = [
    { alert: 'Concentration Risk', severity: 'High', action: 'Diversify portfolio', color: '#FF6B35' },
    { alert: 'Sector Overlap', severity: 'Medium', action: 'Review positions', color: '#FF8C42' },
    { alert: 'Currency Exposure', severity: 'Low', action: 'Monitor closely', color: '#FFA559' },
    { alert: 'Liquidity Risk', severity: 'Medium', action: 'Increase cash buffer', color: '#FF8C42' }
  ]

  const marketSentiment = [
    { indicator: 'Overall Sentiment', value: 'Bullish', score: 78, color: '#FF8C42' },
    { indicator: 'Volatility Index', value: 'Moderate', score: 45, color: '#FFA559' },
    { indicator: 'Technical Analysis', value: 'Positive', score: 72, color: '#FF8C42' },
    { indicator: 'Institutional Flow', value: 'Strong', score: 84, color: '#FF8C42' }
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
      `}</style>

      <div className="mx-auto max-w-7xl p-6 space-y-8">
        {/* Header */}
        <div className="gradient-bg rounded-3xl p-8 border border-[var(--border-soft)]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-[var(--accent)] to-[var(--accent-soft)] rounded-lg shadow-lg"></div>
                <div>
                  <span className="text-xs text-[var(--accent-soft)] uppercase tracking-wider font-medium">AI Analysis</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3.5 w-3.5 text-[#FF8C42] animate-pulse" />
                    <span className="text-xs text-gray-400">Updated just now</span>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
                AI Insights
              </h1>
              <p className="mt-3 text-lg text-gray-400 max-w-lg">
                AI-powered recommendations • Market analysis • Risk alerts
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

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {['Recommendations', 'Opportunities', 'Risk Analysis'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`pill text-sm ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Recommendations */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-soft)] rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">AI Recommendations</h3>
                  <p className="text-sm text-gray-400">Personalized portfolio suggestions</p>
                </div>
              </div>
              <div className="pill text-sm">
                Confidence Score
              </div>
            </div>
            
            <div className="space-y-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="group p-4 rounded-xl border border-[#222222] hover:border-[#FF4500]/30 hover:bg-[#1a1a1a] transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h4 className="font-semibold text-white group-hover:text-[#FF8C42] transition-colors">{rec.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#FF8C42]">{rec.confidence}%</span>
                      <div className="w-12 h-1 bg-[#222222] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#FF4500] to-[#FF8C42] rounded-full"
                          style={{ width: `${rec.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{rec.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="px-2 py-1 rounded-full bg-[#FF8C42]/10 text-[#FF8C42]">Impact: {rec.impact}</span>
                    <span className="text-gray-500">Timeline: {rec.timeline}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#222222]">
              <button className="flex items-center gap-2 text-sm text-[#FF8C42] hover:gap-3 transition-all">
                View all recommendations <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Market Sentiment */}
          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF8C42] to-[#FFA559] rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Market Sentiment</h3>
                <p className="text-sm text-gray-400">Real-time analysis</p>
              </div>
            </div>

            <div className="space-y-5">
              {marketSentiment.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">{item.indicator}</span>
                    <span className="text-sm font-semibold" style={{ color: item.color }}>
                      {item.value}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#222222] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-[#FF4500] to-[#FF8C42]"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#222222]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">AI Confidence</span>
                <span className="text-sm font-bold text-[#FF8C42]">84%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Opportunities & Risk Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Opportunities */}
          <div className="card rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFA559] to-[#FFBF6E] rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Top Opportunities</h3>
                <p className="text-sm text-gray-400">Highest potential returns</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {opportunities.map((opp, idx) => (
                <div key={idx} className="group p-3 rounded-lg hover:bg-[#1a1a1a] transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FF8C42]/20 flex items-center justify-center">
                        <Target className="h-4 w-4 text-[#FF8C42]" />
                      </div>
                      <span className="font-semibold text-white group-hover:text-[#FF8C42] transition-colors">{opp.asset}</span>
                    </div>
                    <span className="text-sm font-bold text-[#FF8C42]">{opp.potential}</span>
                  </div>
                  <p className="text-xs text-gray-400 ml-11">{opp.reason}</p>
                  <div className="ml-11 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF8C42]/10 text-[#FF8C42]">
                      {opp.confidence} confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#222222]">
              <button className="flex items-center gap-2 text-sm text-[#FF8C42] hover:gap-3 transition-all">
                View all opportunities <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Risk Alerts */}
          <div className="card rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FF8C42] rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Risk Alerts</h3>
                <p className="text-sm text-gray-400">Critical portfolio risks</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {riskAlerts.map((alert, idx) => (
                <div key={idx} className="group p-3 rounded-lg hover:bg-[#1a1a1a] transition-all cursor-pointer border-l-2" style={{ borderLeftColor: alert.color }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white group-hover:text-[#FF8C42] transition-colors">{alert.alert}</span>
                    <span className={`text-xs font-bold ${alert.severity === 'High' ? 'text-[#FF6B35]' : 'text-[#FFA559]'}`}>
                      {alert.severity} Risk
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{alert.action}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#FF8C42]" />
                <span className="text-xs text-gray-400">Overall Risk Score</span>
              </div>
              <span className="text-sm font-bold text-[#FF8C42]">Moderate</span>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFBF6E] to-[#FFD28F] rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Weekly AI Summary</h3>
              <p className="text-sm text-gray-400">Key takeaways from this week's analysis</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-[#FF8C42]" />
                <span className="text-xs text-gray-400">Market Trend</span>
              </div>
              <p className="text-sm font-semibold text-white">Bullish momentum expected</p>
              <p className="text-xs text-gray-500 mt-1">Based on technical indicators</p>
            </div>
            
            <div className="stat-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-[#FF8C42]" />
                <span className="text-xs text-gray-400">Top Performer</span>
              </div>
              <p className="text-sm font-semibold text-white">Technology Sector</p>
              <p className="text-xs text-gray-500 mt-1">+15.3% this quarter</p>
            </div>
            
            <div className="stat-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-[#FF8C42]" />
                <span className="text-xs text-gray-400">Volatility Forecast</span>
              </div>
               <p className="text-sm font-semibold text-white">Decreasing</p>
              <p className="text-xs text-gray-500 mt-1">VIX down 12%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}