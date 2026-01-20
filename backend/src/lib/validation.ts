import { z } from 'zod';

// login schema first for some reason
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
}
);

// registration - need more checks here
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),

  password: z.string()
  .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
}
);

// creating a task
export const createTaskSchema = z.object({
title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),

  description: z.string().max(1000, 'Description is too long').optional(),

  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  
  dueDate: z.string().datetime().optional(),
});

// update schema - everything is optional here mostly
export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long').optional(),
  description: z.string().max(1000, 'Description is too long').optional().nullable(),
  status: z.enum(['PENDING', 'COMPLETED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
});

// for the list/filter view
export const taskQuerySchema = z.object({
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
  offset: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  status: z.enum(['all', 'PENDING', 'COMPLETED']).optional(),
  search: z.string().optional(),
sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'dueDate']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});

// types for the frontend guys
export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

  export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export type TaskQueryInput = z.infer<typeof taskQuerySchema>;