import React from "react"

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-white">
      
      {/* LEFT SIDE - BRAND PANEL */}
      <div className="hidden md:flex relative flex-col justify-between p-16 bg-gradient-to-br from-slate-900 via-black to-slate-800 text-white overflow-hidden">
        
        {/* Background Blur Effect */}
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-10 -left-20" />
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl bottom-10 right-0" />

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-12 flex items-center gap-3">
            <div className="w-12 h-12 bg-white text-black flex items-center justify-center rounded-xl font-bold text-lg shadow-lg">
              EP
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              EstimaPro
            </h1>
          </div>

          {/* Headline */}
          <h2 className="text-4xl font-bold leading-tight mb-6">
            Smart Construction
            <br />
            Estimation Platform
          </h2>

          <p className="text-slate-300 text-lg max-w-md">
            Create BOQs, manage material takeoffs, handle projects,
            and generate reports — all in one intelligent system.
          </p>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-6 text-center mt-16">
          <div>
            <p className="text-2xl font-bold">120+</p>
            <p className="text-sm text-slate-400">Projects</p>
          </div>
          <div>
            <p className="text-2xl font-bold">50+</p>
            <p className="text-sm text-slate-400">Companies</p>
          </div>
          <div>
            <p className="text-2xl font-bold">99%</p>
            <p className="text-sm text-slate-400">Accuracy</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM AREA */}
      <div className="flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo */}
          <div className="md:hidden mb-8 text-center">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-xl font-bold text-lg mx-auto mb-3">
              EP
            </div>
            <h1 className="text-2xl font-bold">EstimaPro</h1>
          </div>

          {/* Form Card */}
          <div className="">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
