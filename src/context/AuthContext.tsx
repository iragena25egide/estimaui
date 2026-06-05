import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { io } from "socket.io-client"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "ESTIMATOR" | "ADMIN" | "VIEWER"
}

interface SignupStep1Data {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: "ESTIMATOR" | "VIEWER"
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  initialLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  startSignup: (data: SignupStep1Data) => Promise<void>
  loginWithGoogle: (googleToken: string) => Promise<void>
  verifyOtp: (email: string, otp: string) => Promise<void>
  completeSignup: (email: string, password: string) => Promise<void>
  verifyLoginOtp: (email: string, otp: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  setAuthData: (token: string, user: User) => void
  isAdmin: boolean
  isEstimator: boolean
  isViewer: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE = "http://localhost:3000/api/estimaApp"

const setTokenCookie = (token: string) => {
  document.cookie = `authToken=${token}; path=/; max-age=${3600 * 24 * 7}; SameSite=Lax; Secure`;
};

const clearTokenCookie = () => {
  document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken")
    const savedUser = localStorage.getItem("user")

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setToken(savedToken)
        setUser(parsedUser)
        // Sync cookie just in case it got cleared
        setTokenCookie(savedToken)
      } catch {
        localStorage.removeItem("user")
        localStorage.removeItem("authToken")
        clearTokenCookie()
      }
    }
    
    // Smooth premium preloader reveal delay of 1200ms
    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  // Socket logic has been moved to NotificationContext

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(
          data.message ||
            (res.status === 401
              ? "Invalid email or password."
              : "Login failed. Please try again."),
        )
      }
      // Server responds with { message: 'OTP sent to your email' }
      // Caller should advance to the OTP step
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const verifyLoginOtp = async (email: string, otp: string) => {
    setLoading(true)
    setError(null)

    try {
      // Step 1: verify OTP → get token
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Invalid or expired OTP")

      const { token } = data

      // Step 2: fetch the user profile with the new token
      const meRes = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const meData = await meRes.json()
      if (!meRes.ok) throw new Error(meData.message || "Failed to load user profile")

      // Step 3: persist everything
      setToken(token)
      setUser(meData)
      localStorage.setItem("authToken", token)
      localStorage.setItem("user", JSON.stringify(meData))
      setTokenCookie(token)
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const startSignup = async (data: SignupStep1Data) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/users/start-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message)

      localStorage.setItem("pendingEmail", data.email)
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (email: string, otp: string) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/users/verify-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message)
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const completeSignup = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/users/complete-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || "Signup failed. Please try again.")
    } catch (err: any) {
      const message = err.message || "Signup failed. Please try again."
      setError(message)
      throw new Error(message) // ← must re-throw so the form's catch block fires
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (googleToken: string) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setToken(data.token)
      localStorage.setItem("authToken", data.token)
      setTokenCookie(data.token)
    } catch (err: any) {
      setError(err.message || "Google login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setError(null)
    localStorage.clear()
    clearTokenCookie()
  }

  const setAuthData = (token: string, user: User) => {
    setToken(token)
    setUser(user)
    localStorage.setItem("authToken", token)
    localStorage.setItem("user", JSON.stringify(user))
    setTokenCookie(token)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        initialLoading,
        error,
        login,
        startSignup,
        verifyOtp,
        completeSignup,
        verifyLoginOtp,
        logout,
        loginWithGoogle,
        isAuthenticated: !!token,
        setAuthData,
        isAdmin: user?.role === "ADMIN",
        isEstimator: user?.role === "ESTIMATOR",
        isViewer: user?.role === "VIEWER",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
