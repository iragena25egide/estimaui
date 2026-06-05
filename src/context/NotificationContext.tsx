import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import API from "@/context/axios";
import { useAuth } from "./AuthContext";

export interface AppNotification {
  id: string;
  type?: string;
  payload?: any;
  isRead: boolean;
  createdAt: string;
  recipientRole?: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (user && token) {
      // 1. Fetch initial historical notifications
      const fetchNotifications = async () => {
        try {
          const res = await API.get("/notifications");
          setNotifications(res.data);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      };
      fetchNotifications();

      // 2. Initialize Socket.io connection for real-time alerts
      const newSocket = io("http://localhost:3000", {
        query: { role: user.role },
      });

      newSocket.on("connect", () => {
        console.log("🔌 Connected to live notifications server");
      });

      if (user.role === "ADMIN") {
        newSocket.on("admin_activity_notification", (payload: any) => {
          // Play a gentle sound (optional)
          try {
            const audio = new Audio('/notification.mp3');
            audio.play().catch(() => {});
          } catch(e) {}

          toast.info(`${payload.actorName} ${payload.actionDescription}`, {
            icon: "🔔",
            duration: 6000,
          });

          // Prepend to our state
          setNotifications((prev) => [
            {
              id: payload.id || Date.now().toString(),
              type: "admin_activity_notification",
              payload,
              isRead: false,
              createdAt: payload.createdAt || new Date().toISOString(),
            },
            ...prev,
          ]);
        });
        
        newSocket.on("qs_registered", (payload: any) => {
          toast.success(`New QS Registered: ${payload.name}`, {
            icon: "🎉",
            duration: 6000,
          });
          setNotifications((prev) => [
            {
              id: payload.id || Date.now().toString(),
              type: "QS_REGISTERED",
              payload,
              isRead: false,
              createdAt: payload.createdAt || new Date().toISOString(),
            },
            ...prev,
          ]);
        });
      }

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      // Clear out if logged out
      setNotifications([]);
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user, token]);

  const markAsRead = async (id: string) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.patch(`/notifications/read-all`);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
