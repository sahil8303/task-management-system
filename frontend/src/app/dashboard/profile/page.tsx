'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getInitials } from '@/lib/utils';
import { User, Mail, Calendar, Shield, Edit2, Save, X, TrendingUp, Award, Target } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { tasks } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');

  if (!user) return null;

  const completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED').length;
  const pendingTasks = tasks.filter((t: any) => t.status === 'TODO').length;
  const inProgressTasks = tasks.filter((t: any) => t.status === 'IN_PROGRESS').length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  
  // Format join date properly
  const joinDate = (user as any).createdAt
    ? new Date((user as any).createdAt).toLocaleDateString('en-GB')
    : 'Recently';
  
  const memberSince = joinDate;

  return (
    <div className="relative min-h-screen">
      {/* 3D Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-indigo-950" />
        
        {/* Floating 3D orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"
        />
        
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"
        />
        
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute bottom-20 left-1/3 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]" />
      </div>

      <div className="relative space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-muted-foreground mt-2">Manage your account and view your achievements</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-2"
        >
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border-2 shadow-2xl">
            <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
              <CardTitle className="text-2xl">Personal Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="flex items-center gap-6">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Avatar className="h-32 w-32 border-4 border-white shadow-2xl ring-4 ring-indigo-200 dark:ring-indigo-800">
                    <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="max-w-md"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => setIsEditing(false)}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditedName(user.name);
                          setIsEditing(false);
                        }}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {user.name}
                        </h2>
                        <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-muted-foreground text-lg">Member since {memberSince}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4">
                <motion.div 
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 shadow-lg"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                    <p className="font-semibold text-lg">{user.email}</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 shadow-lg"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Joined</p>
                    <p className="font-semibold text-lg">{joinDate}</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 shadow-lg"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                    <p className="font-semibold text-lg text-green-600 dark:text-green-400 flex items-center gap-2">
                      <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                      Active
                    </p>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Card with Circular Graph */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border-2 shadow-2xl">
            <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Statistics
              </CardTitle>
              <CardDescription>Your task completion data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Line Graph showing task progress */}
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-full">
                  <p className="text-sm text-muted-foreground mb-4 text-center">Task Completion Progress</p>
                  
                  {/* Simple Line Graph */}
                  <div className="relative h-48 w-full">
                    <svg className="w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="37.5" x2="300" y2="37.5" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-gray-700" opacity="0.5" />
                      <line x1="0" y1="75" x2="300" y2="75" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-gray-700" opacity="0.5" />
                      <line x1="0" y1="112.5" x2="300" y2="112.5" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-gray-700" opacity="0.5" />
                      
                      {/* Gradient fill */}
                      <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      
                      {/* Area fill */}
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        d={`M 0 150 L 0 ${150 - (completionRate * 1.2)} L 50 ${150 - (Math.min(completionRate + 10, 100) * 1.2)} L 100 ${150 - (Math.min(completionRate + 5, 100) * 1.2)} L 150 ${150 - (completionRate * 1.2)} L 200 ${150 - (Math.min(completionRate + 15, 100) * 1.2)} L 250 ${150 - (Math.min(completionRate + 8, 100) * 1.2)} L 300 ${150 - (completionRate * 1.2)} L 300 150 Z`}
                        fill="url(#areaGradient)"
                      />
                      
                      {/* Line */}
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                        d={`M 0 ${150 - (completionRate * 1.2)} L 50 ${150 - (Math.min(completionRate + 10, 100) * 1.2)} L 100 ${150 - (Math.min(completionRate + 5, 100) * 1.2)} L 150 ${150 - (completionRate * 1.2)} L 200 ${150 - (Math.min(completionRate + 15, 100) * 1.2)} L 250 ${150 - (Math.min(completionRate + 8, 100) * 1.2)} L 300 ${150 - (completionRate * 1.2)}`}
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="50%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                      
                      {/* Data points */}
                      {[0, 50, 100, 150, 200, 250, 300].map((x, i) => {
                        const yValues = [
                          completionRate * 1.2,
                          Math.min(completionRate + 10, 100) * 1.2,
                          Math.min(completionRate + 5, 100) * 1.2,
                          completionRate * 1.2,
                          Math.min(completionRate + 15, 100) * 1.2,
                          Math.min(completionRate + 8, 100) * 1.2,
                          completionRate * 1.2
                        ];
                        return (
                          <motion.circle
                            key={x}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                            cx={x}
                            cy={150 - yValues[i]}
                            r="4"
                            fill="white"
                            stroke="#8b5cf6"
                            strokeWidth="2"
                          />
                        );
                      })}
                    </svg>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                      <span className="text-muted-foreground">Progress Trend</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {completionRate}%
                      </div>
                      <span className="text-muted-foreground">Current</span>
                    </div>
                  </div>
                </div>

                {/* Achievement Badge */}
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.8, type: "spring" }}
                  className="mt-6 flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-2 border-yellow-300 dark:border-yellow-700 shadow-lg"
                >
                  <Award className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Achievement</p>
                    <p className="font-bold text-lg">
                      {completionRate >= 80 ? (
                        <span className="text-yellow-600">🏆 Gold Level</span>
                      ) : completionRate >= 50 ? (
                        <span className="text-gray-600">🥈 Silver Level</span>
                      ) : (
                        <span className="text-amber-700">🥉 Bronze Level</span>
                      )}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Task Stats Bars */}
              <div className="space-y-4 pt-4 border-t">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Completed</span>
                    <span className="text-sm font-bold">{completedTasks}</span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: tasks.length > 0 ? `${(completedTasks / tasks.length) * 100}%` : "0%" }}
                      transition={{ duration: 1, delay: 1.2 }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">In Progress</span>
                    <span className="text-sm font-bold">{inProgressTasks}</span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: tasks.length > 0 ? `${(inProgressTasks / tasks.length) * 100}%` : "0%" }}
                      transition={{ duration: 1, delay: 1.3 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Pending</span>
                    <span className="text-sm font-bold">{pendingTasks}</span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: tasks.length > 0 ? `${(pendingTasks / tasks.length) * 100}%` : "0%" }}
                      transition={{ duration: 1, delay: 1.4 }}
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                    />
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border-2 shadow-2xl overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Activity Overview
            </CardTitle>
            <CardDescription>Your productivity metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-3">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative overflow-hidden p-6 rounded-2xl border-2 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="relative">
                  <div className="text-4xl font-black text-white mb-2">{tasks.length}</div>
                  <p className="text-sm text-blue-100 font-medium">Total Tasks Created</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative overflow-hidden p-6 rounded-2xl border-2 bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="relative">
                  <div className="text-4xl font-black text-white mb-2">{completedTasks}</div>
                  <p className="text-sm text-green-100 font-medium">Tasks Completed</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative overflow-hidden p-6 rounded-2xl border-2 bg-gradient-to-br from-purple-500 to-pink-600 shadow-xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="relative">
                  <div className="text-4xl font-black text-white mb-2">{completionRate}%</div>
                  <p className="text-sm text-purple-100 font-medium">Success Rate</p>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      </div>
    </div>
  );
}
