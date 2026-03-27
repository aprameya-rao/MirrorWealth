import axios from 'axios'

// Base API instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Automatically attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    // Note: Make sure this matches what you use in localStorage! 
    // If AuthContext uses 'access_token', change this to localStorage.getItem('access_token')
    const token = localStorage.getItem('token') 
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ---- API ENDPOINTS (so you stop hardcoding strings everywhere) ----
export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },
  RISK: {
    GET_QUESTIONS: '/risk/questions',
    SUBMIT: '/risk/submit',
  },
}

export default api