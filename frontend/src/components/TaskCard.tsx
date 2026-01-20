'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Calendar, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTasks, Task } from '@/hooks/useTasks';
import { formatDate, formatDateTime, isOverdue, cn } from '@/lib/utils';
import { EditTaskModal } from '@/components/EditTaskModal';
import { DeleteTaskDialog } from '@/components/DeleteTaskDialog';

interface TaskCardProps {
  task: Task;
  index: number;
}

export function TaskCard({ task, index }: TaskCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toggleTask } = useTasks();

  const handleToggle = () => {
    toggleTask(task.id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'destructive';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const isDue = task.dueDate && isOverdue(task.dueDate) && task.status === 'PENDING';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card className={cn(
          "hover:shadow-lg transition-shadow",
          task.status === 'COMPLETED' && "opacity-75",
          isDue && "border-red-500"
        )}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <Checkbox
                checked={task.status === 'COMPLETED'}
                onCheckedChange={handleToggle}
                className="mt-1"
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "font-semibold text-lg mb-1",
                    task.status === 'COMPLETED' && "line-through text-gray-500"
                  )}
                >
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {task.description}
                  </p>
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  
                  <Badge variant={task.status === 'COMPLETED' ? 'success' : 'default'}>
                    {task.status}
                  </Badge>

                  {task.dueDate && (
                    <Badge variant={isDue ? 'destructive' : 'outline'} className="gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(task.dueDate)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>

          <CardFooter className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500">
            Created: {formatDateTime(task.createdAt)}
          </CardFooter>
        </Card>
      </motion.div>

      {/* Modals */}
      <EditTaskModal
        task={task}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <DeleteTaskDialog
        task={task}
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </>
  );
}
