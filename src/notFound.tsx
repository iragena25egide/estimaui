import React from "react"
import { useNavigate } from "react-router-dom"

const PageNotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-6 overflow-hidden relative">

      
      <div className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse bottom-10 right-10"></div>

      <div className="text-center max-w-xl relative z-10">

        
        <h1 className="text-8xl font-extrabold text-primary animate-bounce">
          404
        </h1>

       
        <h2 className="mt-6 text-3xl font-semibold text-gray-800">
          Oops! Page Not Found
        </h2>

       
        <p className="mt-4 text-gray-500">
          The page you are trying to access doesn’t exist or has been moved.
          Let's get you back on track.
        </p>

        
        <div className="mt-8 flex justify-center gap-4">

          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 rounded-2xl bg-primary text-white font-medium shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-2xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Go Back
          </button>

        </div>

      </div>
    </div>
  )
}

export default PageNotFound