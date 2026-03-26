import { Shield, Lock, Eye, Database, Bell, ArrowLeft, Users, Globe, Mail, BarChart3, Brain } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from './logo.png'
import mockData from '../data/mockData.json'

const sections = mockData.privacy.sections

export default function Privacy() {
  const [activeSection, setActiveSection] = useState('collection')
  const [scrolled, setScrolled] = useState(false)
  const { usageCards, securityStats, contactEmail } = mockData.privacy

  const usageIconMap = {
    BarChart3,
    Brain,
    Bell,
    Shield,
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      const current = sections.find(s => {
        const el = document.getElementById(s.id)
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top <= 120 && rect.bottom > 120
      })
      if (current) setActiveSection(current.id)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-white">
      

      {/* Nav */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/70 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
        <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="MirrorWealth" className="w-8 h-8 object-cover" />
            <span className="text-base font-semibold">Mirror<span className="gradient-text">Wealth</span></span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero banner */}
      <div className="relative pt-32 pb-16 px-6 border-b border-[var(--color-card)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-[var(--color-accent)]" />
            </div>
            <div className="text-xs font-mono text-[var(--color-accent)]/60 tracking-[0.2em] uppercase">Legal Document</div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-gray-400 max-w-xl text-base leading-relaxed">
            We take your privacy seriously. This document explains how MirrorWealth collects, uses, and protects your personal information.
          </p>
          <div className="flex items-center gap-6 mt-6 text-xs text-gray-500 font-mono">
            <span>Last updated: <span className="text-gray-300">January 15, 2025</span></span>
            <span>·</span>
            <span>Version: <span className="text-gray-300">2.4</span></span>
            <span>·</span>
            <span>Effective: <span className="text-gray-300">February 1, 2025</span></span>
          </div>
        </div>
      </div>

      {/* Body: TOC + Content */}
      <div className="mx-auto max-w-6xl px-6 py-16 flex gap-16">

        {/* Sticky TOC */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-24">
            <div className="text-[10px] font-mono text-gray-600 tracking-[0.2em] uppercase mb-4">Contents</div>
            <nav className="space-y-1">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`toc-item block w-full text-left text-sm py-1 transition-colors ${activeSection === s.id ? 'active' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {s.label}
                </button>
              ))}
            </nav>

            {/* Security badge */}
            <div className="mt-10 p-4 rounded-xl bg-[var(--color-surface-deep)] border border-[var(--color-surface-2)]">
              <Lock className="h-4 w-4 text-[var(--color-accent)] mb-2" />
              <div className="text-xs text-white font-semibold mb-1">SOC 2 Certified</div>
              <div className="text-[11px] text-gray-500 leading-relaxed">Independently audited for security, availability & confidentiality.</div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 prose-section space-y-12">

          <section id="collection" className="section-fade" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-surface-2)]">
              <Database className="h-5 w-5 text-[var(--color-accent)]" />
              <h2 className="text-2xl font-bold text-white m-0">Data Collection</h2>
            </div>
            <p>We collect information you provide directly, data generated by your use of the platform, and information from third-party financial data providers. This helps us deliver accurate, personalized portfolio insights.</p>
            <h3>Information you provide</h3>
            <ul>
              <li>Account registration details (name, email, password)</li>
              <li>Financial account credentials via OAuth — never stored in plaintext</li>
              <li>Risk tolerance questionnaire responses</li>
              <li>Investment goals and target allocations</li>
              <li>Communication preferences and notification settings</li>
            </ul>
            <h3>Automatically collected data</h3>
            <ul>
              <li>Usage patterns, feature interactions, and session duration</li>
              <li>Device type, browser, IP address, and general location</li>
              <li>Portfolio performance metrics and rebalancing history</li>
              <li>Error logs and diagnostic information for platform stability</li>
            </ul>
          </section>

          <section id="usage" className="section-fade" style={{animationDelay: '0.15s'}}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-surface-2)]">
              <Eye className="h-5 w-5 text-[var(--color-accent)]" />
              <h2 className="text-2xl font-bold text-white m-0">How We Use Your Data</h2>
            </div>
            <p>Your data powers the core MirrorWealth experience. We process it to deliver real-time analytics, AI-driven recommendations, and automated portfolio management.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              {usageCards.map((item, i) => {
                const Icon = usageIconMap[item.icon as keyof typeof usageIconMap]
                return (
                  <div key={i} className="bg-[var(--color-surface-deep)] border border-[var(--color-surface-2)] rounded-xl p-4 hover:border-[var(--color-accent)]/20 transition-colors">
                    <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-card)]">
                      <Icon className="h-4 w-4 text-[var(--color-accent)]" />
                    </div>
                    <div className="text-sm font-semibold text-white mb-1">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                )
              })}
            </div>
            <p>We never use your financial data for advertising profiling or sell it to third-party marketers. Your data is yours.</p>
          </section>

          <section id="sharing" className="section-fade" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-surface-2)]">
              <Users className="h-5 w-5 text-[var(--color-accent)]" />
              <h2 className="text-2xl font-bold text-white m-0">Data Sharing</h2>
            </div>
            <p>We do not sell personal data. We share limited data only with trusted service providers under strict contractual obligations, and only as necessary to operate the platform.</p>
            <h3>Service providers we work with</h3>
            <ul>
              <li>Market data providers (Polygon.io, Alpha Vantage) — read-only price feeds</li>
              <li>Cloud infrastructure (AWS, Cloudflare) — encrypted at rest and in transit</li>
              <li>Authentication providers — for secure OAuth integrations</li>
              <li>Analytics tools — aggregate, anonymized usage metrics only</li>
            </ul>
            <h3>Legal disclosures</h3>
            <p>We may disclose data if required by law, court order, or to protect the rights and safety of our users and platform. We will notify you whenever legally permissible.</p>
          </section>

          <section id="security" className="section-fade" style={{animationDelay: '0.25s'}}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-surface-2)]">
              <Lock className="h-5 w-5 text-[var(--color-accent)]" />
              <h2 className="text-2xl font-bold text-white m-0">Security</h2>
            </div>
            <p>MirrorWealth is built on institutional-grade security infrastructure. We employ multiple layers of protection to safeguard your financial data.</p>
            <div className="bg-[var(--color-surface-deep)] border border-[var(--color-accent)]/15 rounded-2xl p-6 my-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                {securityStats.map((s, i) => (
                  <div key={i}>
                    <div className="text-xl font-bold text-white mb-0.5">{s.val}</div>
                    <div className="text-xs text-gray-500 font-mono">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <ul>
              <li>Biometric and multi-factor authentication supported</li>
              <li>Zero-knowledge credential storage — we never see your bank passwords</li>
              <li>Regular third-party penetration testing</li>
              <li>Automated anomaly detection and account lockout</li>
            </ul>
          </section>

          <section id="rights" className="section-fade" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-surface-2)]">
              <Globe className="h-5 w-5 text-[var(--color-accent)]" />
              <h2 className="text-2xl font-bold text-white m-0">Your Rights</h2>
            </div>
            <p>Depending on your jurisdiction, you have rights over your personal data. We honor all applicable privacy regulations including GDPR and CCPA.</p>
            <ul>
              <li><strong className="text-white">Access</strong> — Request a full export of all data we hold about you</li>
              <li><strong className="text-white">Correction</strong> — Update inaccurate or incomplete information</li>
              <li><strong className="text-white">Deletion</strong> — Request permanent removal of your account and data</li>
              <li><strong className="text-white">Portability</strong> — Receive your data in a machine-readable format</li>
              <li><strong className="text-white">Opt-out</strong> — Withdraw consent for non-essential processing at any time</li>
            </ul>
            <p>To exercise any right, email <span className="text-[var(--color-accent)]">{contactEmail}</span> or use the data controls in your account settings. We respond within 30 days.</p>
          </section>

          <section id="cookies" className="section-fade" style={{animationDelay: '0.35s'}}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-surface-2)]">
              <Bell className="h-5 w-5 text-[var(--color-accent)]" />
              <h2 className="text-2xl font-bold text-white m-0">Cookies & Tracking</h2>
            </div>
            <p>We use strictly necessary cookies to maintain sessions and preferences, and optional analytics cookies to improve the platform. We do not use advertising cookies.</p>
            <ul>
              <li><strong className="text-white">Session cookies</strong> — Required for authentication, expire on logout</li>
              <li><strong className="text-white">Preference cookies</strong> — Remember your dashboard layout and settings</li>
              <li><strong className="text-white">Analytics cookies</strong> — Aggregate usage data, no cross-site tracking</li>
            </ul>
            <p>You can manage cookie preferences at any time via your browser settings or our in-app cookie controls.</p>
          </section>

          <section id="contact" className="section-fade" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-surface-2)]">
              <Mail className="h-5 w-5 text-[var(--color-accent)]" />
              <h2 className="text-2xl font-bold text-white m-0">Contact Us</h2>
            </div>
            <p>Questions about this policy or your data? Reach our privacy team directly.</p>
            <div className="bg-[var(--color-surface-deep)] border border-[var(--color-surface-2)] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white mb-1">Privacy Team</div>
                <div className="text-sm text-[var(--color-accent)]">{contactEmail}</div>
                <div className="text-xs text-gray-500 mt-1">Response within 2 business days</div>
              </div>
              <a href={`mailto:${contactEmail}`} className="flex-shrink-0 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-soft)] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
                Send Email
              </a>
            </div>
          </section>

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--color-card)] py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">&copy; 2025 MirrorWealth. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-gray-500">
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="text-[var(--color-accent)]">Privacy Policy</Link>
            <a href="mailto:hello@mirrorwealth.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}



