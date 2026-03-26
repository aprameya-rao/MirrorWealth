import { Brain, TrendingUp, AlertCircle } from 'lucide-react'

export default function InsightsPage() {
  return (
    <div className="mx-auto max-w-7xl p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">AI Insights</h2>
        <p className="text-sm text-[#AAAAAA] mt-2">AI-powered recommendations and market analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-[#111111] border border-[#222222] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="h-6 w-6 text-[#FF4500]" />
            <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
          </div>
          <div className="space-y-4">
            {[
              {
                title: 'Increase Equity Exposure',
                description: 'Based on current market conditions, consider increasing equity allocation by 5-10%',
                confidence: 92
              },
              {
                title: 'Rebalance Sector Allocation',
                description: 'Tech sector is overweight. Consider shifting 3% to Healthcare',
                confidence: 85
              },
              {
                title: 'Lock In Profits',
                description: 'Some positions have reached target levels. Consider taking partial profits',
                confidence: 78
              }
            ].map((rec, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-[#222222] hover:border-[#FF4500]/30 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="font-semibold text-white">{rec.title}</h4>
                  <span className="text-sm font-bold text-[#FF4500]">{rec.confidence}%</span>
                </div>
                <p className="text-sm text-[#AAAAAA]">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Market Sentiment</h3>
          <div className="space-y-4">
            {[
              { indicator: 'Overall Sentiment', value: 'Bullish', color: '#00FF88' },
              { indicator: 'Volatility Index', value: 'Moderate', color: '#FFA500' },
              { indicator: 'Technical Analysis', value: 'Positive', color: '#00FF88' }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#AAAAAA]">{item.indicator}</span>
                  <span className="text-sm font-semibold" style={{ color: item.color }}>
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-[#00FF88]" />
            <h3 className="text-lg font-semibold text-white">Top Opportunities</h3>
          </div>
          <div className="space-y-3">
            {[
              { asset: 'INFY', reason: 'Breaking above resistance', potential: '+12%' },
              { asset: 'HDFCBANK', reason: 'Oversold conditions', potential: '+8%' },
              { asset: 'MARUTI', reason: 'Strong fundamentals', potential: '+15%' }
            ].map((opp, idx) => (
              <div key={idx} className="p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">{opp.asset}</span>
                  <span className="text-sm font-bold text-[#00FF88]">{opp.potential}</span>
                </div>
                <p className="text-xs text-[#AAAAAA]">{opp.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="h-6 w-6 text-[#FF6B35]" />
            <h3 className="text-lg font-semibold text-white">Risk Alerts</h3>
          </div>
          <div className="space-y-3">
            {[
              { alert: 'Concentration Risk', severity: 'High', action: 'Diversify portfolio' },
              { alert: 'Sector Overlap', severity: 'Medium', action: 'Review positions' },
              { alert: 'Currency Exposure', severity: 'Low', action: 'Monitor closely' }
            ].map((alert, idx) => (
              <div key={idx} className="p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors border-l-2 border-[#FF6B35]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">{alert.alert}</span>
                  <span className={`text-xs font-bold ${alert.severity === 'High' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs text-[#AAAAAA]">{alert.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
