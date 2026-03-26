import { ArrowRight, BarChart3, Shield, Zap, TrendingUp, Users, Lightbulb, Sparkles, ChevronRight, Rocket, Star, Circle, Brain, Globe, Award, Crown, Clock, Lock, PieChart, LineChart, Bot, DollarSign, Target, Gauge, Heart, Bell, Activity, Database } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import logo from './logo.png'
import LineWaves from '../components/LineWaves'


export default function Home() {
  const [displayText, setDisplayText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  
  const words = ['PRECISION', 'INNOVATION', 'INTELLIGENCE', 'PERFORMANCE']
  
  useEffect(() => {
  const currentWord = words[wordIndex % words.length]
  
  if (!isDeleting && displayText.length === currentWord.length) {
    const pauseTimer = setTimeout(() => {
      setIsDeleting(true)
    }, 2000)
    
    return () => clearTimeout(pauseTimer)
  }
  
  const timer = setTimeout(() => {
    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        setDisplayText(currentWord.slice(0, displayText.length + 1))
      }
    } else {
      if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1))
      } else {
        setIsDeleting(false)
        setWordIndex((prev) => prev + 1)
      }
    }
  }, isDeleting ? 80 : 120)
  
  return () => clearTimeout(timer)
}, [displayText, isDeleting, wordIndex])

  return (
    <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&family=Space+Grotesk:wght@300..700&display=swap');
        
        * {
          font-family: 'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #FF4500 0%, #FF6B35 50%, #FF8C42 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer 3s linear infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        
        .glass-card {
          background: rgba(17, 17, 17, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 69, 0, 0.25);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .glass-card:hover {
          border-color: rgba(255, 69, 0, 0.6);
          background: rgba(17, 17, 17, 0.9);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(255, 69, 0, 0.15);
        }
        
        .glass-button {
          background: rgba(255, 69, 0, 0.2);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 69, 0, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .glass-button:hover {
          background: rgba(255, 69, 0, 0.35);
          border-color: rgba(255, 69, 0, 0.7);
          transform: scale(1.05);
          box-shadow: 0 0 25px rgba(255, 69, 0, 0.3);
        }
        
        .glass-button-primary {
          background: linear-gradient(135deg, #FF4500, #FF6B35);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .glass-button-primary:hover {
          background: linear-gradient(135deg, #FF6B35, #FF4500);
          transform: scale(1.05);
          box-shadow: 0 0 35px rgba(255, 69, 0, 0.5);
        }
        
        .pill-badge {
          background: rgba(255, 69, 0, 0.2);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 69, 0, 0.35);
          transition: all 0.3s ease;
        }
        
        .pill-badge:hover {
          border-color: rgba(255, 69, 0, 0.9);
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(255, 69, 0, 0.25);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes glow-pulse {
          0%, 100% { text-shadow: 0 0 10px rgba(255, 69, 0, 0.5); }
          50% { text-shadow: 0 0 25px rgba(255, 69, 0, 0.8); }
        }
        
        .glow-text {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        
        .typewriter-cursor {
          display: inline-block;
          width: 3px;
          height: 1.2em;
          background: linear-gradient(180deg, #FF4500, #FF6B35);
          margin-left: 4px;
          animation: blink 1s step-end infinite;
          vertical-align: middle;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slideInUp 0.6s ease-out forwards;
        }

        /* How it works - timeline line */
        .step-connector {
          position: absolute;
          top: 28px;
          left: calc(50% + 28px);
          width: calc(100% - 56px);
          height: 1px;
          background: linear-gradient(90deg, rgba(255,69,0,0.6), rgba(255,69,0,0.1));
        }

        /* Stats counter animation */
        @keyframes countUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stat-value {
          animation: countUp 0.8s ease-out forwards;
        }

        /* Scrolling ticker */
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker 20s linear infinite;
          display: flex;
          width: max-content;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }

        /* Horizontal scan line for tech section */
        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(500%); opacity: 0; }
        }
        .scan-line {
          animation: scanline 4s linear infinite;
        }

        /* Orbit animation for CTA */
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(60px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
        }
        .orbit-dot {
          animation: orbit 8s linear infinite;
        }
        .orbit-dot-2 {
          animation: orbit 12s linear infinite reverse;
        }
        .orbit-dot-3 {
          animation: orbit 6s linear infinite;
          animation-delay: -3s;
        }
      `}</style>

      {/* Navigation - Glassmorphism */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <img src={logo} alt="MirrorWealth Logo" className="w-9 h-9 object-cover" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-white">
              Mirror<span className="gradient-text">Wealth</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Privacy', 'Terms', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                className="text-sm text-gray-300 hover:text-white transition-all duration-300 relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF4500] to-[#FF6B35] group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/Signin">
            <button className="glass-button text-white rounded-full px-5 py-2 font-medium">
              Sign In
            </button>
            </Link>
            <Link to="/dashboard">
              <button className="glass-button-primary text-white rounded-full px-6 py-2 font-medium transition-all duration-300">
                Dashboard
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Animated Lines */}
      <section className="relative min-h-screen pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <LineWaves
            speed={0.3}
            innerLineCount={32}
            outerLineCount={36}
            warpIntensity={1}
            rotation={-45}
            edgeFadeWidth={0}
            colorCycleSpeed={1}
            brightness={0.35}
            color1="#ff4500"
            color2="#ff6b35"
            color3="#ff8c42"
            enableMouseInteraction={true}
            mouseInfluence={2}
            lineLength={2.5}
            length={2.5}
            lineLengthMultiplier={2.5}
          />
        </div>
        
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/80 via-black/70 to-black/90"></div>
        
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="text-center space-y-8 animate-slide-up">
            

            <div className="space-y-4">
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight text-white">
                Take Control of
                <span className="block mt-2">
                  Your Finance With
                </span>
                <span className="block mt-2 gradient-text">
                  {displayText}
                  <span className="typewriter-cursor"></span>
                </span>
              </h2>
            </div>

            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-light">
              Advanced portfolio management, AI-powered insights, and real-time market analysis. 
              Everything you need to optimize your wealth strategy in one powerful platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link to="/Signin">
                <button className="group glass-button-primary text-white rounded-full px-8 py-3.5 text-base font-medium transition-all duration-300 flex items-center gap-2">
                  Get Started 
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </Link>
              <button className="group glass-button text-white rounded-full px-8 py-3.5 text-base font-medium transition-all duration-300 flex items-center gap-2">
                Watch Demo
                <Rocket className="h-4 w-4 group-hover:translate-y-[-2px] transition-transform duration-200" />
              </button>
            </div>

            <div className="pt-12 flex flex-wrap items-center justify-center gap-4">
              {[
                { icon: Shield, text: 'Bank-level Security' },
                { icon: Users, text: '50,000+ Users' },
                { icon: TrendingUp, text: 'Real-time Data' },
                { icon: Zap, text: '99.9% Uptime' },
                { icon: Award, text: 'Award Winning' }
              ].map((badge, idx) => {
                const Icon = badge.icon
                return (
                  <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <Icon className="h-3.5 w-3.5 text-[#FF4500] group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-xs text-gray-200 font-medium">{badge.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Plain Black Background from here */}
      <div className="bg-black">
        {/* Features Section */}
        <section id="features" className="py-20 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FF4500]/10 border border-[#FF4500]/20 px-4 py-1.5 mb-4">
                <Star className="h-4 w-4 text-[#FF4500]" />
                <span className="text-sm font-medium text-[#FF4500]">Premium Features</span>
              </div>
              <h3 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3">
                Everything You Need to <span className="gradient-text">Succeed</span>
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto font-light">
                Professional-grade tools designed for modern investors
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: BarChart3, title: 'Real-time Portfolio Analytics', desc: 'Track your investments with live price updates, performance metrics, and interactive charts that update in real-time.' },
                { icon: Brain, title: 'AI-Powered Market Intelligence', desc: 'Advanced machine learning algorithms analyze market trends and provide actionable insights for better decisions.' },
                { icon: TrendingUp, title: 'Smart Portfolio Optimization', desc: 'Markowitz optimization with 5/25 rebalancing strategy to maximize returns while managing risk effectively.' },
                { icon: Clock, title: 'Historical Backtesting Engine', desc: 'Test your investment strategies against 10+ years of historical market data before committing real capital.' },
                { icon: PieChart, title: 'Dynamic Asset Allocation', desc: 'Automatically rebalance your portfolio based on market conditions, risk tolerance, and financial goals.' },
                { icon: Bot, title: 'LangGraph Multi-Agent AI', desc: 'Sophisticated AI agents analyze news, sentiment, and fundamentals to provide comprehensive investment recommendations.' }
              ].map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <div 
                    key={idx} 
                    className="bg-[#111111] border border-[#222222] rounded-2xl p-8 hover:border-[#FF4500]/40 transition-all duration-300 cursor-pointer hover:translate-y-[-4px] group"
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="relative z-10">
                      <div className="mb-4 inline-flex rounded-full bg-[#FF4500]/10 p-3 group-hover:bg-[#FF4500]/20 transition-all duration-300">
                        <Icon className="h-5 w-5 text-[#FF4500]" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2 tracking-tight">{feature.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                      <div className={`mt-4 flex items-center gap-1 text-[#FF4500] text-sm transition-all duration-300 ${hoveredCard === idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                        Learn more <ChevronRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS – Numbered horizontal timeline ── */}
        <section id="how-it-works" className="py-24 px-6 border-t border-[#111111] overflow-hidden">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FF4500]/10 border border-[#FF4500]/20 px-4 py-1.5 mb-4">
                <Circle className="h-4 w-4 text-[#FF4500]" />
                <span className="text-sm font-medium text-[#FF4500]">Simple Process</span>
              </div>
              <h3 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3">
                How It <span className="gradient-text">Works</span>
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto font-light">
                Three simple steps to optimize your financial future
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0">
                {[
                  {
                    step: '01',
                    title: 'Connect Accounts',
                    desc: 'Securely link your investment accounts, bank accounts, and financial data in one place.',
                    icon: Shield,
                    detail: 'OAuth 2.0 · 256-bit TLS · Zero-knowledge',
                  },
                  {
                    step: '02',
                    title: 'AI Risk Assessment',
                    desc: 'Our AI analyzes your portfolio, risk tolerance, and financial goals to create a personalized strategy.',
                    icon: Brain,
                    detail: 'LangGraph agents · Real-time signals · NLP',
                  },
                  {
                    step: '03',
                    title: 'Optimize & Grow',
                    desc: 'Get real-time recommendations, automated rebalancing, and watch your wealth grow.',
                    icon: TrendingUp,
                    detail: 'Markowitz model · 5/25 rule · Monte Carlo',
                  },
                ].map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <div key={idx} className="relative flex flex-col items-center md:items-start px-6 pb-12 md:pb-0 group">
                      {/* Step number + icon row */}
                      <div className="flex items-center gap-3 mb-9">
                        <div className="relative flex-shrink-0 w-12 h-14 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8C42] flex items-center justify-center shadow-lg shadow-[#FF4500]/20 group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold text-lg">{item.step}</span>
                        </div>
                        
                      </div>

                      {/* Icon pill */}
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-1.5 group-hover:border-[#FF4500]/30 transition-colors duration-300">
                        <Icon className="h-3.5 w-3.5 text-[#FF4500]" />
                        <span className="text-xs text-gray-400 font-mono">{item.detail}</span>
                      </div>

                      <h4 className="text-xl font-bold text-white mb-2 tracking-tight">{item.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>

                      {/* Bottom accent bar */}
                      <div className="mt-6 w-0 group-hover:w-full h-px bg-gradient-to-r from-[#FF4500] to-transparent transition-all duration-500" />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>


        {/* ── STATS – Large typographic layout with ticker ── */}
        <section className="py-24 px-6 border-t border-[#111111] overflow-hidden">
          <div className="mx-auto max-w-6xl">

            {/* Big numbers row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1a1a1a] rounded-2xl overflow-hidden mb-16">
              {[
                { value: '$2.5B+', label: 'Assets Under Management', trend: '+47% YoY', icon: DollarSign },
                { value: '50K+', label: 'Active Investors', trend: '+128% Growth', icon: Users },
                { value: '99.9%', label: 'Platform Uptime', trend: 'Enterprise Grade', icon: Gauge },
                { value: '24/7', label: 'Expert Support', trend: 'Real-time', icon: Heart },
              ].map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <div key={idx} className="bg-[#0d0d0d] p-8 flex flex-col justify-between group hover:bg-[#111] transition-colors duration-300">
                    <Icon className="h-5 w-5 text-[#FF4500]/50 mb-6 group-hover:text-[#FF4500] transition-colors duration-300" />
                    <div>
                      <div className="text-4xl md:text-5xl font-bold text-white mb-1 stat-value tracking-tight">{stat.value}</div>
                      <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                      <div className="text-xs text-[#FF4500] font-mono">{stat.trend}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Scrolling ticker strip */}
            <div className="relative overflow-hidden rounded-full border border-[#1f1f1f] bg-[#0a0a0a] py-2.5 px-2">
              <div className="ticker-track">
                {[...Array(2)].map((_, repeatIdx) => (
                  <div key={repeatIdx} className="flex items-center gap-0">
                    {[
                      'AAPL +2.4%', 'TSLA +1.8%', 'MSFT +0.9%', 'NVDA +4.2%',
                      'AMZN +1.1%', 'GOOGL +0.7%', 'META +3.1%', 'BRK.B +0.5%',
                      'SPY +0.8%', 'QQQ +1.6%', 'BTC +3.9%', 'ETH +2.7%',
                    ].map((ticker, i) => (
                      <span key={i} className="flex items-center gap-5 px-5">
                        <span className="text-xs font-mono whitespace-nowrap">
                          <span className="text-gray-300">{ticker.split(' ')[0]}</span>
                          {' '}
                          <span style={{color: '#4ade80'}}>{ticker.split(' ')[1]}</span>
                        </span>
                        <span className="text-[#FF4500]/25 text-[10px]">◆</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>


        {/* ── TECHNOLOGY – Clean 2-col: header+visual left, stacked features right ── */}
        <section className="py-24 px-6 border-t border-[#111111]">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row gap-16">

              {/* LEFT — sticky header + visual panel */}
              <div className="lg:w-[38%] flex-shrink-0">
                <div className="lg:sticky lg:top-28">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#FF4500]/10 border border-[#FF4500]/20 px-4 py-1.5 mb-5">
                    <Bell className="h-4 w-4 text-[#FF4500]" />
                    <span className="text-sm font-medium text-[#FF4500]">Why Choose Us</span>
                  </div>
                  <h3 className="text-4xl font-bold text-white leading-tight mb-4">
                    Powered by<br />
                    <span className="gradient-text">cutting-edge</span><br />
                    technology.
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8">
                    Every layer of MirrorWealth — from data ingestion to AI inference — is built for speed, security, and scale.
                  </p>

                  {/* Visual: stacked metric tiles */}
                  <div className="space-y-2">
                    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-1">Global latency</div>
                        <div className="text-3xl font-bold text-white">&lt;50<span className="text-lg font-normal text-gray-400 ml-1">ms</span></div>
                      </div>
                      <div className="w-16 h-8 flex items-end gap-0.5">
                        {[3,5,4,7,6,8,7,9].map((h,i) => (
                          <div key={i} className="flex-1 rounded-sm" style={{height:`${h*10}%`, background: i===7 ? '#FF4500' : `rgba(255,69,0,${0.1+i*0.07})`}} />
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Data feeds', val: '200+' },
                        { label: 'Uptime SLA', val: '99.9%' },
                        { label: 'Encryption', val: 'AES-256' },
                        { label: 'Compliance', val: 'SOC 2' },
                      ].map((s, i) => (
                        <div key={i} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl px-4 py-3">
                          <div className="text-base font-bold text-white">{s.val}</div>
                          <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wide mt-0.5">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT — stacked feature rows */}
              <div className="flex-1 space-y-0 divide-y divide-[#111]">
                {[
                  {
                    icon: Database,
                    title: 'Real-time Data Streaming',
                    desc: 'Connect to 200+ live market data feeds with sub-50ms latency. Every tick, every trade, instantly reflected in your portfolio.',
                    tag: 'INFRASTRUCTURE',
                  },
                  {
                    icon: Lock,
                    title: 'Bank-Grade Security',
                    desc: 'AES-256 encryption, biometric authentication, SOC 2 Type II certification, and zero-knowledge credential storage. Your data is yours.',
                    tag: 'SECURITY',
                  },
                  {
                    icon: Target,
                    title: 'Goal-Based Planning',
                    desc: 'Set retirement, education, or wealth targets. Our AI builds a personalized roadmap and adjusts it weekly as markets evolve.',
                    tag: 'PLANNING',
                  },
                  {
                    icon: LineChart,
                    title: 'Advanced Analytics',
                    desc: 'Sharpe ratio, Sortino ratio, Monte Carlo simulations across 1,000+ scenarios, and stress-testing against historical crashes.',
                    tag: 'ANALYTICS',
                  },
                ].map((feature, idx) => {
                  const Icon = feature.icon
                  return (
                    <div key={idx} className="group py-8 flex gap-5 cursor-pointer">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-[#111] border border-[#1f1f1f] flex items-center justify-center group-hover:bg-[#FF4500]/10 group-hover:border-[#FF4500]/20 transition-all duration-300">
                        <Icon className="h-4 w-4 text-gray-500 group-hover:text-[#FF4500] transition-colors duration-300" />
                      </div>
                      {/* Text */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[11px] font-mono text-[#FF4500]/89 tracking-[0.18em]">{feature.tag}</span>
                          <div className="flex-1 h-px bg-[#1a1a1a] group-hover:bg-[#FF4500]/10 transition-colors duration-300" />
                        </div>
                        <h4 className="text-base font-semibold text-white mb-2 tracking-tight group-hover:text-[#FF6B35] transition-colors duration-300">{feature.title}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>
          </div>
        </section>


        {/* Footer */}
        <footer className="border-t border-[#111111] py-12 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="relative">
              <img src={logo} alt="MirrorWealth Logo" className="w-7 h-7 object-cover" />
            </div>
                <span className="text-sm text-gray-500 group-hover:text-white transition-colors">MirrorWealth</span>
              </div>
              <div className="flex gap-6 text-sm text-gray-500">
                <a href="/Privacy" className="hover:text-white transition-all duration-300">Privacy</a>
                <a href="/Terms" className="hover:text-white transition-all duration-300">Terms</a>
                <a href="#" className="hover:text-white transition-all duration-300">Contact</a>
              </div>
              <p className="text-sm text-gray-500">&copy; 2026 MirrorWealth. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}