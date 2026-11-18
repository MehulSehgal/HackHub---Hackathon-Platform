import React, { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAppContext } from "../context/AppContext";
import { NotificationCenter } from "./NotificationCenter";
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquare,
  FileText,
  Mic,
  Users,
  LogOut,
  Rocket,
  Bell,
  Menu,
  X,
  Compass,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { logout, currentUser, unreadNotificationCount } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isLocallyAuthenticated, setIsLocallyAuthenticated] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated") === "true";
      setIsLocallyAuthenticated(authStatus);
      setIsLoading(false);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  useEffect(() => {
    if (!isLoading && !isLocallyAuthenticated) {
      router.push("/auth");
    }
  }, [isLocallyAuthenticated, router, isLoading]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Files", href: "/files", icon: FileText },
    { name: "Pitch", href: "/pitch", icon: Mic },
    { name: "Team", href: "/team", icon: Users },
    { name: "Notifications", href: "/notifications", icon: Bell },
  ];

  const handleLogout = () => {
    logout();
    localStorage.removeItem("isAuthenticated");
    router.push("/auth");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#312e81] text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isLocallyAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#0f172a] to-[#312e81] text-white">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-700/80 sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Rocket className="text-white w-4 h-4" />
          </div>
          <span className="font-bold text-lg">HackHub</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:text-white relative"
              aria-label="Open notifications"
            >
              <Bell className="w-5 h-5 text-sky-400" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
            <NotificationCenter
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar / Mobile Drawer */}
      <aside
        className={`${
          isMobileMenuOpen ? "flex" : "hidden md:flex"
        } w-full md:w-64 h-auto md:h-screen bg-[#0f172a]/80 backdrop-blur-md border-r border-gray-700/80 p-4 flex-col fixed md:sticky top-0 z-30 overflow-y-auto`}
      >
        <div className="mb-6 text-center hidden md:block">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl mx-auto mb-2 flex items-center justify-center shadow-lg">
            <Rocket className="text-white w-5 h-5" />
          </div>
          <h1 className="text-2xl font-semibold">HackHub</h1>
          <p className="text-sm text-zinc-300 mt-1">Innovate. Collaborate. Launch.</p>
        </div>

        {/* Desktop Notification Bell Header Trigger */}
        <div className="hidden md:block mb-4 relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 transition-all text-xs font-medium"
          >
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-sky-400" />
              <span>Notifications</span>
            </div>
            {unreadNotificationCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px]">
                {unreadNotificationCount}
              </span>
            ) : (
              <span className="text-slate-500 text-[11px]">All read</span>
            )}
          </button>
          <NotificationCenter
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>

        <nav className="flex-1">
          <ul className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-medium shadow-md shadow-cyan-900/20"
                        : "text-gray-300 hover:bg-gray-800/50"
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="mr-3 w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                    {item.name === "Notifications" && unreadNotificationCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-bold rounded-full">
                        {unreadNotificationCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-sm">
              👤
            </div>
            <div className="ml-3">
              <p className="font-medium text-sm">{currentUser?.name || "User"}</p>
              <p className="text-xs text-gray-400">
                {currentUser?.role || "Team Member"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-start px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800/50 transition-all text-sm"
          >
            <LogOut className="mr-3 w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">{children}</main>
    </div>
  );
};

export default Layout;
