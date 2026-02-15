import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface LoginFormProps {
  switchToSignup: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ switchToSignup }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: connect to backend
  }

  return (
    <Card className="w-full max-w-md shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="email" placeholder="Email address" required />
          <Input type="password" placeholder="Password" required />

          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-800"
          >
            Sign In
          </Button>
        </form>

        <p className="text-sm text-center text-slate-600 mt-4">
          Don’t have an account?{" "}
          <span
            onClick={switchToSignup}
            className="text-black cursor-pointer font-medium"
          >
            Create account
          </span>
        </p>
      </CardContent>
    </Card>
  )
}

export default LoginForm
