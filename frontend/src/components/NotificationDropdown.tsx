'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, Clock, AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTasks } from '@/hooks/useTasks';

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function NotificationDropdown() {
  const { tasks } = useTasks();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(null);

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    const newNotifications: Notification[] = [];
    const now = new Date();

    // Overdue tasks
    const overdueTasks = tasks.filter((task: any) => {
      if (task.status === 'COMPLETED' || !task.dueDate) return false;
      return new Date(task.dueDate) < now;
    });

    overdueTasks.forEach((task: any) => {
      newNotifications.push({
        id: `overdue-${task.id}`,
        type: 'warning',
        title: 'Overdue Task',
        message: `"${task.title}" is past its due date`,
        time: 'Now',
        read: false,
      });
    });

    // Due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dueTodayTasks = tasks.filter((task: any) => {
      if (task.status === 'COMPLETED' || !task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate < tomorrow;
    });

    dueTodayTasks.forEach((task: any) => {
      newNotifications.push({
        id: `due-today-${task.id}`,
        type: 'warning',
        title: 'Due Today',
        message: `"${task.title}" is due today`,
        time: 'Today',
        read: false,
      });
    });

    // Completed today
    const completedToday = tasks.filter((task: any) => {
      if (task.status !== 'COMPLETED' || !task.updatedAt) return false;
      const updatedDate = new Date(task.updatedAt);
      return updatedDate >= today;
    });

    if (completedToday.length > 0) {
      newNotifications.push({
        id: 'completed-today',
        type: 'success',
        title: 'Great Progress!',
        message: `You completed ${completedToday.length} task${completedToday.length > 1 ? 's' : ''} today`,
        time: 'Today',
        read: false,
      });
    }

    // Pending tasks reminder
    const pendingTasks = tasks.filter((task: any) => task.status === 'TODO' || task.status === 'PENDING');
    if (pendingTasks.length >= 5) {
      newNotifications.push({
        id: 'many-pending',
        type: 'info',
        title: 'Tasks Waiting',
        message: `You have ${pendingTasks.length} pending tasks`,
        time: 'Now',
        read: false,
      });
    }

    setNotifications(newNotifications);
  }, [tasks]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const updateAnchor = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setAnchor({
        top: rect.bottom + 12,
        right: window.innerWidth - rect.right,
      });
    };

    updateAnchor();
    window.addEventListener('resize', updateAnchor);
    window.addEventListener('scroll', updateAnchor, true);

    return () => {
      window.removeEventListener('resize', updateAnchor);
      window.removeEventListener('scroll', updateAnchor, true);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl bg-white/80 dark:bg-gray-900/70 border border-gray-200/70 dark:border-gray-700/60 shadow-md hover:shadow-lg transition-all"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1"
          >
            <Badge
              variant="destructive"
              className="h-5 w-5 p-0 flex items-center justify-center text-xs font-bold"
            >
              {unreadCount}
            </Badge>
          </motion.div>
        )}
      </Button>

      {isOpen && anchor && createPortal(
        <AnimatePresence>
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-[9998] bg-black/10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{ top: anchor.top, right: anchor.right }}
              className="fixed w-96 bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-white/60 dark:border-gray-700/60 backdrop-blur-xl z-[9999] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
                <div>
                  <h3 className="font-bold text-lg">Notifications</h3>
                  <p className="text-xs text-muted-foreground">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No notifications yet</p>
                    <p className="text-xs mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-sm">
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="h-2 w-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
