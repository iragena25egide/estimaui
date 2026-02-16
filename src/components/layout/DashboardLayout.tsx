import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar is fixed; TopBar is fixed. Main content needs left margin and top padding. */}
      <Sidebar />
      <TopBar projectName="EstimaPro Projects" />

      <main className="ml-64 mt-14 p-8 min-h-[calc(100vh-56px)]">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
