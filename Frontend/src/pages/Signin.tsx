import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import logo from './logo.png'
import mockData from '../data/mockData.json'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const { featurePills, sparklineHeights } = mockData.signin

  useEffect(() => { setMounted(true) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
      

      {/* EXACT NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">Mirror<span className="gradient-text">Wealth</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            {featurePills.map((item) => (
              <Link key={item} to={`/${item.toLowerCase()}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>

          <Link to="/signup" className="pill-btn border border-white/10 px-6 py-2 text-sm hover:bg-white/5">
            Get Started
          </Link>
        </div>
      </nav>

      {/* MAIN CONTENT 50/50 SPLIT */}
      <div className="flex-1 flex pt-20">
        
        {/* LEFT PANEL: 50% */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center px-20 border-r border-white/5 relative panel-left">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,var(--color-accent-05),transparent)]" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
              <Sparkles size={14} className="text-[var(--color-accent)]" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300">Live Analytics</span>
            </div>
            
            <h2 className="text-6xl font-bold leading-[1.1] mb-6">
              Precision <br />
              <span className="gradient-text">Performance.</span>
            </h2>
            
            <p className="text-gray-400 text-lg max-w-md mb-12">
              Our neural network tracks 10,000+ data points per second to ensure your capital is always working.
            </p>

            {/* THE THIN GRAPH */}
            <div className="bg-[var(--color-surface-0)] border border-white/5 rounded-[32px] p-8 max-w-md">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[10px] text-gray-500 font-mono mb-1">NETWORK_STRENGTH</p>
                  <p className="text-2xl font-bold">99.98%</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>

              <div className="flex items-end gap-2 h-24">
                {sparklineHeights.map((h, i) => (
                  <div 
                    key={i} 
                    className="graph-line flex-1"
                    style={{
                      height: `${(h / 130) * 100}%`,
                      background: i > 12 ? 'linear-gradient(to top, var(--color-accent), var(--color-accent-mid))' : 'var(--color-white-08)',
                      animationDelay: `${i * 0.05}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: 50% */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 panel-right">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h1 className="text-4xl font-bold mb-3">Sign in</h1>
              <p className="text-gray-500">Welcome back to the future of wealth.</p>
            </div>

            <div className="flex gap-4 mb-8">
              <button className="pill-btn btn-social text-xs">Google</button>
              <button className="pill-btn btn-social text-xs">Apple</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="email" placeholder="Email" className="pill-input text-sm" />
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="pill-input text-sm" />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button className="pill-btn btn-primary w-full mt-4 group">
                Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-10 flex items-center justify-between text-[11px] text-gray-600 font-medium tracking-wide">
              <Link to="/signup" className="hover:text-[var(--color-accent)]">CREATE ACCOUNT</Link>
              <span className="text-gray-800">|</span>
              <Link to="/reset" className="hover:text-[var(--color-accent)]">FORGOT PASSWORD</Link>
              <span className="text-gray-800">|</span>
              <Link to="/help" className="hover:text-[var(--color-accent)]">SUPPORT</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



