import axios from 'axios'

// Create the base instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Ensure your .env has VITE_API_BASE_URL=http://localhost:8000
  headers: {
    'Content-Type': 'application/json',
  },
})

// Automatically attach the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Centralized Endpoints Dictionary
export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    ME: '/api/v1/auth/me',
  },
  RISK: {
    GET_QUESTIONS: '/risk/questions',
    SUBMIT: '/risk/submit',
  },
  PORTFOLIO: {
    GET_PORTFOLIO: '/api/v1/portfolio', 
    RECOMMEND_ASYNC: '/api/v1/portfolio/recommend/async',
    TASK_STATUS: (taskId: string) => `/api/v1/portfolio/task/status/${taskId}`,
    EXECUTE: '/api/v1/portfolio/execute'
  }
}

export default api