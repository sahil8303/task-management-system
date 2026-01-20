'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, LayoutDashboard, LogOut, User, Moon, Sun, CheckSquare } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { getInitials } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  const { logout } = useAuth();
  const { tasks } = useTasks();

  // Calculate task statistics
  const pendingCount = tasks?.filter((t: any) => t.status === 'TODO' || t.status === 'PENDING').length || 0;
  const overdueCount = tasks?.filter((t: any) => {
    if (t.status === 'COMPLETED' || !t.dueDate) return false;
    return new Date(t.dueDate) < new Date();
  }).length || 0;

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, _hasHydrated, router]);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const isProfilePage = pathname === '/dashboard/profile';

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/40 dark:from-gray-900 dark:via-indigo-950/40 dark:to-purple-950/40 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 280 : 0,
          opacity: sidebarOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-white/80 dark:bg-gray-900/75 backdrop-blur-2xl border-r border-white/40 dark:border-gray-800/60 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 h-20 border-b border-white/40 dark:border-gray-800/60 px-6">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Own your momentum</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link href="/dashboard">
              <Button
                variant={!isProfilePage ? "default" : "ghost"}
                className="w-full justify-start gap-3 h-12 rounded-xl transition-all hover:translate-x-1 shadow-sm"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
                {pendingCount > 0 && (
                  <Badge variant="secondary" className="ml-auto bg-white/80">
                    {pendingCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href="/dashboard/profile">
              <Button
                variant={isProfilePage ? "default" : "ghost"}
                className="w-full justify-start gap-3 h-12 rounded-xl transition-all hover:translate-x-1 shadow-sm"
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Profile</span>
              </Button>
            </Link>
          </nav>

          {/* User info card */}
          <div className="p-4 border-t border-white/40 dark:border-gray-800/60">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/90 to-purple-600/90 border border-indigo-300/40 shadow-[0_20px_40px_rgba(79,70,229,0.35)]">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-12 w-12 border-2 border-white/70 shadow">
                  <AvatarFallback className="bg-white/15 text-white font-bold">
                    {user ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-white/80 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="w-full gap-2 bg-white/15 text-white hover:bg-white/25"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-b border-white/40 dark:border-gray-800/60 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isProfilePage ? 'My Profile' : 'Task Dashboard'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isProfilePage ? 'View and manage your account' : 'Manage and track all your tasks'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Dropdown */}
            <NotificationDropdown />

            {/* Dark mode toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-lg"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Profile avatar button */}
            <Link href="/dashboard/profile">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-10 w-10 ring-2 ring-indigo-200 dark:ring-indigo-800">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold">
                    {user ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
