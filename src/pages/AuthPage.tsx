import React, { useState } from "react"
import AuthLayout from "@/components/auth/AuthLayout"
import LoginForm from "@/components/auth/LoginForm"
import MultiStepSignup from "@/components/auth/MultiStepSignup"
import { useAuth } from "@/context/AuthContext"


type AuthMode = "login" | "signup"

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>("login")
  const { startSignup, verifyOtp, completeSignup } = useAuth();

  return (
    <AuthLayout>
      {mode === "login" ? (
        <LoginForm switchToSignup={() => setMode("signup")} />
      ) : (
        <MultiStepSignup switchToLogin={() => setMode("login")} />
      )}
    </AuthLayout>
  )
}

export default AuthPage
