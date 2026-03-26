export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Performance Analytics</h2>
        <p className="text-sm text-[#AAAAAA] mt-2">Detailed insights into your portfolio performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'YTD Return', value: '+24.5%', color: '#00FF88' },
          { label: '1Y Return', value: '+32.1%', color: '#00FF88' },
          { label: 'Best Day', value: '+5.2%', color: '#00FF88' },
          { label: 'Worst Day', value: '-3.8%', color: '#FF6B35' }
        ].map((metric, idx) => (
          <div key={idx} className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
            <p className="text-sm text-[#AAAAAA]">{metric.label}</p>
            <p className="text-3xl font-bold mt-2" style={{ color: metric.color }}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Monthly Returns</h3>
          <div className="space-y-3">
            {[
              { month: 'January', return: '+5.2%' },
              { month: 'February', return: '+3.8%' },
              { month: 'March', return: '+4.5%' },
              { month: 'April', return: '+2.1%' },
              { month: 'May', return: '+6.3%' },
              { month: 'June', return: '+2.6%' }
            ].map((data, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-sm text-[#AAAAAA] w-20">{data.month}</span>
                <div className="flex-1 h-6 rounded bg-[#222222] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF4500] to-[#FF6B35]"
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-[#00FF88] w-16 text-right">{data.return}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Risk Metrics</h3>
          <div className="space-y-6">
            {[
              { label: 'Volatility', value: '14.2%' },
              { label: 'Beta', value: '1.05' },
              { label: 'Max Drawdown', value: '-8.3%' },
              { label: 'Sharpe Ratio', value: '1.85' }
            ].map((metric, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#AAAAAA]">{metric.label}</span>
                  <span className="text-sm font-semibold text-white">{metric.value}</span>
                </div>
                <div className="h-2 rounded-full bg-[#222222] overflow-hidden">
                  <div
                    className="h-full bg-[#FF4500]"
                    style={{ width: `${Math.random() * 100}%` }}
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
