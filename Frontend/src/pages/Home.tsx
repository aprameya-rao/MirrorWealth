import { ArrowRight, BarChart3, Shield, Zap, TrendingUp, Users, ChevronRight, Rocket, Star, Circle, Brain, Award, Clock, Lock, PieChart, LineChart, Bot, DollarSign, Target, Gauge, Heart, Bell, Database } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from './logo.png'
import LineWaves from '../components/LineWaves'
import mockData from '../data/mockData.json'


export default function Home() {
  const [displayText, setDisplayText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [waveColors, setWaveColors] = useState({
    color1: 'var(--color-accent)',
    color2: 'var(--color-accent-soft)',
    color3: 'var(--color-accent-mid)',
  })
  
  const {
    words,
    navLinks,
    heroBadges,
    features,
    timeline,
    stats,
    ticker,
    latencyBars,
    latencyBarColors,
    keyStats,
    techFeatures,
  } = mockData.home

  const iconMap = {
    Shield,
    Users,
    TrendingUp,
    Zap,
    Award,
    BarChart3,
    Brain,
    Clock,
    PieChart,
    Bot,
    Circle,
    DollarSign,
    Gauge,
    Heart,
    Database,
    Lock,
    Target,
    LineChart,
  }
  
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

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement)
    setWaveColors({
      color1: styles.getPropertyValue('--color-accent').trim() || 'var(--color-accent)',
      color2: styles.getPropertyValue('--color-accent-soft').trim() || 'var(--color-accent-soft)',
      color3: styles.getPropertyValue('--color-accent-mid').trim() || 'var(--color-accent-mid)',
    })
  }, [])

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-white overflow-x-hidden">
      

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
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                className="text-sm text-gray-300 hover:text-white transition-all duration-300 relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-soft)] group-hover:w-full transition-all duration-300"></span>
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
            color1={waveColors.color1}
            color2={waveColors.color2}
            color3={waveColors.color3}
            enableMouseInteraction={true}
            mouseInfluence={2}
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
              {heroBadges.map((badge, idx) => {
                const Icon = iconMap[badge.icon as keyof typeof iconMap]
                return (
                  <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full glass-card glass-card-hover hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <Icon className="h-3.5 w-3.5 text-[var(--color-accent)] group-hover:rotate-12 transition-transform duration-300" />
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
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 px-4 py-1.5 mb-4">
                <Star className="h-4 w-4 text-[var(--color-accent)]" />
                <span className="text-sm font-medium text-[var(--color-accent)]">Premium Features</span>
              </div>
              <h3 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3">
                Everything You Need to <span className="gradient-text">Succeed</span>
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto font-light">
                Professional-grade tools designed for modern investors
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, idx) => {
                const Icon = iconMap[feature.icon as keyof typeof iconMap]
                return (
                  <div 
                    key={idx} 
                    className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8 hover:border-[var(--color-accent)]/40 transition-all duration-300 cursor-pointer hover:translate-y-[-4px] group"
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="relative z-10">
                      <div className="mb-4 inline-flex rounded-full bg-[var(--color-accent)]/10 p-3 group-hover:bg-[var(--color-accent)]/20 transition-all duration-300">
                        <Icon className="h-5 w-5 text-[var(--color-accent)]" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2 tracking-tight">{feature.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                      <div className={`mt-4 flex items-center gap-1 text-[var(--color-accent)] text-sm transition-all duration-300 ${hoveredCard === idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
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
        <section id="how-it-works" className="py-24 px-6 border-t border-[var(--color-card)] overflow-hidden">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 px-4 py-1.5 mb-4">
                <Circle className="h-4 w-4 text-[var(--color-accent)]" />
                <span className="text-sm font-medium text-[var(--color-accent)]">Simple Process</span>
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
                {timeline.map((item, idx) => {
                  const Icon = iconMap[item.icon as keyof typeof iconMap]
                  return (
                    <div key={idx} className="relative flex flex-col items-center md:items-start px-6 pb-12 md:pb-0 group">
                      {/* Step number + icon row */}
                      <div className="flex items-center gap-3 mb-9">
                        <div className="relative flex-shrink-0 w-12 h-14 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-mid)] flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/20 group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold text-lg">{item.step}</span>
                        </div>
                        
                      </div>

                      {/* Icon pill */}
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-surface-4)] px-3 py-1.5 group-hover:border-[var(--color-accent)]/30 transition-colors duration-300">
                        <Icon className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                        <span className="text-xs text-gray-400 font-mono">{item.detail}</span>
                      </div>

                      <h4 className="text-xl font-bold text-white mb-2 tracking-tight">{item.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>

                      {/* Bottom accent bar */}
                      <div className="mt-6 w-0 group-hover:w-full h-px bg-gradient-to-r from-[var(--color-accent)] to-transparent transition-all duration-500" />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>


        {/* ── STATS – Large typographic layout with ticker ── */}
        <section className="py-24 px-6 border-t border-[var(--color-card)] overflow-hidden">
          <div className="mx-auto max-w-6xl">

            {/* Big numbers row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-surface-2)] rounded-2xl overflow-hidden mb-16">
              {stats.map((stat, idx) => {
                const Icon = iconMap[stat.icon as keyof typeof iconMap]
                return (
                  <div key={idx} className="bg-[var(--color-surface-deep)] p-8 flex flex-col justify-between group hover:bg-[var(--color-card)] transition-colors duration-300">
                    <Icon className="h-5 w-5 text-[var(--color-accent)]/50 mb-6 group-hover:text-[var(--color-accent)] transition-colors duration-300" />
                    <div>
                      <div className="text-4xl md:text-5xl font-bold text-white mb-1 stat-value tracking-tight">{stat.value}</div>
                      <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                      <div className="text-xs text-[var(--color-accent)] font-mono">{stat.trend}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Scrolling ticker strip */}
            <div className="relative overflow-hidden rounded-full border border-[var(--color-surface-3)] bg-[var(--color-surface)] py-2.5 px-2">
              <div className="ticker-track">
                {[...Array(2)].map((_, repeatIdx) => (
                  <div key={repeatIdx} className="flex items-center gap-0">
                    {ticker.map((ticker, i) => (
                      <span key={i} className="flex items-center gap-5 px-5">
                        <span className="text-xs font-mono whitespace-nowrap">
                          <span className="text-gray-300">{ticker.split(' ')[0]}</span>
                          {' '}
                          <span style={{color: 'var(--color-green)'}}>{ticker.split(' ')[1]}</span>
                        </span>
                        <span className="text-[var(--color-accent)]/25 text-[10px]">◆</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>


        {/* ── TECHNOLOGY – Clean 2-col: header+visual left, stacked features right ── */}
        <section className="py-24 px-6 border-t border-[var(--color-card)]">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row gap-16">

              {/* LEFT — sticky header + visual panel */}
              <div className="lg:w-[38%] flex-shrink-0">
                <div className="lg:sticky lg:top-28">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 px-4 py-1.5 mb-5">
                    <Bell className="h-4 w-4 text-[var(--color-accent)]" />
                    <span className="text-sm font-medium text-[var(--color-accent)]">Why Choose Us</span>
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
                    <div className="bg-[var(--color-surface-deep)] border border-[var(--color-surface-2)] rounded-2xl p-5 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-1">Global latency</div>
                        <div className="text-3xl font-bold text-white">&lt;50<span className="text-lg font-normal text-gray-400 ml-1">ms</span></div>
                      </div>
                      <div className="w-16 h-8 flex items-end gap-0.5">
                        {latencyBars.map((h, i) => (
                          <div key={i} className="flex-1 rounded-sm" style={{height:`${h*10}%`, background: latencyBarColors[i] ?? 'var(--color-accent-10)'}} />
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {keyStats.map((s, i) => (
                        <div key={i} className="bg-[var(--color-surface-deep)] border border-[var(--color-surface-2)] rounded-xl px-4 py-3">
                          <div className="text-base font-bold text-white">{s.val}</div>
                          <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wide mt-0.5">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT — stacked feature rows */}
              <div className="flex-1 space-y-0 divide-y divide-[var(--color-card)]">
                {techFeatures.map((feature, idx) => {
                  const Icon = iconMap[feature.icon as keyof typeof iconMap]
                  return (
                    <div key={idx} className="group py-8 flex gap-5 cursor-pointer">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-[var(--color-card)] border border-[var(--color-surface-3)] flex items-center justify-center group-hover:bg-[var(--color-accent)]/10 group-hover:border-[var(--color-accent)]/20 transition-all duration-300">
                        <Icon className="h-4 w-4 text-gray-500 group-hover:text-[var(--color-accent)] transition-colors duration-300" />
                      </div>
                      {/* Text */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[11px] font-mono text-[var(--color-accent)]/89 tracking-[0.18em]">{feature.tag}</span>
                          <div className="flex-1 h-px bg-[var(--color-surface-2)] group-hover:bg-[var(--color-accent)]/10 transition-colors duration-300" />
                        </div>
                        <h4 className="text-base font-semibold text-white mb-2 tracking-tight group-hover:text-[var(--color-accent-soft)] transition-colors duration-300">{feature.title}</h4>
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
        <footer className="border-t border-[var(--color-card)] py-12 px-6">
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



