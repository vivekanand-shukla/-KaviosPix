import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function AuthSuccess() {
  const [searchParams] = useSearchParams()
  const { setTokenAndUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      setTokenAndUser(token).then(() => {
        navigate("/")
      })
    } else {
      navigate("/login")
    }
  }, [])

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#a78bfa" }}>
      Signing you in...
    </div>
  )
}

export default AuthSuccess
