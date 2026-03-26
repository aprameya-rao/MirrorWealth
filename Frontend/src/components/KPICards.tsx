import { TrendingUp, TrendingDown, Gauge } from 'lucide-react'
import { useEffect, useState } from 'react'

interface KPICardsProps {
  totalValue?: number
  dailyPnL?: number
  dailyPnLPercent?: number
  riskScore?: number
}

export default function KPICards({ 
  totalValue = 5842500, 
  dailyPnL = 12450, 
  dailyPnLPercent = 2.15,
  riskScore = 72 
}: KPICardsProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [displayPnL, setDisplayPnL] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayValue(prev => {
        const target = totalValue
        const diff = Math.abs(target - prev)
        if (diff < 10000) return target
        return prev + (diff > 500000 ? 500000 : diff / 10)
      })
    }, 50)
    return () => clearInterval(interval)
  }, [totalValue])

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayPnL(prev => {
        const target = dailyPnL
        const diff = Math.abs(target - prev)
        if (diff < 100) return target
        return prev + (target > prev ? 100 : -100)
      })
    }, 30)
    return () => clearInterval(interval)
  }, [dailyPnL])

  const formatCurrency = (value: number) => {
    return `₹${(value / 100000).toFixed(2)}L`
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Portfolio Value */}
      <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10">
        <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <p className="text-sm font-medium text-text-secondary">Total Portfolio Value</p>
          <h3 className="mt-4 text-3xl font-bold text-foreground">
            {formatCurrency(Math.round(displayValue))}
          </h3>
          <p className="mt-2 text-xs text-text-secondary">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Updated in real-time
          </p>
        </div>
      </div>

      {/* Daily P&L */}
      <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 transition-all duration-300 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10">
        <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <p className="text-sm font-medium text-text-secondary">Daily P&L</p>
          <div className="mt-4 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-foreground">
              ₹{(displayPnL / 100).toFixed(0)}
            </h3>
            <div className="flex items-center gap-1 text-green-500">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-semibold">{dailyPnLPercent.toFixed(2)}%</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-text-secondary">Last 24 hours performance</p>
        </div>
      </div>

      {/* Risk Score */}
      <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 transition-all duration-300 hover:border-accent-secondary/50 hover:shadow-lg hover:shadow-accent-secondary/10">
        <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-accent-secondary/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-secondary">Risk Score</p>
            <Gauge className="h-5 w-5 text-accent-secondary" />
          </div>
          <h3 className="mt-4 text-3xl font-bold text-foreground">{riskScore}</h3>
          <div className="mt-3 h-2 w-full rounded-full bg-border overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent to-accent-secondary transition-all duration-1000"
              style={{ width: `${riskScore}%` }}
            ></div>
          </div>
          <p className="mt-2 text-xs text-text-secondary">Moderate risk exposure</p>
        </div>
      </div>
    </div>
  )
}
