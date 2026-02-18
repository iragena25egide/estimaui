import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"

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
  error: string | null
  login: (email: string, password: string) => Promise<void>
  startSignup: (data: SignupStep1Data) => Promise<void>
  verifyOtp: (email: string, otp: string) => Promise<void>
  completeSignup: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE = "http://localhost:3000/api/estimaApp"

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken")
    const savedUser = localStorage.getItem("user")

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // ================= LOGIN =================
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
      if (!res.ok) throw new Error(data.message)

      setToken(data.access_token)
      setUser(data.user)

      localStorage.setItem("authToken", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ================= STEP 1: START SIGNUP =================
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

  // ================= STEP 2: VERIFY OTP =================
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

  // ================= STEP 3: COMPLETE SIGNUP =================
  // const completeSignup = async (email: string, password: string) => {
  //   setLoading(true)
  //   setError(null)

  //   try {
  //     const res = await fetch(`${API_BASE}/users/complete-signup`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     })

  //     const result = await res.json()
  //     if (!res.ok) throw new Error(result.message)

  //     setToken(result.access_token)
  //     setUser(result.user)

  //     localStorage.setItem("authToken", result.access_token)
  //     localStorage.setItem("user", JSON.stringify(result.user))
  //     localStorage.removeItem("pendingEmail")
  //   } catch (err: any) {
  //     setError(err.message)
  //     throw err
  //   } finally {
  //     setLoading(false)
  //   }
  // }


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
    if (!res.ok) throw new Error(result.message)

   
  } catch (err: any) {
    setError(err.message || "Signup failed. Please try again.")
  } finally {
    setLoading(false)
  }
}

  const logout = () => {
    setUser(null)
    setToken(null)
    setError(null)
    localStorage.clear()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        startSignup,
        verifyOtp,
        completeSignup,
        logout,
        isAuthenticated: !!token,
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
