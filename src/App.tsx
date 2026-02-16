import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import AuthPage from "@/pages/AuthPage"
import Dashboard from "@/pages/Dashboard"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Projects from "@/pages/dashboard/Projects"
import Drawings from "@/pages/dashboard/Drawings"
import BillOfQuantity from "@/pages/dashboard/BillOfQuantity"
import DimensionSheets from "@/pages/dashboard/DimensionSheets"
import EquipmentCosts from "@/pages/dashboard/EquipmentCosts"
import LaborProductivity from "@/pages/dashboard/LaborProductivity"
import MaterialTakeOff from "@/pages/dashboard/MaterialTakeOff"
import RateAnalysis from "@/pages/dashboard/RateAnalysis"
import Reports from "@/pages/dashboard/Reports"
import Teams from "@/pages/dashboard/Teams"
import SpecificationRegister from "@/pages/dashboard/SpecificationRegister"
import Settings from "@/pages/dashboard/Settings"


const App: React.FC = () => {
  return (
    <Routes>
      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Auth */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="drawings" element={<Drawings />} />
        <Route path="boq" element={<BillOfQuantity />} />
        <Route path="dimension-sheets" element={<DimensionSheets />} />
        <Route path="equipment-costs" element={<EquipmentCosts />} />
        <Route path="labor-productivity" element={<LaborProductivity />} />
        <Route path="material-takeoff" element={<MaterialTakeOff />} />
        <Route path="rate-analysis" element={<RateAnalysis />} />
        <Route path="reports" element={<Reports />} />
        <Route path="teams" element={<Teams />} />
        <Route path="specification-register" element={<SpecificationRegister />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  )
}

export default App
