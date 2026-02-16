import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, ClipboardList, Users, Settings, Box } from "lucide-react";

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

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-slate-100 min-h-screen p-6">
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
        <NavItem to="/dashboard/boq" icon={<FileText className="w-5 h-5" />} label="BOQ" />
        <NavItem to="/dashboard/reports" icon={<Box className="w-5 h-5" />} label="Reports" />
        <NavItem to="/dashboard/teams" icon={<Users className="w-5 h-5" />} label="Teams" />
        <NavItem to="/dashboard/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
      </nav>

      <div className="mt-auto pt-6">
        <div className="text-xs text-slate-500">Need help?</div>
        <Link to="/docs" className="text-sm text-blue-600 font-medium">Documentation</Link>
      </div>
    </aside>
  );
};

export default Sidebar;
