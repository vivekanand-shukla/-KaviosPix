import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import AlbumPage from "./pages/AlbumPage"
import AuthSuccess from "./pages/AuthSuccess"
import Navbar from "./components/Navbar"

// protect routes that need login
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#a78bfa" }}>
        Loading...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <HomePage />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/album/:albumId"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <AlbumPage />
              </>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
