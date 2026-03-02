import React, { Suspense, lazy } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import TopLoader from "@/loader"
import PageNotFound from "@/notFound"


const AuthPage = lazy(() => import("@/pages/AuthPage"))
const Dashboard = lazy(() => import("@/pages/Dashboard"))
const DashboardLayout = lazy(() => import("@/components/layout/DashboardLayout"))

const Projects = lazy(() => import("@/pages/dashboard/Projects"))
const DrawingProjects = lazy(() => import("@/pages/dashboard/drawingProjects"))
const Drawings = lazy(() => import("@/pages/dashboard/Drawings"))
const BillOfQuantity = lazy(() => import("@/pages/dashboard/BillOfQuantity"))
const DimensionSheets = lazy(() => import("@/pages/dashboard/DimensionSheets"))
const EquipmentCosts = lazy(() => import("@/pages/dashboard/EquipmentCosts"))
const LaborProductivity = lazy(() => import("@/pages/dashboard/LaborProductivity"))
const MaterialTakeOff = lazy(() => import("@/pages/dashboard/MaterialTakeOff"))
const RateAnalysis = lazy(() => import("@/pages/dashboard/RateAnalysis"))
const Reports = lazy(() => import("@/pages/dashboard/Reports"))
const Teams = lazy(() => import("@/pages/dashboard/Teams"))
const SpecificationRegister = lazy(() => import("@/pages/dashboard/SpecificationRegister"))
const Settings = lazy(() => import("@/pages/dashboard/Settings"))

const App: React.FC = () => {
  return (
    <Suspense fallback={null}>
      {/* Top Progress Bar */}
      <TopLoader />

      <Routes>

        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Auth */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Dashboard Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>

          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />

          {/* Drawings Module */}
          <Route path="drawings" element={<DrawingProjects />} />
          <Route path="drawings/:projectId" element={<Drawings />} />

          {/* Other Modules */}
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
        <Route path="*" element={<PageNotFound />} />

      </Routes>
    </Suspense>
  )
}

export default App