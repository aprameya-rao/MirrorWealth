import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Activity, Shield, Flame, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import logo from './logo.png' // Adjust this path if your logo is elsewhere!

// Types matching your backend schemas
interface RiskQuestion {
  id: number;
  text: string;
  weight: number;
}

interface RiskAssessmentResponse {
  user_id: string | number;
  rra_coefficient: number;
  risk_level: string;
}

export default function Questionnaire() {
  const [questions, setQuestions] = useState<RiskQuestion[]>([])
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<RiskAssessmentResponse | null>(null)
  const [error, setError] = useState('')
  
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchQuestions = async () => {
      // Fallback data in case the DB is empty or backend is unreachable
      const fallbackData = [
        { id: 1, text: "How would you react if your portfolio lost 20% of its value in a month?", weight: 1.5 },
        { id: 2, text: "What is your primary goal for this investment portfolio?", weight: 1.2 },
        { id: 3, text: "When do you expect to start withdrawing significant funds?", weight: 1.0 },
      ]

      try {
        const response = await api.get('/questions')
        const data = response.data && response.data.length > 0 ? response.data : fallbackData
        setQuestions(data)
      } catch (err) {
        console.error("Backend not reachable, using fallback data", err)
        setQuestions(fallbackData)
        setError("Offline mode: Connect your backend to save results.")
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [])

  const handleSelectScore = (score: number) => {
    const currentQ = questions[currentStep]
    if (!currentQ) return
    
    setAnswers(prev => ({ ...prev, [currentQ.id]: score }))
    
    // Auto-advance after a short delay for smooth UX
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1)
      }
    }, 400)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    
    const payload = {
      user_id: user?.id || 1, // Fallback to 1 if auth isn't fully wired
      answers: Object.entries(answers).map(([q_id, score]) => ({
        question_id: parseInt(q_id),
        selected_score: score
      }))
    }

    try {
      const response = await api.post('/submit', payload)
      setResult(response.data)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.detail || 'Failed to submit assessment.')
    } finally {
      setSubmitting(false)
    }
  }

  // Pre-defined score options for the UI
  const scoreOptions = [
    { value: 1, label: "Highly Averse", desc: "Protect my capital at all costs." },
    { value: 4, label: "Cautious", desc: "Prefer stability over high returns." },
    { value: 7, label: "Balanced", desc: "Willing to take calculated risks." },
    { value: 10, label: "Aggressive", desc: "Maximize returns, accept high volatility." }
  ]

  const progressPercentage = questions.length > 0 
    ? ((Object.keys(answers).length) / questions.length) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden dark">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap');
        * { font-family: 'Space Grotesk', system-ui, sans-serif; }

        .gradient-text {
          background: linear-gradient(135deg, #FF4500 0%, #FF6B35 50%, #FF8C42 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .gradient-bg { background: linear-gradient(135deg, #FF4500, #FF6B35); }

        .panel-left { opacity: 0; transform: translateX(-30px); animation: slideIn 0.8s ease forwards; }
        .panel-right { opacity: 0; transform: translateX(30px); animation: slideIn 0.8s ease 0.1s forwards; }
        @keyframes slideIn { to { opacity: 1; transform: translateX(0); } }

        .option-card {
          background: var(--card);
          border: 1px solid var(--border);
          transition: all 0.2s ease;
        }
        .option-card:hover { border-color: #FF4500; transform: translateY(-2px); }
        .option-card.selected { border-color: #FF4500; background: rgba(255, 69, 0, 0.05); }

        .pill-btn {
          border-radius: 999px; padding: 14px 28px; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s;
        }
        .btn-primary { background: linear-gradient(135deg, #FF4500, #FF6B35); color: white; }
        .btn-primary:hover { transform: scale(1.02); box-shadow: 0 0 20px rgba(255,69,0,0.4); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">Mirror<span className="gradient-text">Wealth</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <span className="text-sm text-muted-foreground">Step {currentStep + 1} of {questions.length || 0}</span>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex pt-20">
        
        {/* LEFT PANEL */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center px-20 border-r border-border relative panel-left bg-sidebar">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,69,0,0.03),transparent)]" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-border rounded-full px-4 py-1.5 mb-8">
              <Activity size={14} className="text-[#FF4500]" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Risk Calibration</span>
            </div>
            
            <h2 className="text-5xl font-bold leading-[1.1] mb-6">
              Define your <br />
              <span className="gradient-text">Financial DNA.</span>
            </h2>
            
            <p className="text-muted-foreground text-lg max-w-md mb-12">
              Our neural engine adapts to your specific risk tolerance to build a portfolio tailored entirely to your goals.
            </p>

            <div className="bg-card border border-border rounded-[32px] p-8 max-w-md">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] text-muted-foreground font-mono">CALIBRATION_PROGRESS</p>
                <p className="text-xl font-bold">{Math.round(progressPercentage)}%</p>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full gradient-bg transition-all duration-500 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 panel-right bg-background">
          <div className="w-full max-w-md">
            
            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-[#FF4500]/20 border-t-[#FF4500] rounded-full animate-spin" />
                <p className="text-muted-foreground animate-pulse">Initializing neural matrix...</p>
              </div>
            ) : result ? (
              <div className="text-center animate-in fade-in zoom-in duration-500">
                <div className="inline-flex h-20 w-20 rounded-full bg-[#FF4500]/10 items-center justify-center mb-6">
                  {result.risk_level === 'Aggressive' ? <Flame size={32} className="text-[#FF4500]" /> : 
                   result.risk_level === 'Conservative' ? <Shield size={32} className="text-[#FF4500]" /> : 
                   <Activity size={32} className="text-[#FF4500]" />}
                </div>
                <h2 className="text-4xl font-bold mb-2">Profile <span className="gradient-text">Calibrated</span></h2>
                <p className="text-muted-foreground mb-8">Your unique RRA Coefficient has been processed.</p>
                
                <div className="bg-card border border-border rounded-2xl p-6 mb-8 text-left">
                  <div className="flex justify-between items-center border-b border-border pb-4 mb-4">
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">Risk Level</span>
                    <span className="text-lg font-bold text-foreground">{result.risk_level}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground uppercase tracking-wider">RRA Coefficient</span>
                    <span className="text-lg font-mono text-[#FF4500]">{result.rra_coefficient.toFixed(2)} / 10.0</span>
                  </div>
                </div>

                <button onClick={() => navigate('/dashboard')} className="pill-btn btn-primary w-full group">
                  Enter Dashboard
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <div>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl mb-6">
                    {error}
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold leading-tight mb-2">
                    {questions[currentStep]?.text}
                  </h3>
                </div>

                <div className="space-y-3 mb-8">
                  {scoreOptions.map((opt) => {
                    const currentId = questions[currentStep]?.id;
                    const isSelected = currentId ? answers[currentId] === opt.value : false;
                    
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelectScore(opt.value)}
                        className={`w-full text-left p-4 rounded-2xl option-card flex items-center justify-between group ${isSelected ? 'selected' : ''}`}
                      >
                        <div>
                          <p className="font-semibold text-foreground">{opt.label}</p>
                          <p className="text-sm text-muted-foreground mt-1">{opt.desc}</p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-[#FF4500] bg-[#FF4500]' : 'border-muted-foreground group-hover:border-[#FF4500]'}`}>
                          {isSelected && <div className="h-2 w-2 bg-white rounded-full" />}
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    disabled={currentStep === 0 || submitting}
                    className="p-3 rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-white/5 disabled:opacity-30 transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  {currentStep === questions.length - 1 ? (
                    <button 
                      onClick={handleSubmit}
                      disabled={!questions[currentStep]?.id || !answers[questions[currentStep].id] || submitting}
                      className="pill-btn btn-primary group"
                    >
                      {submitting ? 'Analyzing...' : 'Analyze Profile'}
                      {!submitting && <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />}
                    </button>
                  ) : (
                    <button 
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      disabled={!questions[currentStep]?.id || !answers[questions[currentStep].id]}
                      className="pill-btn bg-white/10 hover:bg-white/20 text-foreground group disabled:opacity-50"
                    >
                      Next
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}