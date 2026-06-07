import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, ClipboardList, Users, Settings, MapPin, Layers, Archive, Grid, Truck, Hammer, FilePlus, File, X, ChevronDown, LogOut, CheckSquare } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const active = location.pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
        active 
          ? "bg-[#10b981] text-white font-medium shadow-sm" 
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
      }`}
    >
      <div className={`w-5 h-5 ${active ? "text-white" : "text-slate-400"}`}>{icon}</div>
      <span className="text-sm">{label}</span>
    </Link>
  );
};

const Sidebar: React.FC<{ mobileOpen?: boolean; onClose?: () => void }> = ({ mobileOpen = false, onClose }) => {
  const { user, isViewer, logout } = useAuth();
  
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 w-[260px] h-screen bg-[#1e293b] border-r border-slate-800 z-30">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#10b981] flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl leading-none">E</span>
            </div>
            <div className="text-xl font-bold text-white tracking-tight">Estimator</div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="w-full outline-none">
              <div className="flex items-center justify-between p-2 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9 rounded-md border border-slate-700">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=10b981&color=fff`} />
                    <AvatarFallback className="rounded-md bg-slate-700 text-slate-300">{user?.firstName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-left flex flex-col">
                    <span className="text-sm font-semibold text-slate-100 truncate w-28">{user?.firstName} {user?.lastName}</span>
                    <span className="text-[10px] text-[#10b981] font-medium tracking-wide">{user?.role || "System Admin"}</span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600"><LogOut className="mr-2 h-4 w-4" /> Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
          <NavItem to="/dashboard" icon={<Home />} label="Overview" />
          <NavItem to="/dashboard/projects" icon={<ClipboardList />} label="Projects" />
          <NavItem to="/dashboard/drawings" icon={<MapPin />} label="Drawings" />
          <NavItem to="/dashboard/boq" icon={<FileText />} label="Bill of Quantity" />
          
          <div className="pt-4 pb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">Estimations</span>
          </div>
          <NavItem to="/dashboard/dimension-sheets" icon={<Layers />} label="Dimension Sheets" />
          <NavItem to="/dashboard/equipment-costs" icon={<Truck />} label="Equipment Cost" />
          <NavItem to="/dashboard/labor-productivity" icon={<Hammer />} label="Labor Productivity" />
          <NavItem to="/dashboard/material-takeoff" icon={<Archive />} label="Material Take Off" />
          <NavItem to="/dashboard/rate-analysis" icon={<Grid />} label="Rate Analysis" />
          
          <div className="pt-4 pb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">Management</span>
          </div>
          <NavItem to="/dashboard/reports" icon={<File />} label="Reports" />
          {!isViewer && <NavItem to="/dashboard/teams" icon={<Users />} label="Teams" />}
          <NavItem to="/dashboard/specification-register" icon={<FilePlus />} label="Specification" />
          <NavItem to="/dashboard/approvals" icon={<CheckSquare />} label="Approvals" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
          <aside className="absolute left-0 top-0 w-[260px] h-full bg-[#1e293b] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#10b981] flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-xl leading-none">E</span>
                </div>
                <div className="text-xl font-bold text-white tracking-tight">Estimator</div>
              </div>
              <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg border border-slate-700">
                <Avatar className="w-10 h-10 rounded-md border border-slate-700">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=10b981&color=fff`} />
                  <AvatarFallback className="rounded-md bg-slate-700 text-slate-300">{user?.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-100">{user?.firstName} {user?.lastName}</span>
                  <span className="text-[10px] text-[#10b981] font-medium tracking-wide">{user?.role || "System Admin"}</span>
                </div>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              <NavItem to="/dashboard" icon={<Home />} label="Overview" />
              <NavItem to="/dashboard/projects" icon={<ClipboardList />} label="Projects" />
              <NavItem to="/dashboard/drawings" icon={<MapPin />} label="Drawings" />
              <NavItem to="/dashboard/boq" icon={<FileText />} label="Bill of Quantity" />
              
              <div className="pt-4 pb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">Estimations</span>
              </div>
              <NavItem to="/dashboard/dimension-sheets" icon={<Layers />} label="Dimension Sheets" />
              <NavItem to="/dashboard/equipment-costs" icon={<Truck />} label="Equipment Cost" />
              <NavItem to="/dashboard/labor-productivity" icon={<Hammer />} label="Labor Productivity" />
              <NavItem to="/dashboard/material-takeoff" icon={<Archive />} label="Material Take Off" />
              <NavItem to="/dashboard/rate-analysis" icon={<Grid />} label="Rate Analysis" />
              
              <div className="pt-4 pb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">Management</span>
              </div>
              <NavItem to="/dashboard/reports" icon={<File />} label="Reports" />
              {!isViewer && <NavItem to="/dashboard/teams" icon={<Users />} label="Teams" />}
              <NavItem to="/dashboard/specification-register" icon={<FilePlus />} label="Specification" />
            </nav>
            <div className="p-4 border-t border-slate-800">
              <button onClick={logout} className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
