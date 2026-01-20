import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  TaskQueryInput,
} from '../lib/validation';
import { ApiError } from '../middleware/error.middleware';
import { Prisma } from '@prisma/client';

/**
 * Get all tasks for the authenticated user
 * GET /api/tasks
 */
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const query: TaskQueryInput = taskQuerySchema.parse({
    limit: req.query.limit || '10',
    offset: req.query.offset || '0',
    status: req.query.status || 'all',
    search: req.query.search,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'desc',
    priority: req.query.priority,
  });

  const where: Prisma.TaskWhereInput = {
    userId: req.user.userId,
  };

  if (query.status && query.status !== 'all') {
    where.status = query.status as 'PENDING' | 'COMPLETED';
  }

  if (query.priority) {
    where.priority = query.priority;
  }

  // ✅ FIXED: SQLite-safe search (removed `mode: "insensitive"`)
  if (query.search) {
    where.title = {
      contains: query.search,
    };
  }

  const orderBy: Prisma.TaskOrderByWithRelationInput = {
    [query.sortBy || 'createdAt']: query.sortOrder || 'desc',
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy,
      skip: query.offset || 0,
      take: query.limit || 10,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.task.count({ where }),
  ]);

  const stats = await prisma.task.groupBy({
    by: ['status'],
    where: { userId: req.user.userId },
    _count: true,
  });

  const statsObject = {
    total,
    pending: stats.find((s) => s.status === 'PENDING')?._count || 0,
    completed: stats.find((s) => s.status === 'COMPLETED')?._count || 0,
  };

  res.json({
    success: true,
    data: {
      tasks,
      pagination: {
        total,
        limit: query.limit || 10,
        offset: query.offset || 0,
        hasMore: (query.offset || 0) + (query.limit || 10) < total,
      },
      stats: statsObject,
    },
  });
};

/**
 * Get a single task
 */
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) throw new ApiError(401, 'Unauthorized');

  const task = await prisma.task.findFirst({
    where: { id: req.params.id, userId: req.user.userId },
  });

  if (!task) throw new ApiError(404, 'Task not found');

  res.json({ success: true, data: { task } });
};

/**
 * Create task
 */
export const createTask = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) throw new ApiError(401, 'Unauthorized');

  const data = createTaskSchema.parse(req.body);

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority || 'MEDIUM',
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      userId: req.user.userId,
    },
  });

  res.status(201).json({ success: true, data: { task } });
};

/**
 * Update task
 */
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) throw new ApiError(401, 'Unauthorized');

  const existing = await prisma.task.findFirst({
    where: { id: req.params.id, userId: req.user.userId },
  });

  if (!existing) throw new ApiError(404, 'Task not found');

  const data = updateTaskSchema.parse(req.body);

  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status && { status: data.status }),
      ...(data.priority && { priority: data.priority }),
      ...(data.dueDate !== undefined && {
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      }),
    },
  });

  res.json({ success: true, data: { task } });
};

/**
 * Delete task
 */
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) throw new ApiError(401, 'Unauthorized');

  const existing = await prisma.task.findFirst({
    where: { id: req.params.id, userId: req.user.userId },
  });

  if (!existing) throw new ApiError(404, 'Task not found');

  await prisma.task.delete({ where: { id: req.params.id } });

  res.json({ success: true, message: 'Task deleted successfully' });
};

/**
 * Toggle task status
 */
export const toggleTaskStatus = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) throw new ApiError(401, 'Unauthorized');

  const task = await prisma.task.findFirst({
    where: { id: req.params.id, userId: req.user.userId },
  });

  if (!task) throw new ApiError(404, 'Task not found');

  const updated = await prisma.task.update({
    where: { id: req.params.id },
    data: { status: task.status === 'PENDING' ? 'COMPLETED' : 'PENDING' },
  });

  res.json({ success: true, data: { updated } });
};
