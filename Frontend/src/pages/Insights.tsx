import { Brain, TrendingUp, AlertCircle } from 'lucide-react'
import mockData from '../data/mockData.json'

export default function InsightsPage() {
  const { recommendations, sentiment, opportunities, alerts } = mockData.insights

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">AI Insights</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">AI-powered recommendations and market analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="h-6 w-6 text-[var(--color-accent)]" />
            <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
          </div>
          <div className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="font-semibold text-white">{rec.title}</h4>
                  <span className="text-sm font-bold text-[var(--color-accent)]">{rec.confidence}%</span>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Market Sentiment</h3>
          <div className="space-y-4">
            {sentiment.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--color-text-secondary)]">{item.indicator}</span>
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
        <div className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-[var(--color-success)]" />
            <h3 className="text-lg font-semibold text-white">Top Opportunities</h3>
          </div>
          <div className="space-y-3">
            {opportunities.map((opp, idx) => (
              <div key={idx} className="p-3 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">{opp.asset}</span>
                  <span className="text-sm font-bold text-[var(--color-success)]">{opp.potential}</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">{opp.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="h-6 w-6 text-[var(--color-accent-soft)]" />
            <h3 className="text-lg font-semibold text-white">Risk Alerts</h3>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <div key={idx} className="p-3 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors border-l-2 border-[var(--color-accent-soft)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">{alert.alert}</span>
                  <span className={`text-xs font-bold ${alert.severity === 'High' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">{alert.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


