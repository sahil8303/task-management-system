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
 * Query params: limit, offset, status, search, sortBy, sortOrder, priority
 */
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  // Validate and parse query parameters
  const query: TaskQueryInput = taskQuerySchema.parse({
    limit: req.query.limit || '10',
    offset: req.query.offset || '0',
    status: req.query.status || 'all',
    search: req.query.search,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'desc',
    priority: req.query.priority,
  });

  // Build where clause
  const where: Prisma.TaskWhereInput = {
    userId: req.user.userId,
  };

  // Filter by status
  if (query.status && query.status !== 'all') {
    where.status = query.status as 'PENDING' | 'COMPLETED';
  }

  // Filter by priority
  if (query.priority) {
    where.priority = query.priority;
  }

  // Search by title
  if (query.search) {
    where.title = {
      contains: query.search,
      mode: 'insensitive',
    };
  }

  // Build orderBy clause
  const orderBy: Prisma.TaskOrderByWithRelationInput = {
    [query.sortBy || 'createdAt']: query.sortOrder || 'desc',
  };

  // Get tasks with pagination
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

  // Calculate stats
  const stats = await prisma.task.groupBy({
    by: ['status'],
    where: { userId: req.user.userId },
    _count: true,
  });

  const statsObject = {
    total: total,
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
 * Get a single task by ID
 * GET /api/tasks/:id
 */
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id } = req.params;

  const task = await prisma.task.findFirst({
    where: {
      id,
      userId: req.user.userId,
    },
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
  });

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  res.json({
    success: true,
    data: { task },
  });
};

/**
 * Create a new task
 * POST /api/tasks
 */
export const createTask = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  // Validate request body
  const validatedData = createTaskSchema.parse(req.body);

  // Create task
  const task = await prisma.task.create({
    data: {
      title: validatedData.title,
      description: validatedData.description,
      priority: validatedData.priority || 'MEDIUM',
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      userId: req.user.userId,
    },
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
  });

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: { task },
  });
};

/**
 * Update a task
 * PATCH /api/tasks/:id
 */
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id } = req.params;

  // Check if task exists and belongs to user
  const existingTask = await prisma.task.findFirst({
    where: {
      id,
      userId: req.user.userId,
    },
  });

  if (!existingTask) {
    throw new ApiError(404, 'Task not found');
  }

  // Validate request body
  const validatedData = updateTaskSchema.parse(req.body);

  // Update task
  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(validatedData.title && { title: validatedData.title }),
      ...(validatedData.description !== undefined && { description: validatedData.description }),
      ...(validatedData.status && { status: validatedData.status }),
      ...(validatedData.priority && { priority: validatedData.priority }),
      ...(validatedData.dueDate !== undefined && {
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      }),
    },
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
  });

  res.json({
    success: true,
    message: 'Task updated successfully',
    data: { task },
  });
};

/**
 * Delete a task
 * DELETE /api/tasks/:id
 */
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id } = req.params;

  // Check if task exists and belongs to user
  const existingTask = await prisma.task.findFirst({
    where: {
      id,
      userId: req.user.userId,
    },
  });

  if (!existingTask) {
    throw new ApiError(404, 'Task not found');
  }

  // Delete task
  await prisma.task.delete({
    where: { id },
  });

  res.json({
    success: true,
    message: 'Task deleted successfully',
  });
};

/**
 * Toggle task status (PENDING <-> COMPLETED)
 * PATCH /api/tasks/:id/toggle
 */
export const toggleTaskStatus = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id } = req.params;

  // Check if task exists and belongs to user
  const existingTask = await prisma.task.findFirst({
    where: {
      id,
      userId: req.user.userId,
    },
  });

  if (!existingTask) {
    throw new ApiError(404, 'Task not found');
  }

  // Toggle status
  const newStatus = existingTask.status === 'PENDING' ? 'COMPLETED' : 'PENDING';

  const task = await prisma.task.update({
    where: { id },
    data: { status: newStatus },
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
  });

  res.json({
    success: true,
    message: 'Task status toggled successfully',
    data: { task },
  });
};
