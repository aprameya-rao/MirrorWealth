import { User, Bell, Lock, Shield } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Settings</h2>
        <p className="text-sm text-[#AAAAAA] mt-2">Manage your account and preferences.</p>
      </div>

      {/* Profile Settings */}
      <div className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-6 w-6 text-[#FF4500]" />
          <h3 className="text-lg font-semibold text-white">Profile Settings</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Full Name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-[#222222] text-white focus:border-[#FF4500] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              defaultValue="john@example.com"
              className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-[#222222] text-white focus:border-[#FF4500] focus:outline-none transition-colors"
            />
          </div>
          <button className="w-full bg-[#FF4500] hover:bg-[#FF6B35] text-white font-semibold py-2 rounded-lg transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-[#00FF88]" />
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Email Alerts', description: 'Receive alerts via email' },
            { label: 'Push Notifications', description: 'Mobile push notifications' },
            { label: 'Market Updates', description: 'Daily market summaries' },
            { label: 'Portfolio Changes', description: 'Alerts when portfolio changes' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1a1a1a]">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-[#AAAAAA]">{item.description}</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="h-6 w-6 text-[#FF6B35]" />
          <h3 className="text-lg font-semibold text-white">Security</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Current Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-[#222222] text-white focus:border-[#FF4500] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-[#222222] text-white focus:border-[#FF4500] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-[#222222] text-white focus:border-[#FF4500] focus:outline-none transition-colors"
            />
          </div>
          <button className="w-full bg-[#FF4500] hover:bg-[#FF6B35] text-white font-semibold py-2 rounded-lg transition-colors">
            Update Password
          </button>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="rounded-2xl bg-[#111111] border border-[#222222] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-[#00FF88]" />
          <h3 className="text-lg font-semibold text-white">Privacy</h3>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Profile Visibility', description: 'Make profile visible to other users' },
            { label: 'Data Analytics', description: 'Allow us to analyze your data for improvement' },
            { label: 'Email Marketing', description: 'Receive promotional emails' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1a1a1a]">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-[#AAAAAA]">{item.description}</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl bg-[#111111] border border-red-900/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Danger Zone</h3>
        <button className="w-full border border-red-900 text-red-400 hover:bg-red-900/20 font-semibold py-3 rounded-lg transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  )
}
