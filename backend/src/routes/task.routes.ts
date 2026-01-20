import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from '../controllers/task.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Async handler wrapper to catch errors - stole this from a tutorial lol
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
Promise.resolve(fn(req, res, next)).catch(next);
};

// All task routes require auth
router.use(authMiddleware);

// Task CRUD
router.get('/', asyncHandler(getTasks));
router.post('/', asyncHandler(createTask));

router.get('/:id', asyncHandler(getTaskById));
  router.patch('/:id', asyncHandler(updateTask));
router.delete('/:id', asyncHandler(deleteTask));

// Toggle task status 
router.patch('/:id/toggle', asyncHandler(toggleTaskStatus));


export default router;