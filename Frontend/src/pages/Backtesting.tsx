export default function BacktestingPage() {
  return (
    <div className="mx-auto max-w-7xl p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Backtesting Suite</h2>
        <p className="text-sm text-[#AAAAAA] mt-2">Test your investment strategies against historical data.</p>
      </div>

      <div className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Create New Backtest</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Strategy Name</label>
            <input
              type="text"
              placeholder="Enter strategy name"
              className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-[#222222] text-white placeholder-[#666666] focus:border-[#FF4500] focus:outline-none transition-colors"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Start Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-[#222222] text-white focus:border-[#FF4500] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">End Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-[#222222] text-white focus:border-[#FF4500] focus:outline-none transition-colors"
              />
            </div>
          </div>
          <button className="w-full bg-[#FF4500] hover:bg-[#FF6B35] text-white font-semibold py-3 rounded-lg transition-colors">
            Run Backtest
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Backtests</h3>
          <div className="space-y-3">
            {[
              { name: 'Momentum Strategy', return: '+28.5%', trades: 145 },
              { name: 'Mean Reversion', return: '+15.2%', trades: 89 },
              { name: 'DCA Strategy', return: '+18.7%', trades: 36 }
            ].map((test, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-[#222222] hover:border-[#FF4500]/50 cursor-pointer transition-all group"
              >
                <p className="font-semibold text-white group-hover:text-[#FF4500]">{test.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-[#00FF88]">Return: {test.return}</span>
                  <span className="text-sm text-[#AAAAAA]">{test.trades} trades</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Strategy Performance</h3>
          <div className="space-y-4">
            {[
              { metric: 'Total Return', value: '+28.5%' },
              { metric: 'Win Rate', value: '62%' },
              { metric: 'Profit Factor', value: '1.85' },
              { metric: 'Max Drawdown', value: '-12.3%' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1a1a1a]">
                <span className="text-[#AAAAAA]">{item.metric}</span>
                <span className={`font-semibold ${item.value.includes('-') ? 'text-red-400' : 'text-[#00FF88]'}`}>
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
