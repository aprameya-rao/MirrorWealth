import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import App from './App'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import HomePage from './pages/Home'
import DashboardPage from './pages/Dashboard'
import SigninPage from './pages/Signin'
import SignupPage from './pages/Signup'
import PrivacyPage from './pages/Privacy'
import TermsPage from './pages/Terms'
import AllocationPage from './pages/Allocation'
import AnalyticsPage from './pages/Analytics'
import BacktestingPage from './pages/Backtesting'
import InsightsPage from './pages/Insights'
import RebalancePage from './pages/Rebalance'
import SettingsPage from './pages/Settings'
// Import the new Questionnaire page
import QuestionnairePage from './pages/Questionnaire' 

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<App><SigninPage /></App>} />
          <Route path="/signup" element={<App><SignupPage /></App>} />
          <Route path="/privacy" element={<App><PrivacyPage /></App>} />
          <Route path="/terms" element={<App><TermsPage /></App>} />

          {/* Protected Routes */}
          <Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <App>
        <DashboardPage />
      </App>
    </ProtectedRoute>
  } 
/>
          
          {/* Added Questionnaire Route */}
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          
          <Route path="/allocation" element={<ProtectedRoute><App><AllocationPage /></App></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><App><AnalyticsPage /></App></ProtectedRoute>} />
          <Route path="/backtesting" element={<ProtectedRoute><App><BacktestingPage /></App></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><App><InsightsPage /></App></ProtectedRoute>} />
          <Route path="/rebalance" element={<ProtectedRoute><App><RebalancePage /></App></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><App><SettingsPage /></App></ProtectedRoute>} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>,
)