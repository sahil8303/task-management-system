'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      await registerUser(data.email, data.password, data.name);
    } catch (error) {
      // Error handled by useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await trigger('name');
      if (isValid) setStep(2);
    } else if (step === 2) {
      const isValid = await trigger('email');
      if (isValid) setStep(3);
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
        <svg className="absolute right-8 top-20 h-48 w-48 opacity-40 dark:opacity-30" viewBox="0 0 200 200" fill="none">
          <rect x="30" y="30" width="46" height="46" rx="10" stroke="currentColor" className="text-indigo-400" strokeWidth="2" />
          <path d="M50 130c18-26 54-26 72 0" stroke="currentColor" className="text-emerald-400" strokeWidth="2" />
          <circle cx="140" cy="120" r="24" stroke="currentColor" className="text-purple-400" strokeWidth="2" />
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
            “Start small. Finish strong.”
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Your plan begins today</p>
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
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-base text-gray-500 dark:text-gray-400">
              Step {step} of 3 - Let's get you started
            </CardDescription>
            
            {/* Progress indicator */}
            <div className="flex gap-2 mt-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    i <= step
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
            <div className="mx-auto mt-2 inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1 text-xs text-gray-600 dark:text-gray-300">
              Build habits, not just tasks
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10"
                        {...register('name')}
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
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
                        autoFocus
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
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
                          autoFocus
                        />
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-500">{errors.password.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          {...register('confirmPassword')}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-2">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
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

function AnimatePresence({ children, mode }: { children: React.ReactNode; mode?: string }) {
  return <>{children}</>;
}
