import { useState, useEffect, useMemo } from 'react'
import { 
  PieChart, Brain, Shield, Flame, Clock, Zap, Target, Lightbulb, Wand2, X, Cpu, AlertTriangle
} from "lucide-react"
import { useAuth } from '../context/AuthContext'
import api, { ENDPOINTS } from '../api/axios'
import KPICards from "../components/KPICards"
import AllocationChart from "../components/AllocationChart"

// --- DYNAMIC MOCK DATA ENGINE (For the background dashboard) ---
const getMockData = (rra: number) => {
  if (rra < 4) {
    return { label: "Aggressive", strategy: "Max Alpha / High Volatility", holdings: [
        { symbol: "BTC", name: "Bitcoin", qty: 0.42, price: 5420000, change: "+5.2%", allocation: "35%" },
        { symbol: "NVDA", name: "Nvidia Corp", qty: 15, price: 78000, change: "+3.8%", allocation: "25%" },
    ]};
  } else if (rra > 7) {
    return { label: "Conservative", strategy: "Capital Preservation", holdings: [
        { symbol: "GOLD", name: "Sovereign Gold", qty: 500, price: 6200, change: "+0.2%", allocation: "40%" },
        { symbol: "LIQUID", name: "Liquid ETF", qty: 1000, price: 1000, change: "+0.01%", allocation: "30%" },
    ]};
  } else {
    return { label: "Moderate", strategy: "Balanced Growth", holdings: [
        { symbol: "RELIANCE", name: "Reliance Ind.", qty: 100, price: 2650, change: "+2.5%", allocation: "30%" },
        { symbol: "INFY", name: "Infosys Ltd", qty: 75, price: 1620, change: "+3.1%", allocation: "25%" },
    ]};
  }
};

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Safely grab RRA or default to 5.0
  const rra = user?.rra_coefficient || 5.0;
  const mock = useMemo(() => getMockData(rra), [rra]);

  const [metrics, setMetrics] = useState({
    totalValue: 5842500, 
    dailyPnL: 12450, 
    dailyPnLPercent: 2.15, 
    riskScore: Math.round((11 - rra) * 10),
  });

  // --- MODAL & POLLING STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState('idle'); // 'idle' | 'processing' | 'success' | 'error' | 'executing'
  const [pollingMsg, setPollingMsg] = useState('');
  const [recommendationData, setRecommendationData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Simulate live market ticks for the KPI cards
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

  // --- ASYNC POLLING LOGIC ---
 // --- NON-BLOCKING POLLING LOGIC ---
  const handleGetRecommendation = async () => {
    setIsModalOpen(true);
    setAiStatus('processing');
    setPollingMsg('Initializing Neural Engine...');
    setRecommendationData(null);
    setErrorMessage('');

    try {
      // 1. Trigger the async task (Notice the {} to prevent the 422 Error!)
      const initRes = await api.post(ENDPOINTS.PORTFOLIO.RECOMMEND_ASYNC, {});
      
      const taskId = initRes.data.task_id;
      setPollingMsg(initRes.data.message || 'AI is analyzing your portfolio. This may take 10-15 seconds.');

      // 2. Start Non-Blocking Polling Loop
      const pollInterval = setInterval(async () => {
        try {
          // Check the status
          const statusRes = await api.get(ENDPOINTS.PORTFOLIO.TASK_STATUS(taskId));
          const statusData = statusRes.data;

          if (statusData.status === 'success') {
            clearInterval(pollInterval); // Stop polling
            setRecommendationData(statusData);
            setAiStatus('success');
          } else if (statusData.status === 'failed') {
            clearInterval(pollInterval); // Stop polling
            setAiStatus('error');
            setErrorMessage('Engine failed to generate a valid strategy.');
          } else {
            // Still processing, update UI
            setPollingMsg(statusData.message || 'Crunching multi-variable risk metrics...');
          }
        } catch (pollErr) {
          clearInterval(pollInterval); // Stop polling on error
          console.error("Polling Error:", pollErr);
          setAiStatus('error');
          setErrorMessage('Lost connection during analysis.');
        }
      }, 5000); // Fires exactly every 5 seconds

      // Optional: Store the interval ID in a ref so you can clear it if the user closes the modal
      // pollingIntervalRef.current = pollInterval; 

    } catch (err: any) {
      console.error("AI Recommendation Error:", err);
      setAiStatus('error');
      setErrorMessage(err.response?.data?.detail || 'Failed to start the AI Engine.');
    }
  };
  // --- EXECUTE TRADE LOGIC ---
  // --- EXECUTE TRADE LOGIC ---
  const handleExecute = async () => {
    setAiStatus('executing');
    try {
      // 1. Format the payload exactly how FastAPI expects it
      const executePayload = {
        request: {}, // Pass an empty object as requested by the schema
        action_plan: recommendationData.recommendations // Map the trades to 'action_plan'
      };

      // 2. Send it to the backend
      await api.post(ENDPOINTS.PORTFOLIO.EXECUTE, executePayload);
      
      alert("Trades Executed Successfully! Neural drift corrected.");
      setIsModalOpen(false); // Close modal on success
      
    } catch (err: any) {
      console.error("Execution Error:", err);
      // Helpful to log the exact backend error if it still fails
      const backendError = err.response?.data?.detail || "Failed to execute trades.";
      alert(`Error: ${JSON.stringify(backendError)}`);
      setAiStatus('success'); // Revert back to success state so they can try again
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 pb-20 relative">
      <style>{`
        * { font-family: "Space Grotesk", sans-serif; }
        :root { --accent: #FF4500; --accent-soft: #FF6B35; --surface: #0a0a0a; --border-soft: #222222; }
        .card { background: #0f0f0f; border: 1px solid var(--border-soft); border-radius: 1.5rem; }
        .pill { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.8rem; border-radius: 2rem; border: 1px solid #333; background: rgba(255,255,255,0.05); font-size: 0.75rem; transition: all 0.2s; }
        .btn-primary { background: var(--accent); color: white; font-weight: 700; padding: 0.6rem 1.2rem; border-radius: 2rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: transform 0.2s, opacity 0.2s; cursor: pointer; }
        .btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .btn-outline { border: 1px solid var(--border-soft); color: white; font-weight: 600; padding: 0.6rem 1.2rem; border-radius: 2rem; display: flex; align-items: center; gap: 0.5rem; background: transparent; transition: all 0.2s; cursor: pointer; }
        .btn-outline:hover { background: rgba(255,69,0,0.05); border-color: var(--accent); }
        .glass-card { background: rgba(15, 15, 15, 0.85); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.1); }
        
        /* Custom Scrollbar for Modal */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>

      {/* --- BACKGROUND DASHBOARD LAYER --- */}
      <div className={`mx-auto max-w-7xl p-6 space-y-8 transition-all duration-500 ${isModalOpen ? 'blur-md brightness-50 pointer-events-none' : ''}`}>
        
        {/* Header Widget */}
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
              <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight">Command Center</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={handleGetRecommendation} className="btn-outline shadow-lg shadow-[#FF4500]/10">
                <Wand2 size={18} className="text-[var(--accent)]" /> AI Recommend
              </button>
            </div>
          </div>
        </div>

        <KPICards {...metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Allocation Widget */}
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

          {/* Side Log Widget */}
          <div className="card rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Brain size={18} className="text-[var(--accent)]" /> Engine Log
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-white/[0.02] border-l-2 border-[var(--accent)] rounded-r-xl">
                  <p className="text-sm text-gray-300 leading-relaxed">Volatility adjusted for {mock.label} profile.</p>
                  <span className="text-[10px] uppercase font-mono text-gray-600 mt-2 block">Just now</span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[#222]">
              <button onClick={handleGetRecommendation} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-[var(--accent)]">
                <Lightbulb size={16} /> Get New Strategy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- AI RECOMMENDATION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => aiStatus !== 'processing' && setIsModalOpen(false)} />
          
          <div className="glass-card w-full max-w-3xl rounded-3xl shadow-2xl relative z-10 flex flex-col max-h-[90vh]">
            
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Brain className="text-[var(--accent)] h-6 w-6" />
                <h2 className="text-xl font-bold">Neural Strategy Generation</h2>
              </div>
              {aiStatus !== 'processing' && aiStatus !== 'executing' && (
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              )}
            </div>

            {/* STATE 1: PROCESSING (Polling) */}
            {aiStatus === 'processing' && (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 rounded-full border-t-2 border-[var(--accent)] animate-spin" />
                  <div className="absolute inset-2 rounded-full border-r-2 border-[#FF8C42] animate-spin" style={{ animationDelay: '0.2s', animationDirection: 'reverse' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu className="text-[var(--accent)] animate-pulse" size={32} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Analyzing Data Streams...</h3>
                <p className="text-gray-400 font-mono text-sm max-w-md">{pollingMsg}</p>
              </div>
            )}

            {/* STATE 2: ERROR */}
            {aiStatus === 'error' && (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <AlertTriangle className="text-red-500 h-16 w-16 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Analysis Failed</h3>
                <p className="text-gray-400">{errorMessage}</p>
                <button onClick={() => setIsModalOpen(false)} className="mt-8 btn-outline">Close</button>
              </div>
            )}

            {/* STATE 3: SUCCESS */}
            {aiStatus === 'success' && recommendationData && (
              <div className="overflow-y-auto p-6 space-y-6 flex-1 custom-scrollbar">
                
                {/* Rationale Display */}
                {recommendationData.rationale && (
                  <div className="bg-[#080808] border border-white/5 rounded-2xl p-6">
                    <p className="text-sm text-gray-300 leading-relaxed mb-4">
                      <span className="text-[var(--accent)] font-bold">AI Rationale: </span>
                      {recommendationData.rationale}
                    </p>
                    
                    {recommendationData.portfolio_summary && (
                      <div className="flex gap-6 mt-4 pt-4 border-t border-white/5">
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Target Capital</p>
                          <p className="text-lg font-bold font-mono text-white">₹{recommendationData.portfolio_summary.total_value?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Projected Cash</p>
                          <p className="text-lg font-bold font-mono text-gray-400">₹{recommendationData.portfolio_summary.projected_cash_balance?.toFixed(2)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Recommendations List */}
                {recommendationData.recommendations && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Target Allocations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(recommendationData.recommendations).map(([ticker, details]: any, idx) => (
                        <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-white/[0.04] transition-colors">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${details.action === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                {details.action}
                              </span>
                              <span className="font-bold text-white">{ticker.replace('.NS', '')}</span>
                            </div>
                            <p className="text-xs text-gray-500 font-mono">{details.units} Units @ ₹{details.current_price?.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[var(--accent)] font-bold">{details.target_weight_percentage}%</p>
                            <p className="text-[10px] text-gray-500">Target Wgt</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODAL FOOTER */}
            {aiStatus === 'success' && recommendationData && (
              <div className="p-6 border-t border-white/10 bg-black/50 backdrop-blur-xl flex justify-between items-center rounded-b-3xl">
                <p className="text-xs text-gray-500">Review assets before executing.</p>
                <button onClick={handleExecute} className="btn-primary">
                  <Zap size={16} /> Execute Protocol
                </button>
              </div>
            )}

            {/* STATE 4: EXECUTING OVERLAY */}
            {aiStatus === 'executing' && (
               <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-20 flex flex-col items-center justify-center rounded-3xl">
                  <Zap className="text-[var(--accent)] h-12 w-12 animate-pulse mb-4" />
                  <p className="text-white font-bold text-xl">Executing Trades...</p>
                  <p className="text-gray-400 text-sm mt-2 font-mono">Transmitting to backend nodes</p>
               </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}