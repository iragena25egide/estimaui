import React from "react"
import aiBg from "../../assets/estimation_ai_bg.png"

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-white">
      
      {/* Left side: The Auth Form */}
      <div className="flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Logo visible on small screens only */}
          <div className="md:hidden mb-8 text-center">
            <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-xl font-bold text-lg mx-auto mb-3 shadow-lg">
              EST
            </div>
            <h1 className="text-2xl font-bold">Estimator</h1>
          </div>

          <div className="">
            {children}
          </div>
        </div>
      </div>

      {/* Right side: AI Background & Branding */}
      <div 
        className="hidden md:flex relative flex-col justify-between p-16 text-white overflow-hidden"
        style={{
          backgroundImage: `url(${aiBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-slate-900/60 z-0 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent z-0"></div>
        
        {/* Top Branding */}
        <div className="relative z-10">
          <div className="mb-12 flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-xl font-bold text-lg shadow-lg">
              EST
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Estimator
            </h1>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="relative z-10 mt-auto">
          <h2 className="text-4xl font-bold leading-tight mb-4 text-white">
            Smart Construction
            <br />
            Estimation Platform
          </h2>
          <p className="text-slate-300 text-lg max-w-md mb-12">
            Create BOQs, manage material takeoffs, handle projects,
            and generate reports — all in one intelligent system.
          </p>

          <div className="grid grid-cols-3 gap-6 text-center border-t border-white/20 pt-8">
            <div>
              <p className="text-3xl font-bold text-blue-400">120+</p>
              <p className="text-sm text-slate-300 mt-1">Projects</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-400">50+</p>
              <p className="text-sm text-slate-300 mt-1">Companies</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-400">99%</p>
              <p className="text-sm text-slate-300 mt-1">Accuracy</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default AuthLayout
