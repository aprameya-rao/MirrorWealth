import { User, Bell, Lock, Shield, AlertTriangle, Save, Eye, EyeOff, Key, Globe, Mail, Smartphone, Moon, Sun } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  const notificationSettings = [
    { label: 'Email Alerts', description: 'Receive alerts via email', icon: Mail, enabled: true },
    { label: 'Push Notifications', description: 'Mobile push notifications', icon: Smartphone, enabled: true },
    { label: 'Market Updates', description: 'Daily market summaries', icon: Bell, enabled: false },
    { label: 'Portfolio Changes', description: 'Alerts when portfolio changes', icon: Bell, enabled: true }
  ]

  const privacySettings = [
    { label: 'Profile Visibility', description: 'Make profile visible to other users', icon: User },
    { label: 'Data Analytics', description: 'Allow us to analyze your data for improvement', icon: Globe },
    { label: 'Email Marketing', description: 'Receive promotional emails', icon: Mail }
  ]

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <style>{`
        * {
          font-family: "Space Grotesk", system-ui, -apple-system, sans-serif;
        }

        :root {
          --bg: #000000;
          --surface: #0a0a0a;
          --surface-soft: #0f0f0f;
          --border: #222222;
          --border-soft: #2c2c2c;
          --text: #e0e0e0;
          --text-muted: #999999;
          --accent: #FF4500;
          --accent-soft: #FF6B35;
          --accent-mid: #FF8C42;
          --accent-light: #FFA559;
          --accent-lighter: #FFBF6E;
          --accent-bg: rgba(255, 69, 0, 0.12);
          --hover-bg: rgba(44, 44, 48, 0.6);
        }

        body {
          background: var(--surface);
        }

        .card {
          background: #0f0f0f;
          border: 1px solid var(--border-soft);
          border-radius: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
          transition: all 0.2s ease;
        }

        .card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);
          border-color: rgba(255, 69, 0, 0.2);
        }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.9rem;
          border-radius: 1.2rem;
          border: 1px solid var(--border-soft);
          background: rgba(32, 32, 35, 0.7);
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pill:hover {
          background: var(--hover-bg);
          border-color: rgba(255, 69, 0, 0.3);
          transform: translateY(-1px);
        }

        .pill.accent {
          background: var(--accent-bg);
          border-color: rgba(255, 69, 0, 0.35);
          color: var(--accent);
        }

        .gradient-bg {
          background: linear-gradient(135deg, var(--surface) 0%, rgba(255,69,0,0.03) 50%, var(--surface-soft) 100%);
        }
        
        .glass-card {
          background: rgba(15, 15, 15, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(44, 44, 48, 0.3);
        }

        .text-gradient {
          background: linear-gradient(90deg, var(--accent), var(--accent-soft));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #222222;
          transition: 0.3s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #FF4500;
        }

        input:checked + .slider:before {
          transform: translateX(20px);
        }

        input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #FF4500;
          cursor: pointer;
        }
      `}</style>

      <div className="mx-auto max-w-4xl p-6 space-y-8">
        {/* Header */}
        <div className="gradient-bg rounded-3xl p-8 border border-[var(--border-soft)]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-gradient-to-b from-[var(--accent)] to-[var(--accent-soft)] rounded-lg shadow-lg"></div>
                <div>
                  <span className="text-xs text-[var(--accent-soft)] uppercase tracking-wider font-medium">Account Management</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-[#FF8C42] rounded-full"></div>
                    <span className="text-xs text-gray-400">Secure connection</span>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
                Settings
              </h1>
              <p className="mt-3 text-lg text-gray-400 max-w-lg">
                Manage your account • Preferences • Security
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FF8C42] rounded-full animate-pulse"></div>
                <span className="text-xs text-[#FF8C42] font-medium">All changes saved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-soft)] rounded-xl flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Profile Settings</h3>
              <p className="text-sm text-gray-400">Update your personal information</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#222222] text-white focus:border-[#FF4500] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                defaultValue="john@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#222222] text-white focus:border-[#FF4500] focus:outline-none transition-colors"
              />
            </div>
            
            <button className="w-full bg-gradient-to-r from-[#FF4500] to-[#FF8C42] hover:from-[#FF6B35] hover:to-[#FFA559] text-white font-semibold py-2.5 rounded-xl transition-all">
              Save Changes
            </button>
          </div>
        </div>

        

        {/* Security Settings */}
        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFA559] to-[#FFBF6E] rounded-xl flex items-center justify-center">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Security</h3>
              <p className="text-sm text-gray-400">Protect your account with strong security</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#222222] text-white focus:border-[#FF4500] focus:outline-none transition-colors pr-10"
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#222222] text-white focus:border-[#FF4500] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#222222] text-white focus:border-[#FF4500] focus:outline-none transition-colors"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FF8C42]/5 border border-[#FF8C42]/20">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-[#FF8C42]" />
                <span className="text-xs text-gray-300">Two-factor authentication</span>
              </div>
              <button className="text-xs text-[#FF8C42] hover:underline">Enable</button>
            </div>
            <button className="w-full bg-gradient-to-r from-[#FF4500] to-[#FF8C42] hover:from-[#FF6B35] hover:to-[#FFA559] text-white font-semibold py-2.5 rounded-xl transition-all">
              Update Password
            </button>
          </div>
        </div>

        {/* Save All Button */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF4500] to-[#FF8C42] hover:from-[#FF6B35] hover:to-[#FFA559] text-white font-semibold rounded-xl transition-all shadow-lg">
            <Save className="h-4 w-4" />
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  )
}