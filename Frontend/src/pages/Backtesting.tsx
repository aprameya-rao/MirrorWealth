import mockData from '../data/mockData.json'

export default function BacktestingPage() {
  const { recentBacktests, performanceMetrics } = mockData.backtesting

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Backtesting Suite</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">Test your investment strategies against historical data.</p>
      </div>

      <div className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Create New Backtest</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Strategy Name</label>
            <input
              type="text"
              placeholder="Enter strategy name"
              className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-white placeholder-[var(--color-text-muted-3)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Start Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-white focus:border-[var(--color-accent)] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">End Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-white focus:border-[var(--color-accent)] focus:outline-none transition-colors"
              />
            </div>
          </div>
          <button className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] text-white font-semibold py-4 px-8 rounded-3xl shadow-lg ">
            Run Backtest
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Backtests</h3>
          <div className="space-y-3">
            {recentBacktests.map((test, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 cursor-pointer transition-all group"
              >
                <p className="font-semibold text-white group-hover:text-[var(--color-accent)]">{test.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-[var(--color-success)]">Return: {test.return}</span>
                  <span className="text-sm text-[var(--color-text-secondary)]">{test.trades} trades</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Strategy Performance</h3>
          <div className="space-y-4">
            {performanceMetrics.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-surface-2)]">
                <span className="text-[var(--color-text-secondary)]">{item.metric}</span>
                <span className={`font-semibold ${item.value.includes('-') ? 'text-red-400' : 'text-[var(--color-success)]'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


