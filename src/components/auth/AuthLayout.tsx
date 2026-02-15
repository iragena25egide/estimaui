import React from "react"
import estimationImg from "@/assets/estimation-logo.jpg"

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50">
      
      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-center p-16 bg-white border-r">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-lg font-bold">
            EX
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">
            EstimationX
          </h1>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Smart Construction Estimation
        </h2>

        <p className="text-slate-600 mb-8">
          Manage BOQs, Material Takeoffs, Projects and Reports in one powerful platform.
        </p>

        <img
          src={estimationImg}
          alt="Estimation preview"
          className="rounded-xl shadow-md"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
