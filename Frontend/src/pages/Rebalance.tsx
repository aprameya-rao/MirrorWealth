import { RefreshCw, DollarSign, TrendingUp } from 'lucide-react'
import mockData from '../data/mockData.json'

export default function RebalancePage() {
  const { proposals, taxImpact, frequencies } = mockData.rebalance

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Rebalance Center</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">Manage your portfolio rebalancing strategy.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw className="h-6 w-6 text-[var(--color-accent)]" />
              <h3 className="text-lg font-semibold text-white">Rebalancing Proposal</h3>
            </div>

            <div className="space-y-4">
              {proposals.map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white">{item.asset}</h4>
                      <p className="text-sm text-[var(--color-text-secondary)]">Current: {item.current}% → Target: {item.target}%</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${item.action === 'Buy' ? 'text-[var(--color-success)]' : 'text-red-400'}`}>
                        {item.action}
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary)]">{item.amount}</p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-soft)]"
                      style={{ width: `${item.current}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 bg-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] text-white font-semibold py-3 rounded-lg transition-colors">
              Execute Rebalance
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-6 w-6 text-[var(--color-success)]" />
              <h3 className="text-lg font-semibold text-white">Tax Impact</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-secondary)]">Capital Gains</span>
                <span className="font-semibold text-white">{taxImpact.capitalGains}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-secondary)]">Tax Liability</span>
                <span className="font-semibold text-red-400">{taxImpact.taxLiability}</span>
              </div>
              <div className="h-px bg-[var(--color-border)] my-2"></div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-secondary)]">Net Benefit</span>
                <span className="font-semibold text-[var(--color-success)]">{taxImpact.netBenefit}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-[var(--color-accent-soft)]" />
              <h3 className="text-lg font-semibold text-white">Rebalance Settings</h3>
            </div>
            <div className="space-y-3">
              {frequencies.map((label, idx) => (
                <label key={label} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="frequency" defaultChecked={idx === 0} className="w-4 h-4" />
                  <span className="text-sm text-white">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


