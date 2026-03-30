import { useAuth } from "../context/AuthContext"
import styles from "./LoginPage.css"

function LoginPage() {
  const { login } = useAuth()

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>📷</span>
          <h1 className={styles.logoText}>KaviosPix</h1>
        </div>
        <p className={styles.tagline}>Your personal photo gallery</p>
        <p className={styles.description}>
          Store, organize and share your memories with friends and family.
        </p>
        <button className={styles.googleBtn} onClick={login}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className={styles.googleIcon}
          />
          Sign in with Google
        </button>
      </div>
    </div>
  )
}

export default LoginPage
