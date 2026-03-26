import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import HomePage from './pages/Home'
import DashboardPage from './pages/Dashboard'
import SigninPage from './pages/Signin'
import PrivacyPage from './pages/Privacy'
import TermsPage from './pages/Terms'
import AllocationPage from './pages/Allocation'
import AnalyticsPage from './pages/Analytics'
import BacktestingPage from './pages/Backtesting'
import InsightsPage from './pages/Insights'
import RebalancePage from './pages/Rebalance'
import SettingsPage from './pages/Settings'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<App><DashboardPage /></App>} />
        <Route path="/signin" element={<App><SigninPage /></App>} />
        <Route path="/privacy" element={<App><PrivacyPage /></App>} />
        <Route path="/terms" element={<App><TermsPage /></App>} />
        <Route path="/allocation" element={<App><AllocationPage /></App>} />
        <Route path="/analytics" element={<App><AnalyticsPage /></App>} />
        <Route path="/backtesting" element={<App><BacktestingPage /></App>} />
        <Route path="/insights" element={<App><InsightsPage /></App>} />
        <Route path="/rebalance" element={<App><RebalancePage /></App>} />
        <Route path="/settings" element={<App><SettingsPage /></App>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)


