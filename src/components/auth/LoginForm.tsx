import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface LoginFormProps {
  switchToSignup: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ switchToSignup }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // TODO: Connect backend here
      if (!email || !password) {
        throw new Error("Please fill in all fields")
      }

      console.log("Login attempt:", { email, password })
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    console.log("Google login clicked")
    // TODO: Add Google OAuth logic
  }

  return (
    <div className="relative">
      {/* Background Effects similar to AuthLayout */}
      <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-10 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl bottom-10 right-0 pointer-events-none" />
      
      <Card className="w-full max-w-md shadow-2xl border border-slate-200/50 relative z-10 bg-white/95 backdrop-blur-sm">

        <div className="relative">
          <div className="absolute left-1/2 -top-16 transform -translate-x-1/2">
            <div className="w-20 h-20 rounded-full bg-white p-4 shadow-md border border-slate-100">
              <img src="/estimation-logo.svg" alt="Estima Logo" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>

      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-3xl font-bold text-center text-slate-900">
          Welcome Back
        </CardTitle>
        <p className="text-sm text-slate-500 text-center">
          Enter your credentials to access your account
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md">
            {error}
          </div>
        )}
        

        {/* Google Login */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 cursor-pointer h-11 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-700 font-medium transition-all rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="18px"
            height="18px"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.73 1.22 9.24 3.6l6.9-6.9C35.64 2.18 30.2 0 24 0 14.64 0 6.52 5.52 2.56 13.52l8.06 6.26C12.5 13.36 17.78 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.5 24.5c0-1.7-.15-3.34-.42-4.92H24v9.32h12.68c-.55 2.96-2.24 5.46-4.76 7.14l7.32 5.7C43.96 37.5 46.5 31.5 46.5 24.5z"
            />
            <path
              fill="#4A90E2"
              d="M10.62 28.78a14.5 14.5 0 010-9.56l-8.06-6.26A24 24 0 000 24c0 3.88.93 7.55 2.56 10.96l8.06-6.18z"
            />
            <path
              fill="#FBBC05"
              d="M24 48c6.48 0 11.92-2.14 15.9-5.8l-7.32-5.7c-2.04 1.38-4.66 2.2-8.58 2.2-6.22 0-11.5-3.86-13.38-9.28l-8.06 6.18C6.52 42.48 14.64 48 24 48z"
            />
          </svg>
          Continue with Google
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-xs text-slate-500">OR</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input with Icon */}
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <Input
                type="email"
                placeholder="egide@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus-visible:ring-1 focus-visible:ring-black h-11 pl-10"
              />
            </div>
          </div>

          {/* Password Input with Icon and Toggle */}
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus-visible:ring-1 focus-visible:ring-black h-11 pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L3 3m9 21l9-9" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 cursor-pointer"
              />
              <span className="text-sm text-slate-600">Remember me</span>
            </label>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-sm text-slate-600 hover:text-slate-900 font-medium hover:underline transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-br from-slate-900 to-black hover:from-black hover:to-slate-900 text-white shadow-lg hover:shadow-xl h-11 cursor-pointer font-semibold tracking-wide rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Divider */}

        {/* Switch */}
        <p className="text-sm text-center text-slate-600">
          Don’t have an account?{" "}
          <span
            onClick={switchToSignup}
            className="text-black cursor-pointer font-medium hover:underline"
          >
            Create account
          </span>
        </p>
        
      </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm
