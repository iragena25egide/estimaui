import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import AuthPage from "@/pages/AuthPage"


const App: React.FC = () => {
  return (
    <Routes>
      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/auth" replace />} />

      {/* Auth */}
      <Route path="/auth" element={<AuthPage />} />


      {/* 404 */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  )
}

export default App
