import { useState } from 'react'

interface AllocationData {
  name: string
  value: number
  color: string
}

const allocationData: AllocationData[] = [
  { name: 'Equity', value: 45, color: '#FF4500' },
  { name: 'Debt', value: 30, color: '#FF6B35' },
  { name: 'Gold', value: 15, color: '#FFB84D' },
  { name: 'Crypto', value: 10, color: '#FFA500' },
]

export default function AllocationChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const totalValue = 5842500

  const generateDonutSegments = () => {
    let currentAngle = -90
    const segments = allocationData.map((item, index) => {
      const sliceAngle = (item.value / 100) * 360
      const startAngle = currentAngle
      const endAngle = currentAngle + sliceAngle

      const startRad = (startAngle * Math.PI) / 180
      const endRad = (endAngle * Math.PI) / 180

      const x1 = 100 + 80 * Math.cos(startRad)
      const y1 = 100 + 80 * Math.sin(startRad)
      const x2 = 100 + 80 * Math.cos(endRad)
      const y2 = 100 + 80 * Math.sin(endRad)

      const x3 = 100 + 45 * Math.cos(endRad)
      const y3 = 100 + 45 * Math.sin(endRad)
      const x4 = 100 + 45 * Math.cos(startRad)
      const y4 = 100 + 45 * Math.sin(startRad)

      const largeArc = sliceAngle > 180 ? 1 : 0

      const path = `M ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A 45 45 0 ${largeArc} 0 ${x4} ${y4} Z`

      currentAngle += sliceAngle

      return { path, index }
    })

    return segments
  }

  const segments = generateDonutSegments()

  return (
    <div className="rounded-2xl bg-card border border-border p-8">
      <h3 className="text-lg font-semibold text-foreground mb-8">Portfolio Allocation</h3>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Donut Chart */}
        <div className="relative w-80 h-80">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {segments.map((segment) => {
              const data = allocationData[segment.index]
              return (
                <g key={segment.index}>
                  <path
                    d={segment.path}
                    fill={data.color}
                    opacity={hoveredIndex === null || hoveredIndex === segment.index ? 1 : 0.3}
                    className="transition-all duration-300 cursor-pointer hover:opacity-100"
                    onMouseEnter={() => setHoveredIndex(segment.index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                </g>
              )
            })}
            {/* Center circle for donut effect */}
            <circle cx="100" cy="100" r="40" fill="rgb(17, 17, 17)" />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-sm text-text-secondary">Total Value</p>
              <p className="text-2xl font-bold text-foreground">
                ₹{(totalValue / 100000).toFixed(1)}L
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-4">
          {allocationData.map((item, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center gap-3 cursor-pointer transition-all duration-300 p-2 rounded-lg ${
                hoveredIndex === null || hoveredIndex === index
                  ? 'opacity-100'
                  : 'opacity-40'
              }`}
            >
              <div
                className="h-4 w-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-text-secondary">
                  {item.value}% • ₹{(totalValue * (item.value / 100) / 100000).toFixed(1)}L
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
