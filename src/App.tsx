import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import AuthPage from "@/pages/AuthPage"
import Dashboard from "@/pages/Dashboard"


const App: React.FC = () => {
  return (
    <Routes>
      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Auth */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* 404 */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  )
}

export default App
