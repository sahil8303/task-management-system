'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Download, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTasks } from '@/hooks/useTasks';
import { useDebounce } from '@/hooks/useDebounce';
import { CreateTaskModal } from '@/components/CreateTaskModal';
import { TaskCard } from '@/components/TaskCard';
import { TaskCardSkeleton } from '@/components/TaskCardSkeleton';
import { NotificationBar } from '@/components/NotificationBar';
import { exportToCSV, exportToJSON } from '@/lib/utils';

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const debouncedSearch = useDebounce(search, 300);

  const { tasks, stats, isLoading, refetch } = useTasks({
    search: debouncedSearch,
    status: statusFilter,
    priority: priorityFilter,
    limit: 50,
  });

  const handleExportCSV = () => {
    exportToCSV(tasks, `tasks-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportJSON = () => {
    exportToJSON(tasks, `tasks-${new Date().toISOString().split('T')[0]}.json`);
  };

  return (
    <div className="relative">
      {/* 3D Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950" />
        
        {/* 3D Floating Shapes */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotateZ: [0, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 transform-gpu"
          style={{ transform: 'perspective(1000px) rotateX(25deg)' }}
        />
        
        <motion.div
          animate={{
            x: [0, -120, 0],
            y: [0, 80, 0],
            rotateZ: [0, -180, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/3 right-20 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 transform-gpu"
          style={{ transform: 'perspective(1000px) rotateY(45deg)' }}
        />
        
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
            rotateZ: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute bottom-32 left-1/3 w-80 h-80 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-2xl mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 transform-gpu"
          style={{ transform: 'perspective(1000px) rotateX(-25deg)' }}
        />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)] opacity-30" />
        
        {/* Motivational Quote Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-8 right-8 max-w-md"
        >
          <div className="backdrop-blur-xl bg-white/30 dark:bg-gray-800/30 rounded-2xl p-6 border border-white/40 dark:border-gray-700/40 shadow-2xl">
            <p className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent italic">
              "The secret of getting ahead is getting started."
            </p>
            <p className="text-sm text-muted-foreground mt-2">- Mark Twain</p>
          </div>
        </motion.div>
      </div>

      <div className="space-y-6 relative z-10">
      {/* Notification Bar */}
      <NotificationBar />

      {/* Motivational Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-2xl bg-white/70 dark:bg-gray-900/70 border border-white/50 dark:border-gray-800/60 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Make today count.
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              You have <span className="font-semibold text-indigo-600">{stats?.pending || 0}</span> pending tasks and <span className="font-semibold text-emerald-600">{stats?.completed || 0}</span> completed.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-indigo-600 text-white text-sm shadow-lg">
              Stay Focused
            </div>
            <div className="px-4 py-2 rounded-full bg-emerald-500 text-white text-sm shadow-lg">
              Keep Momentum
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.03, y: -5 }}
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-2xl backdrop-blur transform-gpu hover:shadow-blue-500/50 transition-shadow">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Tasks</p>
                  <p className="text-3xl font-bold mt-2">{stats?.total || 0}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur">
                  <Circle className="h-8 w-8" />
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.03, y: -5 }}
        >
          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-2xl backdrop-blur transform-gpu hover:shadow-orange-500/50 transition-shadow">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold mt-2">{stats?.pending || 0}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.03, y: -5 }}
        >
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-2xl backdrop-blur transform-gpu hover:shadow-emerald-500/50 transition-shadow">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold mt-2">{stats?.completed || 0}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions Bar */}
      <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border-2 border-white/50 dark:border-gray-700/50 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'PENDING' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('PENDING')}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === 'COMPLETED' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('COMPLETED')}
              >
                Completed
              </Button>
            </div>

            {/* Priority Filter */}
            <div className="flex gap-2">
              <Button
                variant={!priorityFilter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPriorityFilter(undefined)}
              >
                <Filter className="h-4 w-4 mr-2" />
                All Priority
              </Button>
              <Button
                variant={priorityFilter === 'HIGH' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setPriorityFilter(priorityFilter === 'HIGH' ? undefined : 'HIGH')}
              >
                High
              </Button>
              <Button
                variant={priorityFilter === 'MEDIUM' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setPriorityFilter(priorityFilter === 'MEDIUM' ? undefined : 'MEDIUM')}
              >
                Medium
              </Button>
              <Button
                variant={priorityFilter === 'LOW' ? 'outline' : 'outline'}
                size="sm"
                onClick={() => setPriorityFilter(priorityFilter === 'LOW' ? undefined : 'LOW')}
              >
                Low
              </Button>
            </div>

            {/* Export */}
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportJSON}>
              <Download className="h-4 w-4 mr-2" />
              JSON
            </Button>

            {/* Create Task */}
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </>
        ) : tasks.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-12">
              <div className="text-center">
                <Circle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                <p className="text-gray-500 mb-4">
                  {search || statusFilter !== 'all' || priorityFilter
                    ? 'Try adjusting your filters'
                    : 'Get started by creating your first task'}
                </p>
                {!search && statusFilter === 'all' && !priorityFilter && (
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                )}
              </div>
            </Card>
          </div>
        ) : (
          <>
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
          </>
        )}
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refetch}
      />
      </div>
    </div>
  );
}
