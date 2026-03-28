import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
const AuthContext = createContext()

const API_URL = "https://kavios-pix-ap8t.vercel.app"

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // get token from localstorage
  const getToken = () => {
    return localStorage.getItem("token")
  }

  // fetch user info on load
  useEffect(() => {
    const token = getToken()
    if (token) {
      axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          setUser(res.data)
        })
        .catch(() => {
          localStorage.removeItem("token")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = () => {
    navigate(`${API_URL}/auth/google`)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const setTokenAndUser = async (token) => {
    localStorage.setItem("token", token)
    try {
      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(res.data)
    } catch (err) {
      console.log("Error fetching user", err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getToken, setTokenAndUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
