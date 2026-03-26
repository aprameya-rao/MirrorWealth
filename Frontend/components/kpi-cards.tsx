'use client'

import { TrendingUp, TrendingDown, Gauge } from 'lucide-react'
import { useEffect, useState } from 'react'

interface KPICardsProps {
  totalValue: number
  dailyPnL: number
  dailyPnLPercent: number
  riskScore: number
}

export default function KPICards({ 
  totalValue = 5842500, 
  dailyPnL = 12450, 
  dailyPnLPercent = 2.15,
  riskScore = 72 
}: KPICardsProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [displayPnL, setDisplayPnL] = useState(0)

  // Animate numbers on mount
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
      <div className="group relative overflow-hidden rounded-2xl bg-[#111111] border border-[#222222] p-6 transition-all duration-300 hover:border-[#FF4500]/50 hover:shadow-lg hover:shadow-[#FF4500]/10">
        <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-[#FF4500]/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <p className="text-sm font-medium text-[#AAAAAA]">Total Portfolio Value</p>
          <h3 className="mt-4 text-3xl font-bold text-white">
            {formatCurrency(Math.round(displayValue))}
          </h3>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-[#AAAAAA]">All Time High: ₹60.5L</span>
            <span className="inline-block rounded-full bg-[#00FF88]/10 px-3 py-1 text-xs font-medium text-[#00FF88]">
              +12.5% YTD
            </span>
          </div>
        </div>
      </div>

      {/* Daily P&L */}
      <div className="group relative overflow-hidden rounded-2xl bg-[#111111] border border-[#222222] p-6 transition-all duration-300 hover:border-[#FF4500]/50 hover:shadow-lg hover:shadow-[#FF4500]/10">
        <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-[#FF4500]/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <p className="text-sm font-medium text-[#AAAAAA]">Daily P&L</p>
          <div className="mt-4 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-white">
              ₹{(displayPnL / 100).toFixed(2)}K
            </h3>
            <span className={`flex items-center gap-1 text-lg font-semibold ${dailyPnLPercent >= 0 ? 'text-[#00FF88]' : 'text-[#FF3366]'}`}>
              {dailyPnLPercent >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {Math.abs(dailyPnLPercent).toFixed(2)}%
            </span>
          </div>
          <div className="mt-4 h-12 bg-[#0A0A0A] rounded-lg flex items-end justify-around px-2">
            {[60, 45, 75, 50, 80, 55, 70].map((height, i) => (
              <div
                key={i}
                className="flex-1 mx-0.5 rounded-t bg-gradient-to-t from-[#FF4500] to-[#FF6B35]"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Score */}
      <div className="group relative overflow-hidden rounded-2xl bg-[#111111] border border-[#222222] p-6 transition-all duration-300 hover:border-[#FF4500]/50 hover:shadow-lg hover:shadow-[#FF4500]/10">
        <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-[#FF4500]/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <p className="text-sm font-medium text-[#AAAAAA]">Risk Score</p>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold text-white">{riskScore}</h3>
              <p className="text-xs text-[#AAAAAA] mt-1">Moderate Risk</p>
            </div>
            <div className="relative h-24 w-24">
              <svg viewBox="0 0 100 100" className="h-full w-full transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#222222"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeDasharray={`${(riskScore / 100) * 282.7} 282.7`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF4500" />
                    <stop offset="100%" stopColor="#FF6B35" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Gauge className="h-8 w-8 text-[#FF4500]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
