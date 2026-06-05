import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings as IconSettings,
  Menu,
} from "lucide-react";
import API from "@/context/axios";
import { useNotifications } from "@/context/NotificationContext";

type UserType = {
  id: string;
  name: String;
  email: string;
  role: string;
  lastLogin?: string;
};

const TopHeader: React.FC<{
  projectName?: string;
  onOpenSidebar?: () => void;
}> = ({ projectName = "Estimator Dashboard", onOpenSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const profileRef = useRef<HTMLDivElement | null>(null);

  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("token");
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
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  const fmt = (iso?: string) =>
    iso ? new Date(iso).toLocaleString() : "";

  if (loadingUser) return null;

  return (
    <header className="fixed top-0 md:left-64 left-0 right-0 h-16 bg-white shadow-sm border-b px-6 flex items-center justify-between z-30">

      
      <div className="md:hidden">
        <button onClick={onOpenSidebar}>
          <Menu className="w-5 h-5" />
        </button>
      </div>

      
      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-sm focus:outline-none"
          />
        </div>
      </div>

      
      <div className="flex items-center gap-4">

        
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-purple-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] rounded-2xl border border-white/50 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-gray-100/50 flex justify-between items-center bg-white/50">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-purple-600 font-medium hover:text-purple-700 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                      <Bell className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">No new notifications</p>
                    <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((n) => (
                      <button 
                        key={n.id} 
                        onClick={() => !n.isRead && markAsRead(n.id)}
                        className={`p-4 text-left border-b border-gray-50 hover:bg-gray-50/80 transition-colors relative ${!n.isRead ? 'bg-purple-50/30' : ''}`}
                      >
                        {!n.isRead && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-purple-500 rounded-r-full" style={{ height: 'calc(100% - 16px)' }} />
                        )}
                        <div className="flex gap-3">
                          <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${!n.isRead ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                            <Bell className="w-4 h-4" />
                          </div>
                          <div>
                            <p className={`text-sm ${!n.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                              {n.type === 'admin_activity_notification' 
                                ? <span className="font-semibold">{n.payload?.actorName}</span> 
                                : n.type === 'QS_REGISTERED'
                                ? <span>New QS Registration</span>
                                : 'Notification'
                              }
                            </p>
                            <p className={`text-xs mt-1 ${!n.isRead ? 'text-gray-700' : 'text-gray-500'}`}>
                              {n.type === 'admin_activity_notification' 
                                ? n.payload?.actionDescription
                                : n.type === 'QS_REGISTERED'
                                ? `${n.payload?.name} has joined as QS.`
                                : JSON.stringify(n.payload)
                              }
                            </p>
                            <p className="text-[10px] text-gray-400 mt-2 font-medium">
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
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>

            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-medium">
                {user?.name} 
              </span>
              <span className="text-xs text-gray-500">
                {user?.role}
              </span>
            </div>

            <ChevronDown className="w-4 h-4" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border">
              <div className="p-4 border-b">
                <div className="text-sm font-medium">
                  {user?.name} 
                </div>
                <div className="text-xs text-gray-500">
                  {user?.email}
                </div>
                {user?.lastLogin && (
                  <div className="text-xs text-gray-400 mt-1">
                    Last login: {fmt(user.lastLogin)}
                  </div>
                )}
              </div>

              <div className="p-2">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm">
                  <IconSettings className="w-4 h-4" />
                  Account settings
                </button>

                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm text-red-600"
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