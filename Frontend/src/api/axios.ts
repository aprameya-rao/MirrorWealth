// src/api/axios.ts
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
  RISK: {
    GET_QUESTIONS: '/questions',
    SUBMIT: '/submit',
  },
}

export default api