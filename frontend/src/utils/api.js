import axios from "axios"

const API_URL = "http://localhost:5000"

// create axios instance with base url
const api = axios.create({
  baseURL: API_URL
})

// attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
