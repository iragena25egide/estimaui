import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, ChevronDown, LogOut, User, Settings as IconSettings } from "lucide-react";

type Notification = {
	id: string;
	title: string;
	description?: string;
	unread?: boolean;
	timestamp?: string;
};

const TopBar: React.FC<{ projectName?: string }> = ({ projectName = "Your Project" }) => {
	const [profileOpen, setProfileOpen] = useState(false);
	const [notifOpen, setNotifOpen] = useState(false);
	const [notifications, setNotifications] = useState<Notification[]>([
		{ id: "n1", title: "Report generated", description: "BOQ report ready", unread: true, timestamp: new Date().toISOString() },
		{ id: "n2", title: "New project assigned", description: "Mall Extension", unread: true, timestamp: new Date(Date.now() - 3600_000).toISOString() },
	]);

	const unreadCount = notifications.filter((n) => n.unread).length;

	const profileRef = useRef<HTMLDivElement | null>(null);
	const notifRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const onDoc = (e: MouseEvent) => {
			if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
			if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, []);

	const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
	const markRead = (id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

	const user = {
		name: "IRAGENA EGIDE",
		email: "inekid205@gmail.com",
		role: "ADMIN",
		lastLogin: new Date(Date.now() - 2 * 3600_000).toISOString(),
	};

	const fmt = (iso?: string) => (iso ? new Date(iso).toLocaleString() : "");

	return (
		<header className="fixed top-0 left-64 right-0 h-16 bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-100 px-6 flex items-center justify-between z-30">
			{/* <div className="flex items-center gap-4">
				<div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-semibold">E</div>
				<div className="flex flex-col">
					<div className="text-sm font-semibold text-slate-900">{projectName}</div>
					<div className="text-xs text-slate-500">Estimator Dashboard</div>
				</div>
			</div> */}

			<div className="flex-1 flex justify-center px-4">
				<div className="relative w-full max-w-xl">
					<span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search className="w-4 h-4" /></span>
					<input
						aria-label="Search"
						placeholder="Search projects, clients, files..."
						className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border border-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
					/>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<div className="relative" ref={notifRef}>
					<button
						onClick={() => { setNotifOpen((s) => !s); setProfileOpen(false); }}
						aria-label="Open notifications"
						className="relative p-2 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
					>
						<Bell className="w-5 h-5 text-slate-700" />
						{unreadCount > 0 && (
							<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">{unreadCount}</span>
						)}
					</button>

					{notifOpen && (
						<div className="absolute right-0 mt-2 w-88 min-w-[320px] bg-white rounded-lg shadow-lg border border-slate-100 z-50">
							<div className="p-3 border-b flex items-center justify-between">
								<div className="font-medium">Notifications</div>
								<button onClick={markAllRead} className="text-sm text-slate-500">Mark all read</button>
							</div>
							<div className="max-h-72 overflow-y-auto">
								{notifications.map((n) => (
									<div
										key={n.id}
										onClick={() => markRead(n.id)}
										className={`p-3 border-b hover:bg-slate-50 cursor-pointer ${n.unread ? "bg-slate-50" : ""}`}
									>
										<div className="flex items-start justify-between gap-3">
											<div>
												<div className="text-sm font-medium text-slate-900">{n.title}</div>
												{n.description && <div className="text-xs text-slate-500">{n.description}</div>}
											</div>
											<div className="text-xs text-slate-400 text-right">{fmt(n.timestamp)}</div>
										</div>
									</div>
								))}
								{notifications.length === 0 && <div className="p-3 text-sm text-slate-500">No notifications</div>}
							</div>
						</div>
					)}
				</div>

				<div className="relative" ref={profileRef}>
					<button
						onClick={() => { setProfileOpen((s) => !s); setNotifOpen(false); }}
						aria-haspopup="true"
						aria-expanded={profileOpen}
						className="flex items-center gap-3 rounded-lg p-1 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
					>
						<div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
							<User className="w-4 h-4" />
						</div>
						<div className="hidden md:flex flex-col text-left">
							<div className="text-sm font-medium text-slate-900">{user.name}</div>
							<div className="text-xs text-slate-500">{user.role}</div>
						</div>
						<ChevronDown className="w-4 h-4 text-slate-500" />
					</button>

					{profileOpen && (
						<div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-100 z-50">
							<div className="p-4 border-b">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
										<User className="w-5 h-5" />
									</div>
									<div>
										<div className="text-sm font-medium text-slate-900">{user.name}</div>
										<div className="text-xs text-slate-500">{user.email}</div>
									</div>
								</div>
								<div className="mt-3 text-xs text-slate-400">Last login: {fmt(user.lastLogin)}</div>
							</div>
							<div className="p-2 space-y-1">
								<button className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 flex items-center gap-2 text-sm">
									<IconSettings className="w-4 h-4 text-slate-600" /> Account settings
								</button>
								<button className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 flex items-center gap-2 text-sm">
									<User className="w-4 h-4 text-slate-600" /> View profile
								</button>
								<button className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 flex items-center gap-2 text-sm text-red-600">
									<LogOut className="w-4 h-4" /> Logout
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default TopBar;

