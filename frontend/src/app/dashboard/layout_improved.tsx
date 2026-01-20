'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, LayoutDashboard, LogOut, User, Moon, Sun, Bell, Settings,
  Target, TrendingUp, Zap, Award, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: number; message: string; read: boolean; icon?: string }>>([
    { id: 1, message: '🎉 Welcome to TaskFlow! Start crushing your goals!', read: false, icon: '🎉' },
    { id: 2, message: '💪 You\'re doing great! Keep up the momentum!', read: false, icon: '💪' },
    { id: 3, message: '⭐ Pro tip: Break big tasks into smaller ones!', read: false, icon: '⭐' },
  ]);
  const router = useRouter();
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  const { logout } = useAuth();

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

  if (!isAuthenticated) {
    return null;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-purple-200/50 dark:border-gray-700/50 flex flex-col shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Logo with Gradient */}
              <div className="h-20 flex items-center justify-center border-b border-purple-200/50 dark:border-gray-700/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                <div className="relative flex items-center gap-2">
                  <Zap className="h-8 w-8 text-yellow-300 fill-yellow-300 animate-pulse" />
                  <h1 className="text-2xl font-black text-white tracking-tight">TaskFlow</h1>
                </div>
              </div>

              {/* Motivational Quote */}
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-purple-200/50 dark:border-gray-700/50">
                <div className="flex items-start gap-2">
                  <Target className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-purple-900 dark:text-purple-200 leading-relaxed">
                    "Success is the sum of small efforts, repeated day in and day out."
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="font-semibold">Dashboard</span>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>

                {/* Stats */}
                <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Progress</span>
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600">75%</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Keep going! 🚀</p>
                </div>
              </nav>

              {/* User Profile Card */}
              <div className="p-4 border-t border-purple-200/50 dark:border-gray-700/50 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-purple-200/30 dark:border-gray-700/30">
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-purple-500 shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold text-lg">
                        {user ? getInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <Award className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Glass Effect */}
        <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-purple-200/50 dark:border-gray-700/50 flex items-center justify-between px-6 shadow-lg">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-purple-100 dark:hover:bg-gray-700 rounded-full"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dashboard
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">Let's make today productive! 💪</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications with Animation */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-purple-100 dark:hover:bg-gray-700 rounded-full">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className="h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold border-2 border-white dark:border-gray-900 shadow-lg">
                        {unreadCount}
                      </Badge>
                    </motion.div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 max-h-96 overflow-auto">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <DropdownMenuLabel className="font-bold text-base p-0">Notifications</DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" className="h-auto p-1 text-xs" onClick={markAllAsRead}>
                      Mark all read
                    </Button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-sm text-gray-500">No notifications yet</p>
                  </div>
                ) : (
                  <div>
                    {notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`p-4 cursor-pointer border-b last:border-b-0 ${
                          !notification.read ? 'bg-purple-50 dark:bg-purple-900/10' : ''
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex gap-3 items-start">
                          <span className="text-2xl">{notification.icon}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{notification.message}</p>
                            {!notification.read && (
                              <Badge variant="secondary" className="mt-1 text-xs bg-purple-100 text-purple-700">New</Badge>
                            )}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="hover:bg-purple-100 dark:hover:bg-gray-700 rounded-full"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-purple-600" />
              )}
            </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 hover:bg-purple-100 dark:hover:bg-gray-700 rounded-full px-3">
                  <Avatar className="h-8 w-8 border-2 border-purple-500">
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-sm font-bold">
                      {user ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold hidden md:inline">{user?.name?.split(' ')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                {/* User Info Header */}
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14 border-2 border-white shadow-lg">
                      <AvatarFallback className="bg-white text-purple-600 text-lg font-bold">
                        {user ? getInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-purple-100 truncate">{user?.email}</p>
                      <Badge className="mt-1 bg-white/20 text-white border-white/30 text-xs">Pro Member</Badge>
                    </div>
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                {/* Menu Items */}
                <DropdownMenuItem className="cursor-pointer py-3">
                  <User className="mr-3 h-4 w-4 text-purple-600" />
                  <div>
                    <p className="font-medium">View Profile</p>
                    <p className="text-xs text-gray-500">Manage your account</p>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="cursor-pointer py-3">
                  <Settings className="mr-3 h-4 w-4 text-purple-600" />
                  <div>
                    <p className="font-medium">Settings</p>
                    <p className="text-xs text-gray-500">Customize your experience</p>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer py-3">
                  <Award className="mr-3 h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="font-medium">Achievements</p>
                    <p className="text-xs text-gray-500">View your progress</p>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={logout} className="cursor-pointer py-3 text-red-600 dark:text-red-400 font-medium focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          {children}
        </main>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}
