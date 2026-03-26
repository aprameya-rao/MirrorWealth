import mockData from '../data/mockData.json'

export default function AnalyticsPage() {
  const { summaryMetrics, monthlyReturns, riskMetrics } = mockData.analytics

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Performance Analytics</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">Detailed insights into your portfolio performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryMetrics.map((metric, idx) => (
          <div key={idx} className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] p-6">
            <p className="text-sm text-[var(--color-text-secondary)]">{metric.label}</p>
            <p className="text-3xl font-bold mt-2" style={{ color: metric.color }}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Monthly Returns</h3>
          <div className="space-y-3">
            {monthlyReturns.map((data, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-sm text-[var(--color-text-secondary)] w-20">{data.month}</span>
                <div className="flex-1 h-6 rounded bg-[var(--color-border)] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-soft)]"
                    style={{ width: `${data.bar}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-[var(--color-success)] w-16 text-right">{data.return}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Risk Metrics</h3>
          <div className="space-y-6">
            {riskMetrics.map((metric, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--color-text-secondary)]">{metric.label}</span>
                  <span className="text-sm font-semibold text-white">{metric.value}</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-accent)]"
                    style={{ width: `${metric.bar}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


