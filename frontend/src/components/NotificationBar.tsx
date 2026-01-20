'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
  taskTitle?: string;
}

export function NotificationBar() {
  const { tasks } = useTasks();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    const newNotifications: Notification[] = [];
    const now = new Date();

    // Check for overdue tasks
    const overdueTasks = tasks.filter(task => {
      if (task.status === 'COMPLETED' || !task.dueDate) return false;
      return new Date(task.dueDate) < now;
    });

    if (overdueTasks.length > 0) {
      newNotifications.push({
        id: 'overdue',
        type: 'warning',
        message: `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`,
        taskTitle: overdueTasks[0]?.title,
      });
    }

    // Check for tasks due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dueTodayTasks = tasks.filter(task => {
      if (task.status === 'COMPLETED' || !task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate < tomorrow;
    });

    if (dueTodayTasks.length > 0) {
      newNotifications.push({
        id: 'due-today',
        type: 'warning',
        message: `${dueTodayTasks.length} task${dueTodayTasks.length > 1 ? 's' : ''} due today`,
        taskTitle: dueTodayTasks[0]?.title,
      });
    }

    // Check for pending tasks
    const pendingTasks = tasks.filter((task: any) => task.status === 'TODO' || task.status === 'PENDING');
    if (pendingTasks.length > 5) {
      newNotifications.push({
        id: 'many-pending',
        type: 'info',
        message: `You have ${pendingTasks.length} pending tasks`,
      });
    }

    // Check for completion streak
    const completedToday = tasks.filter(task => {
      if (task.status !== 'COMPLETED' || !task.updatedAt) return false;
      const updatedDate = new Date(task.updatedAt);
      return updatedDate >= today;
    });

    if (completedToday.length >= 3) {
      newNotifications.push({
        id: 'streak',
        type: 'success',
        message: `Great job! You've completed ${completedToday.length} tasks today!`,
      });
    }

    // Filter out dismissed notifications
    const activeNotifications = newNotifications.filter(n => !dismissed.has(n.id));
    setNotifications(activeNotifications);
  }, [tasks, dismissed]);

  const dismissNotification = (id: string) => {
    setDismissed(prev => new Set(prev).add(id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-gradient-to-r from-orange-500/90 to-amber-500/90 text-white border-orange-400/60 shadow-[0_10px_30px_rgba(251,146,60,0.35)]';
      case 'success':
        return 'bg-gradient-to-r from-emerald-500/90 to-green-600/90 text-white border-emerald-400/60 shadow-[0_10px_30px_rgba(16,185,129,0.35)]';
      default:
        return 'bg-gradient-to-r from-blue-500/90 to-indigo-600/90 text-white border-blue-400/60 shadow-[0_10px_30px_rgba(59,130,246,0.35)]';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="space-y-3 mb-6 sticky top-4 z-40">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={`flex items-center gap-4 p-5 rounded-2xl border ${getColors(notification.type)} backdrop-blur-xl ring-1 ring-white/30`}
          >
            <div className="flex-shrink-0">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base">{notification.message}</p>
              {notification.taskTitle && (
                <p className="text-sm opacity-90 truncate mt-1">
                  Including: {notification.taskTitle}
                </p>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => dismissNotification(notification.id)}
              className="flex-shrink-0 h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
