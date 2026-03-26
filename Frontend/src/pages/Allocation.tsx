import AllocationChart from '../components/AllocationChart'

export default function AllocationPage() {
  return (
    <div className="mx-auto max-w-7xl p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Portfolio Allocation</h2>
        <p className="text-sm text-[#AAAAAA] mt-2">Manage and optimize your portfolio allocation.</p>
      </div>

      <AllocationChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Suggested Allocations</h3>
          <div className="space-y-4">
            {[
              { name: 'Conservative', allocation: '60% Debt, 40% Equity' },
              { name: 'Balanced', allocation: '50% Equity, 30% Debt, 20% Gold' },
              { name: 'Aggressive', allocation: '70% Equity, 20% Crypto, 10% Gold' }
            ].map((model, idx) => (
              <button
                key={idx}
                className="w-full text-left p-4 rounded-lg border border-[#222222] hover:border-[#FF4500]/50 hover:bg-[#1a1a1a] transition-all group"
              >
                <p className="font-semibold text-white group-hover:text-[#FF4500]">{model.name}</p>
                <p className="text-sm text-[#AAAAAA] mt-1">{model.allocation}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Asset Class Performance</h3>
          <div className="space-y-3">
            {[
              { name: 'Equity', return: '+18.5%' },
              { name: 'Debt', return: '+6.2%' },
              { name: 'Gold', return: '+12.1%' },
              { name: 'Crypto', return: '+45.3%' }
            ].map((asset, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-[#AAAAAA]">{asset.name}</span>
                <span className={`font-semibold ${asset.return.includes('-') ? 'text-red-400' : 'text-[#00FF88]'}`}>
                  {asset.return}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
