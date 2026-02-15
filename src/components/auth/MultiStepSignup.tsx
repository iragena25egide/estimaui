import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface MultiStepSignupProps {
  switchToLogin: () => void
}

type SignupStep = 1 | 2

const MultiStepSignup: React.FC<MultiStepSignupProps> = ({
  switchToLogin,
}) => {
  const [step, setStep] = useState<SignupStep>(1)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: send signup data to backend
  }

  return (
    <Card className="w-full max-w-md shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          Create Account
        </CardTitle>
        <p className="text-sm text-slate-500">
          Step {step} of 2
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <Input placeholder="First Name" required />
              <Input placeholder="Last Name" required />
              <Input type="email" placeholder="Email address" required />
              <Input type="password" placeholder="Create password" required />

              <Button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-black hover:bg-gray-800"
              >
                Continue
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Input placeholder="Company Name" required />
              <Input placeholder="Role (Admin / Estimator)" required />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-full"
                >
                  Back
                </Button>

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800"
                >
                  Create Account
                </Button>
              </div>
            </>
          )}
        </form>

        <p className="text-sm text-center text-slate-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={switchToLogin}
            className="text-black cursor-pointer font-medium"
          >
            Sign In
          </span>
        </p>
      </CardContent>
    </Card>
  )
}

export default MultiStepSignup
