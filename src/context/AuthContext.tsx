import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "ESTIMATOR" | "ADMIN" | "VIEWER"
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  
  login: (email: string, password: string) => Promise<void>
  sendOtp: (email: string) => Promise<void>
  verifyOtp: (email: string, otp: string) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

interface SignupData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password?: string
  role: "ESTIMATOR" | "ADMIN" | "VIEWER"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE = "http://localhost:3000/api/estimaApp"

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken")
    const savedUser = localStorage.getItem("user")
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
  }, [])

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

      if (!res.ok) throw new Error(data.message || "Login failed")

      // Backend returns { access_token, user }
      setToken(data.access_token)
      setUser(data.user)
      localStorage.setItem("authToken", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Login error"
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const sendOtp = async (email: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Failed to send OTP")
      
      // OTP sent successfully
      localStorage.setItem("pendingEmail", email)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Send OTP error"
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (email: string, otp: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "OTP verification failed")

      // Backend returns { access_token, user }
      setToken(data.access_token)
      setUser(data.user)
      localStorage.setItem("authToken", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "OTP verification error"
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signup = async (data: SignupData) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const resData = await res.json()

      if (!res.ok) throw new Error(resData.message || "Signup failed")

      // After signup, user should still login or verify OTP
      // For now, just store the email for OTP verification
      localStorage.setItem("pendingEmail", data.email)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Signup error"
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setError(null)
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    localStorage.removeItem("pendingEmail")
  }

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    login,
    sendOtp,
    verifyOtp,
    signup,
    logout,
    isAuthenticated: !!token && !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
