import { useState, useEffect, useMemo } from 'react'
import { 
  ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, 
  DollarSign, PieChart, Brain, Shield, Flame, Clock, Zap, Target,
  ChevronRight, Activity, Sparkles, BarChart3, Lightbulb, Wand2
} from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from '../context/AuthContext'
import KPICards from "../components/KPICards"
import AllocationChart from "../components/AllocationChart"

// --- MOCK DATA ENGINE ---
const getMockData = (rra) => {
  if (rra < 4) { // AGGRESSIVE
    return {
      label: "Aggressive",
      strategy: "Max Alpha / High Volatility",
      holdings: [
        { symbol: "BTC", name: "Bitcoin", qty: 0.42, price: 5420000, change: "+5.2%", allocation: "35%" },
        { symbol: "NVDA", name: "Nvidia Corp", qty: 15, price: 78000, change: "+3.8%", allocation: "25%" },
        { symbol: "ETH", name: "Ethereum", qty: 4.5, price: 280000, change: "+6.1%", allocation: "20%" },
        { symbol: "SOL", name: "Solana", qty: 50, price: 12000, change: "+12.4%", allocation: "20%" },
      ]
    };
  } else if (rra > 7) { // CONSERVATIVE
    return {
      label: "Conservative",
      strategy: "Capital Preservation",
      holdings: [
        { symbol: "GOLD", name: "Sovereign Gold", qty: 500, price: 6200, change: "+0.2%", allocation: "40%" },
        { symbol: "LIQUID", name: "Liquid ETF", qty: 1000, price: 1000, change: "+0.01%", allocation: "30%" },
        { symbol: "HDFCBK", name: "HDFC Bank Ltd", qty: 150, price: 1450, change: "+0.5%", allocation: "20%" },
        { symbol: "TCS", name: "Tata Consultancy", qty: 20, price: 3820, change: "-0.2%", allocation: "10%" },
      ]
    };
  } else { // MODERATE
    return {
      label: "Moderate",
      strategy: "Balanced Growth",
      holdings: [
        { symbol: "RELIANCE", name: "Reliance Ind.", qty: 100, price: 2650, change: "+2.5%", allocation: "30%" },
        { symbol: "INFY", name: "Infosys Ltd", qty: 75, price: 1620, change: "+3.1%", allocation: "25%" },
        { symbol: "NIFTY", name: "Nifty 50 ETF", qty: 500, price: 220, change: "+1.2%", allocation: "25%" },
        { symbol: "GOLD", name: "Gold ETF", qty: 100, price: 5000, change: "+0.1%", allocation: "20%" },
      ]
    };
  }
};

export default function DashboardPage() {
  const { user } = useAuth();
  
  const rra = user?.rra_coefficient || 5.0;
  const mock = useMemo(() => getMockData(rra), [rra]);

  const [metrics, setMetrics] = useState({
    totalValue: 5842500,
    dailyPnL: 12450,
    dailyPnLPercent: 2.15,
    riskScore: Math.round((11 - rra) * 10),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        dailyPnL: prev.dailyPnL + (Math.random() * 1000 - 500),
        dailyPnLPercent: prev.dailyPnLPercent + (Math.random() - 0.5) * 0.1,
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handler for the new Recommend button
  const handleGetRecommendation = () => {
    alert(`AI Engine: Analyzing RRA ${rra.toFixed(2)}... Generating custom strategy for ${user?.full_name || 'user'}.`);
    // This is where you'd trigger your Llama backend call
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 pb-20">
      <style>{`
        * { font-family: "Space Grotesk", sans-serif; }
        :root {
          --accent: #FF4500;
          --accent-soft: #FF6B35;
          --surface: #0a0a0a;
          --border-soft: #222222;
        }
        .card { background: #0f0f0f; border: 1px solid var(--border-soft); border-radius: 1.5rem; }
        .pill { 
          display: inline-flex; align-items: center; gap: 0.5rem; 
          padding: 0.4rem 0.8rem; border-radius: 2rem; border: 1px solid #333;
          background: rgba(255,255,255,0.05); font-size: 0.75rem; transition: all 0.2s;
        }
        .pill:hover { background: rgba(255,255,255,0.1); border-color: var(--accent); }
        .btn-primary {
          background: var(--accent); color: white; font-weight: 700;
          padding: 0.6rem 1.2rem; border-radius: 2rem; display: flex; align-items: center; gap: 0.5rem;
          transition: transform 0.2s, opacity 0.2s;
        }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-outline {
          border: 1px solid var(--border-soft); color: white; font-weight: 600;
          padding: 0.6rem 1.2rem; border-radius: 2rem; display: flex; align-items: center; gap: 0.5rem;
          background: transparent; transition: all 0.2s;
        }
        .btn-outline:hover { background: rgba(255,69,0,0.05); border-color: var(--accent); }
      `}</style>

      <div className="mx-auto max-w-7xl p-6 space-y-8">
        
        {/* HEADER SECTION */}
        <div className="bg-[#050505] rounded-3xl p-8 border border-[#111] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)] opacity-[0.03] blur-[100px]" />
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="pill border-[var(--accent)] text-[var(--accent)] font-bold uppercase tracking-tighter">
                   {rra < 5 ? <Flame size={14}/> : <Shield size={14}/>} {mock.label} Protocol
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                  <Clock size={12} className="animate-pulse" /> RRA: {rra.toFixed(2)}
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight">
                Command Center
              </h1>
            </div>

            {/* ACTION GROUP */}
            <div className="flex flex-wrap gap-3">
              <button onClick={handleGetRecommendation} className="btn-outline">
                 Recommend
              </button>
              <button className="btn-primary">
                <Zap size={18} /> Rebalance
              </button>
            </div>
          </div>
        </div>

        <KPICards {...metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center border border-[var(--accent)]/20 text-[var(--accent)]">
                  <PieChart />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Neural Allocation</h3>
                  <p className="text-sm text-gray-500">Based on RRA {rra.toFixed(1)}</p>
                </div>
              </div>
            </div>
            <AllocationChart rra={rra} />
          </div>

          {/* AI ENGINE LOG WITH RECOMMEND BUTTON */}
          <div className="card rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Brain size={18} className="text-[var(--accent)]" /> Engine Log
              </h3>
              <div className="space-y-4">
                {[
                  { m: `Volatility adjusted for ${mock.label} profile.`, t: 'Just now' },
                  { m: "RRA Parameters verified.", t: '1h ago' }
                ].map((log, i) => (
                  <div key={i} className="p-3 bg-white/[0.02] border-l-2 border-[var(--accent)] rounded-r-xl">
                    <p className="text-sm text-gray-300 leading-relaxed">{log.m}</p>
                    <span className="text-[10px] uppercase font-mono text-gray-600 mt-2 block">{log.t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Recommendation CTA */}
            <div className="mt-8 pt-6 border-t border-[#222]">
              <p className="text-xs text-gray-500 mb-4 italic">
                Market conditions have shifted since your last login.
              </p>
              <button 
                onClick={handleGetRecommendation}
                className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-[var(--accent)]"
              >
                <Lightbulb size={16} /> Get New Strategy
              </button>
            </div>
          </div>
        </div>

        {/* HOLDINGS TABLE */}
        <div className="card rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <Target className="text-[var(--accent)]" /> Managed Positions
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-500 text-xs uppercase tracking-widest border-bottom border-[#222]">
                  <th className="pb-4 font-medium">Asset Class</th>
                  <th className="pb-4 font-medium text-right">Value</th>
                  <th className="pb-4 font-medium text-right">Allocation</th>
                  <th className="pb-4 font-medium text-right">24h Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {mock.holdings.map((h, idx) => (
                  <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs group-hover:text-[var(--accent)] border border-white/5 uppercase">
                        {h.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{h.symbol}</div>
                        <div className="text-xs text-gray-500">{h.name}</div>
                      </div>
                    </td>
                    <td className="py-5 text-right font-bold text-white font-mono">₹{(h.qty * h.price).toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                    <td className="py-5 text-right">
                      <span className="bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-1 rounded text-[10px] font-bold">
                        {h.allocation}
                      </span>
                    </td>
                    <td className="py-5 text-right">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${h.change.startsWith('-') ? 'text-gray-500 bg-gray-500/10' : 'text-[#FF8C42] bg-[#FF8C42]/10'}`}>
                        {h.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}