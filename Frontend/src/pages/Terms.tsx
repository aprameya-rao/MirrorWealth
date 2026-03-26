import { FileText, Scale, AlertTriangle, CreditCard, Ban, RefreshCw, Mail, ArrowLeft, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from './logo.png'

const sections = [
  { id: 'acceptance', label: 'Acceptance' },
  { id: 'services', label: 'Our Services' },
  { id: 'accounts', label: 'User Accounts' },
  { id: 'payment', label: 'Payment Terms' },
  { id: 'prohibited', label: 'Prohibited Use' },
  { id: 'disclaimer', label: 'Disclaimers' },
  { id: 'termination', label: 'Termination' },
  { id: 'contact', label: 'Contact' },
]

export default function Terms() {
  const [activeSection, setActiveSection] = useState('acceptance')
  const [scrolled, setScrolled] = useState(false)

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
    <div className="min-h-screen bg-[#000000] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap');
        * { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .gradient-text {
          background: linear-gradient(135deg, #FF4500 0%, #FF6B35 50%, #FF8C42 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text; color: transparent;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
        .section-fade { opacity: 0; transform: translateY(16px); animation: fadeUp 0.5s ease forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        .toc-item { transition: all 0.2s ease; }
        .toc-item.active { color: #FF4500; }
        .toc-item.active::before { content: ''; display: inline-block; width: 16px; height: 1px; background: #FF4500; margin-right: 8px; vertical-align: middle; }
        .prose-section h3 { font-size: 1.1rem; font-weight: 700; color: white; margin-bottom: 0.75rem; margin-top: 2rem; }
        .prose-section p { color: #9ca3af; font-size: 0.9rem; line-height: 1.8; margin-bottom: 1rem; }
        .prose-section ul { list-style: none; padding: 0; margin-bottom: 1rem; }
        .prose-section ul li { color: #9ca3af; font-size: 0.9rem; padding: 0.35rem 0 0.35rem 1.25rem; position: relative; }
        .prose-section ul li::before { content: '—'; position: absolute; left: 0; color: #FF4500; font-size: 0.75rem; top: 0.4rem; }

        /* Numbered sections */
        .num-section { counter-increment: section; }
      `}</style>

      {/* Nav */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/70 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
        <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="MirrorWealth" className="w-8 h-8 object-cover" />
            <span className="text-base font-semibold">Mirror<span className="gradient-text">Wealth</span></span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero banner — slightly different from Privacy to feel distinct */}
      <div className="relative pt-32 pb-16 px-6 border-b border-[#111]">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#FF4500]/5 pointer-events-none" />
        {/* Decorative rule */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF4500]/30 to-transparent" />
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#FF4500]/10 flex items-center justify-center">
              <Scale className="h-5 w-5 text-[#FF4500]" />
            </div>
            <div className="text-xs font-mono text-[#FF4500]/60 tracking-[0.2em] uppercase">Legal Document</div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-gray-400 max-w-xl text-base leading-relaxed">
            By using MirrorWealth you agree to these terms. Please read them carefully — they define the rules of engagement between you and us.
          </p>
          <div className="flex items-center gap-6 mt-6 text-xs text-gray-500 font-mono">
            <span>Last updated: <span className="text-gray-300">January 15, 2025</span></span>
            <span>·</span>
            <span>Governing law: <span className="text-gray-300">Delaware, USA</span></span>
          </div>

          {/* Alert banner */}
          <div className="mt-8 flex items-start gap-3 bg-[#FF4500]/5 border border-[#FF4500]/20 rounded-xl p-4 max-w-2xl">
            <AlertTriangle className="h-4 w-4 text-[#FF4500] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 leading-relaxed m-0">
              <span className="text-white font-medium">Not financial advice.</span> MirrorWealth provides analytical tools and information only. Nothing on this platform constitutes investment advice or a recommendation to buy or sell any security.
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-6 py-16 flex gap-16">

        {/* TOC */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-24">
            <div className="text-[10px] font-mono text-gray-600 tracking-[0.2em] uppercase mb-4">Contents</div>
            <nav className="space-y-1">
              {sections.map(s => (
                <button key={s.id} onClick={() => scrollTo(s.id)}
                  className={`toc-item block w-full text-left text-sm py-1 transition-colors ${activeSection === s.id ? 'active' : 'text-gray-500 hover:text-gray-300'}`}>
                  {s.label}
                </button>
              ))}
            </nav>
            <div className="mt-10 p-4 rounded-xl bg-[#0d0d0d] border border-[#1a1a1a]">
              <Shield className="h-4 w-4 text-[#FF4500] mb-2" />
              <div className="text-xs text-white font-semibold mb-1">Questions?</div>
              <div className="text-[11px] text-gray-500 leading-relaxed">Email us at <span className="text-[#FF4500]">legal@mirrorwealth.com</span></div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 prose-section space-y-12">

          <section id="acceptance" className="section-fade" style={{animationDelay:'0.1s'}}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1a1a1a]">
              <FileText className="h-5 w-5 text-[#FF4500]" />
              <h2 className="text-2xl font-bold text-white m-0">Acceptance of Terms</h2>
            </div>
            <p>By accessing or using MirrorWealth ("Platform", "Service", "we", "us"), you agree to be bound by these Terms of Service and all applicable laws. If you do not agree, you may not use the platform.</p>
            <p>We may update these terms from time to time. Continued use of the platform following any changes constitutes your acceptance of the revised terms. We will provide at least 14 days' notice for material changes.</p>
          </section>

          <section id="services" className="section-fade" style={{animationDelay:'0.15s'}}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1a1a1a]">
              <RefreshCw className="h-5 w-5 text-[#FF4500]" />
              <h2 className="text-2xl font-bold text-white m-0">Our Services</h2>
            </div>
            <p>MirrorWealth provides portfolio analytics, AI-powered market intelligence, and investment tracking tools. The platform is provided "as is" for informational purposes.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
              {[
                { label: 'Portfolio Analytics', sub: 'Real-time tracking' },
                { label: 'AI Insights', sub: 'LangGraph agents' },
                { label: 'Backtesting', sub: '10+ years history' },
              ].map((s, i) => (
                <div key={i} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4 text-center hover:border-[#FF4500]/20 transition-colors">
                  <div className="text-sm font-semibold text-white mb-1">{s.label}</div>
                  <div className="text-xs text-gray-500">{s.sub}</div>
                </div>
              ))}
            </div>
            <p>We reserve the right to modify, suspend, or discontinue any part of the service at any time with reasonable notice. We are not liable for any modification, suspension, or discontinuation.</p>
          </section>

          <section id="accounts" className="section-fade" style={{animationDelay:'0.2s'}}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1a1a1a]">
              <Shield className="h-5 w-5 text-[#FF4500]" />
              <h2 className="text-2xl font-bold text-white m-0">User Accounts</h2>
            </div>
            <p>You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account.</p>
            <ul>
              <li>Provide accurate, complete registration information</li>
              <li>Maintain the security of your password — use a strong, unique password</li>
              <li>Notify us immediately of any unauthorized account access</li>
              <li>Not share account access with others or create multiple accounts</li>
              <li>Not use automated tools to create accounts or access the platform</li>
            </ul>
          </section>

          <section id="payment" className="section-fade" style={{animationDelay:'0.25s'}}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1a1a1a]">
              <CreditCard className="h-5 w-5 text-[#FF4500]" />
              <h2 className="text-2xl font-bold text-white m-0">Payment Terms</h2>
            </div>
            <p>Paid plans are billed monthly or annually in advance. All fees are non-refundable except as required by law or as stated in our refund policy.</p>
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl overflow-hidden my-6">
              <div className="grid grid-cols-3 divide-x divide-[#1a1a1a]">
                {[
                  { plan: 'Free', price: '$0', cycle: 'forever' },
                  { plan: 'Pro', price: '$29', cycle: 'per month' },
                  { plan: 'Enterprise', price: 'Custom', cycle: 'annually' },
                ].map((p, i) => (
                  <div key={i} className="p-5 text-center">
                    <div className="text-xs text-gray-500 font-mono uppercase tracking-wide mb-2">{p.plan}</div>
                    <div className="text-2xl font-bold text-white">{p.price}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{p.cycle}</div>
                  </div>
                ))}
              </div>
            </div>
            <ul>
              <li>Cancel at any time — access continues until the end of the billing period</li>
              <li>Prices may change with 30 days' notice to existing subscribers</li>
              <li>Failed payments result in a 7-day grace period before account downgrade</li>
            </ul>
          </section>

          <section id="prohibited" className="section-fade" style={{animationDelay:'0.3s'}}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1a1a1a]">
              <Ban className="h-5 w-5 text-[#FF4500]" />
              <h2 className="text-2xl font-bold text-white m-0">Prohibited Use</h2>
            </div>
            <p>The following activities are strictly prohibited and may result in immediate termination of your account:</p>
            <ul>
              <li>Using the platform for market manipulation or illegal trading activity</li>
              <li>Reverse-engineering, scraping, or extracting data at scale</li>
              <li>Reselling or redistributing platform data or AI outputs commercially</li>
              <li>Attempting to gain unauthorized access to other accounts or systems</li>
              <li>Uploading malware, viruses, or any malicious code</li>
              <li>Violating any applicable law or regulation</li>
            </ul>
          </section>

          <section id="disclaimer" className="section-fade" style={{animationDelay:'0.35s'}}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1a1a1a]">
              <AlertTriangle className="h-5 w-5 text-[#FF4500]" />
              <h2 className="text-2xl font-bold text-white m-0">Disclaimers & Liability</h2>
            </div>
            <div className="bg-[#FF4500]/5 border border-[#FF4500]/15 rounded-xl p-5 my-4">
              <p className="text-sm text-gray-300 m-0 leading-relaxed">
                <strong className="text-white">Investment disclaimer:</strong> All information provided by MirrorWealth is for educational and analytical purposes only. Past performance is not indicative of future results. Investing involves risk, including possible loss of principal.
              </p>
            </div>
            <p>To the maximum extent permitted by law, MirrorWealth shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform, including but not limited to investment losses.</p>
            <p>Our total liability to you for any claims shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
          </section>

          <section id="termination" className="section-fade" style={{animationDelay:'0.4s'}}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1a1a1a]">
              <RefreshCw className="h-5 w-5 text-[#FF4500]" />
              <h2 className="text-2xl font-bold text-white m-0">Termination</h2>
            </div>
            <p>You may close your account at any time from your account settings. We may terminate or suspend your access for violations of these terms, fraudulent activity, or at our discretion with 30 days' notice.</p>
            <ul>
              <li>On termination, your right to access the platform ceases immediately</li>
              <li>We will retain data as required by law and our privacy policy</li>
              <li>You may request a data export before closing your account</li>
              <li>Sections on disclaimers and liability survive termination</li>
            </ul>
          </section>

          <section id="contact" className="section-fade" style={{animationDelay:'0.45s'}}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1a1a1a]">
              <Mail className="h-5 w-5 text-[#FF4500]" />
              <h2 className="text-2xl font-bold text-white m-0">Contact</h2>
            </div>
            <p>For questions about these terms, contact our legal team.</p>
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white mb-1">Legal Team</div>
                <div className="text-sm text-[#FF4500]">legal@mirrorwealth.com</div>
                <div className="text-xs text-gray-500 mt-1">MirrorWealth Inc. · Delaware, USA</div>
              </div>
              <a href="mailto:legal@mirrorwealth.com" className="flex-shrink-0 bg-gradient-to-r from-[#FF4500] to-[#FF6B35] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
                Send Email
              </a>
            </div>
          </section>

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#111] py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">&copy; 2025 MirrorWealth. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-gray-500">
            <Link to="/terms" className="text-[#FF4500]">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <a href="mailto:hello@mirrorwealth.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}