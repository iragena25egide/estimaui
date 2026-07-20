import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Moon,
  Settings as IconSettings,
  Menu,
} from "lucide-react";
import API from "@/context/axios";
import { useNotifications } from "@/context/NotificationContext";

type UserType = {
  id: string;
  name: String;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  lastLogin?: string;
};

const TopHeader: React.FC<{
  projectName?: string;
  onOpenSidebar?: () => void;
}> = ({ projectName = "Dashboard", onOpenSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const profileRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/auth";
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      )
        setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/auth";
  };

  const fmt = (iso?: string) =>
    iso ? new Date(iso).toLocaleString() : "";

  if (loadingUser) return null;

  return (
    <header className="fixed top-0 md:left-[260px] left-0 right-0 h-[72px] bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 transition-all">
      <div className="flex items-center gap-4 flex-1">
        <div className="md:hidden">
          <button onClick={onOpenSidebar} className="p-2 text-slate-500 hover:bg-slate-100 rounded-md">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="hidden md:flex items-center text-sm font-medium text-slate-500 gap-2 whitespace-nowrap">
          <span className="uppercase tracking-wider text-xs">WORKSPACE</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-semibold">{projectName}</span>
        </div>

        <div className="relative w-full max-w-md ml-0 md:ml-8 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search projects, estimates, staff..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder-slate-400"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden lg:inline-flex items-center justify-center h-5 px-1.5 text-[10px] font-medium text-slate-400 bg-white border border-slate-200 rounded">⌘</kbd>
            <kbd className="hidden lg:inline-flex items-center justify-center h-5 px-1.5 text-[10px] font-medium text-slate-400 bg-white border border-slate-200 rounded">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
          <Moon className="w-5 h-5" />
        </button>

        <button className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-slate-100 transition-colors">
          <span className="text-lg">🇺🇸</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <div className="w-px h-6 bg-slate-200 hidden sm:block" />

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-semibold text-slate-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[350px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <Bell className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">No new notifications</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((n) => (
                      <button 
                        key={n.id} 
                        onClick={() => !n.isRead && markAsRead(n.id)}
                        className={`p-4 text-left border-b border-slate-50 hover:bg-slate-50 transition-colors relative ${!n.isRead ? 'bg-blue-600/5' : ''}`}
                      >
                        {!n.isRead && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                        )}
                        <div className="flex gap-3">
                          <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${!n.isRead ? 'bg-blue-600/20 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                            <Bell className="w-4 h-4" />
                          </div>
                          <div>
                            <p className={`text-sm ${!n.isRead ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                              {n.type === 'admin_activity_notification' 
                                ? <span className="font-semibold">{n.payload?.actorName}</span> 
                                : n.type === 'QS_REGISTERED'
                                ? <span>New QS Registration</span>
                                : 'Notification'
                              }
                            </p>
                            <p className={`text-xs mt-1 ${!n.isRead ? 'text-slate-700' : 'text-slate-500'}`}>
                              {n.type === 'admin_activity_notification' 
                                ? n.payload?.actionDescription
                                : n.type === 'QS_REGISTERED'
                                ? `${n.payload?.name} has joined as QS.`
                                : JSON.stringify(n.payload)
                              }
                            </p>
                            <p className="text-[10px] text-slate-400 mt-2 font-medium">
                              {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-600 font-bold text-xs flex items-center justify-center">
                {user?.name?.[0] || user?.firstName?.[0] || "U"}
              </div>
              <div className="hidden md:flex flex-col text-left mr-1">
                <span className="text-xs font-semibold text-slate-900 leading-tight">
                  {user?.name || user?.firstName}
                </span>
                <span className="text-[10px] text-slate-500 leading-tight">
                  {user?.role === "ESTIMATOR" ? "Estimator" : "Admin"}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-xl border border-slate-100 z-50">
              <div className="p-4 border-b border-slate-100">
                <div className="text-sm font-semibold text-slate-900">
                  {user?.name || user?.firstName + " " + user?.lastName}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {user?.email}
                </div>
                {user?.lastLogin && (
                  <div className="text-[10px] text-slate-400 mt-2">
                    Last login: {fmt(user.lastLogin)}
                  </div>
                )}
              </div>

              <div className="p-2">
                <button className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2 text-sm text-slate-700 transition-colors">
                  <IconSettings className="w-4 h-4 text-slate-400" />
                  Account settings
                </button>

                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 hover:bg-red-50 rounded-lg flex items-center gap-2 text-sm text-red-600 transition-colors mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopHeader;