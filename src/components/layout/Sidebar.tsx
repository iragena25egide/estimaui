import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, ClipboardList, Users, Settings, Box, MapPin, Layers, Archive, Grid, Truck, Hammer, FilePlus, File, X } from "lucide-react";

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const active = location.pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors ${
        active ? "bg-slate-100 font-semibold" : "text-slate-700"
      }`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC<{ mobileOpen?: boolean; onClose?: () => void }> = ({ mobileOpen = false, onClose }) => {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block fixed top-0 left-0 w-64 h-screen bg-white border-r border-slate-100 p-6 overflow-y-auto z-30">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 overflow-hidden rounded-lg">
          <img src="/src/assets/estimation-logo.jpeg" alt="logo" />
        </div>
        <div>
          <div className="text-lg font-bold text-slate-900">EstimaPro</div>
          <div className="text-xs text-slate-500">Estimation Suite</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        <NavItem to="/dashboard" icon={<Home className="w-5 h-5" />} label="Overview" />
        <NavItem to="/dashboard/projects" icon={<ClipboardList className="w-5 h-5" />} label="Projects" />
        <NavItem to="/dashboard/drawings" icon={<MapPin className="w-5 h-5" />} label="Drawings" />
        <NavItem to="/dashboard/boq" icon={<FileText className="w-5 h-5" />} label="Bill of Quantity" />
        <NavItem to="/dashboard/dimension-sheets" icon={<Layers className="w-5 h-5" />} label="Dimension Sheets" />
        <NavItem to="/dashboard/equipment-costs" icon={<Truck className="w-5 h-5" />} label="Equipment Cost" />
        <NavItem to="/dashboard/labor-productivity" icon={<Hammer className="w-5 h-5" />} label="Labor Productivity" />
        <NavItem to="/dashboard/material-takeoff" icon={<Archive className="w-5 h-5" />} label="Material Take Off" />
        <NavItem to="/dashboard/rate-analysis" icon={<Grid className="w-5 h-5" />} label="Rate Analysis" />
        <NavItem to="/dashboard/reports" icon={<File className="w-5 h-5" />} label="Reports" />
        <NavItem to="/dashboard/teams" icon={<Users className="w-5 h-5" />} label="Teams" />
        <NavItem to="/dashboard/specification-register" icon={<FilePlus className="w-5 h-5" />} label="Specification Register" />
        <NavItem to="/dashboard/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
      </nav>

      <div className="mt-auto pt-6">
        {/* <div className="text-xs text-slate-500">&copy;EstimaApp.</div> */}
        
      </div>
    </aside>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <aside className="absolute left-0 top-0 w-64 h-full bg-white border-r border-slate-100 p-4 overflow-y-auto shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 overflow-hidden rounded-lg">
                  <img src="/src/assets/estimation-logo.jpeg" alt="logo" />
                </div>
                <div>
                  <div className="text-md font-semibold text-slate-900">EstimaPro</div>
                  <div className="text-xs text-slate-500">Estimation Suite</div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded hover:bg-slate-100"><X className="w-4 h-4" /></button>
            </div>
            <nav className="flex flex-col gap-1">
              <NavItem to="/dashboard" icon={<Home className="w-5 h-5" />} label="Overview" />
              <NavItem to="/dashboard/projects" icon={<ClipboardList className="w-5 h-5" />} label="Projects" />
              <NavItem to="/dashboard/drawings" icon={<MapPin className="w-5 h-5" />} label="Drawings" />
              <NavItem to="/dashboard/boq" icon={<FileText className="w-5 h-5" />} label="Bill of Quantity" />
              <NavItem to="/dashboard/dimension-sheets" icon={<Layers className="w-5 h-5" />} label="Dimension Sheets" />
              <NavItem to="/dashboard/equipment-costs" icon={<Truck className="w-5 h-5" />} label="Equipment Cost" />
              <NavItem to="/dashboard/labor-productivity" icon={<Hammer className="w-5 h-5" />} label="Labor Productivity" />
              <NavItem to="/dashboard/material-takeoff" icon={<Archive className="w-5 h-5" />} label="Material Take Off" />
              <NavItem to="/dashboard/rate-analysis" icon={<Grid className="w-5 h-5" />} label="Rate Analysis" />
              <NavItem to="/dashboard/reports" icon={<File className="w-5 h-5" />} label="Reports" />
              <NavItem to="/dashboard/teams" icon={<Users className="w-5 h-5" />} label="Teams" />
              <NavItem to="/dashboard/specification-register" icon={<FilePlus className="w-5 h-5" />} label="Specification Register" />
              <NavItem to="/dashboard/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
            </nav>

            <div className="mt-auto pt-6">
              <div className="text-xs text-slate-500">Need help?</div>
              <Link to="/docs" className="text-sm text-blue-600 font-medium">Documentation</Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
