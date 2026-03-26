import { RefreshCw, DollarSign, TrendingUp } from 'lucide-react'

export default function RebalancePage() {
  return (
    <div className="mx-auto max-w-7xl p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Rebalance Center</h2>
        <p className="text-sm text-[#AAAAAA] mt-2">Manage your portfolio rebalancing strategy.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw className="h-6 w-6 text-[#FF4500]" />
              <h3 className="text-lg font-semibold text-white">Rebalancing Proposal</h3>
            </div>

            <div className="space-y-4">
              {[
                { asset: 'Equity', current: 48, target: 45, action: 'Sell', amount: '₹17.5L' },
                { asset: 'Debt', current: 28, target: 30, action: 'Buy', amount: '₹11.7L' },
                { asset: 'Gold', current: 16, target: 15, action: 'Sell', amount: '₹5.8L' },
                { asset: 'Crypto', current: 8, target: 10, action: 'Buy', amount: '₹11.7L' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-[#222222] hover:border-[#FF4500]/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white">{item.asset}</h4>
                      <p className="text-sm text-[#AAAAAA]">Current: {item.current}% → Target: {item.target}%</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${item.action === 'Buy' ? 'text-[#00FF88]' : 'text-red-400'}`}>
                        {item.action}
                      </p>
                      <p className="text-sm text-[#AAAAAA]">{item.amount}</p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-[#222222] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF4500] to-[#FF6B35]"
                      style={{ width: `${item.current}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 bg-[#FF4500] hover:bg-[#FF6B35] text-white font-semibold py-3 rounded-lg transition-colors">
              Execute Rebalance
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-6 w-6 text-[#00FF88]" />
              <h3 className="text-lg font-semibold text-white">Tax Impact</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#AAAAAA]">Capital Gains</span>
                <span className="font-semibold text-white">₹2.5L</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#AAAAAA]">Tax Liability</span>
                <span className="font-semibold text-red-400">₹37.5K</span>
              </div>
              <div className="h-px bg-[#222222] my-2"></div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#AAAAAA]">Net Benefit</span>
                <span className="font-semibold text-[#00FF88]">₹2.1L</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-[#FF6B35]" />
              <h3 className="text-lg font-semibold text-white">Rebalance Settings</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="frequency" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-white">Quarterly</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="frequency" className="w-4 h-4" />
                <span className="text-sm text-white">Semi-Annual</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="frequency" className="w-4 h-4" />
                <span className="text-sm text-white">Annual</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
