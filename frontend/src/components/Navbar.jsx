import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import styles from "./Navbar.module.css"

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.left} onClick={() => navigate("/")}>
        <span className={styles.logoIcon}>📷</span>
        <span className={styles.logoText}>KaviosPix</span>
      </div>
      <div className={styles.right}>
        {user && (
          <>
            <div className={styles.userInfo}>
              {user.avatar && (
                <img src={user.avatar} alt="avatar" className={styles.avatar} />
              )}
              <span className={styles.userName}>{user.name}</span>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
