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

type Notification = {
  id: string;
  title: string;
  description?: string;
  unread?: boolean;
  timestamp?: string;
};

type UserType = {
  id: string;
  firstName: string;
  lastName: string;
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

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const profileRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  
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

      {/* Mobile Menu */}
      <div className="md:hidden">
        <button onClick={onOpenSidebar}>
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border">
              <div className="p-3 font-medium border-b">
                Notifications
              </div>
              {notifications.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="p-3 text-sm border-b">
                    {n.title}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Profile */}
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
                {user?.firstName} {user?.lastName} 
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
                  {user?.firstName} {user?.lastName}
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