'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Loader2, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setFormError(null);
      await login(data.email, data.password);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Invalid email or password'
        : 'Invalid email or password';
      setFormError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 dark:from-gray-950 dark:via-slate-950 dark:to-gray-900 p-6 overflow-hidden">
      {/* Subtle 2D Graphic Background */}
      <div className="absolute inset-0">
        <div className="absolute top-12 left-10 h-60 w-60 rounded-[36px] bg-indigo-200/30 dark:bg-indigo-900/20 blur-3xl" />
        <div className="absolute bottom-16 right-12 h-72 w-72 rounded-full bg-emerald-200/25 dark:bg-emerald-900/20 blur-3xl" />
        <div className="absolute top-1/3 right-1/3 h-40 w-40 rounded-2xl bg-purple-200/25 dark:bg-purple-900/20 blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_50%,#000,transparent)]" />

        {/* Minimal illustrative SVG shapes */}
        <svg className="absolute left-8 top-24 h-48 w-48 opacity-40 dark:opacity-30" viewBox="0 0 200 200" fill="none">
          <circle cx="60" cy="60" r="26" stroke="currentColor" className="text-indigo-400" strokeWidth="2" />
          <path d="M30 130c20-28 60-28 80 0" stroke="currentColor" className="text-emerald-400" strokeWidth="2" />
          <rect x="110" y="110" width="40" height="40" rx="8" stroke="currentColor" className="text-purple-400" strokeWidth="2" />
        </svg>
      </div>

      {/* Motivational Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-8 right-8 hidden md:block"
      >
        <div className="backdrop-blur-xl bg-white/75 dark:bg-gray-900/60 border border-white/60 dark:border-gray-800/60 rounded-2xl px-5 py-3 shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            “Consistency builds strength.”
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Complete one task at a time</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="backdrop-blur-xl bg-white/85 dark:bg-gray-900/80 border border-white/70 dark:border-gray-800/70 shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center text-gray-900 dark:text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-base text-gray-500 dark:text-gray-400">
              Focus. Plan. Finish.
            </CardDescription>
            <div className="mx-auto mt-2 inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1 text-xs text-gray-600 dark:text-gray-300">
              Momentum mode: on
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    {...register('email')}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    {...register('password')}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
                  {formError}
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          © 2026 Task Management System. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
