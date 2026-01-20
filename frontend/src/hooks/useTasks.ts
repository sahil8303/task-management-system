import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '@/lib/api';
import { useToastStore } from '@/store/toast.store';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'PENDING' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TasksResponse {
  success: boolean;
  data: {
    tasks: Task[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
    stats: {
      total: number;
      pending: number;
      completed: number;
    };
  };
}

interface TaskQueryParams {
  limit?: number;
  offset?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  priority?: string;
}

/**
 * Custom hook for task operations with React Query
 */
export function useTasks(params: TaskQueryParams = {}) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  // Fetch tasks
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<TasksResponse>({
    queryKey: ['tasks', params],
    queryFn: async () => {
      const response = await taskApi.getTasks(params);
      return response.data;
    },
  });

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      addToast('success', 'Task created successfully');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create task'
        : 'Failed to create task';
      addToast('error', message);
    },
  });

  // Update task mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      taskApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      addToast('success', 'Task updated successfully');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update task'
        : 'Failed to update task';
      addToast('error', message);
    },
  });

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      addToast('success', 'Task deleted successfully');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to delete task'
        : 'Failed to delete task';
      addToast('error', message);
    },
  });

  // Toggle task mutation with optimistic update
  const toggleMutation = useMutation({
    mutationFn: taskApi.toggleTask,
    onMutate: async (taskId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(['tasks', params]);

      // Optimistically update
      queryClient.setQueryData(['tasks', params], (old: TasksResponse | undefined) => {
        if (!old) return old;
        
        return {
          ...old,
          data: {
            ...old.data,
            tasks: old.data.tasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    status: task.status === 'PENDING' ? 'COMPLETED' : 'PENDING',
                  }
                : task
            ),
          },
        };
      });

      return { previousTasks };
    },
    onError: (_error, _taskId, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', params], context.previousTasks);
      }
      addToast('error', 'Failed to toggle task status');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks: data?.data.tasks || [],
    pagination: data?.data.pagination,
    stats: data?.data.stats,
    isLoading,
    error,
    refetch,
    createTask: createMutation.mutate,
    updateTask: updateMutation.mutate,
    deleteTask: deleteMutation.mutate,
    toggleTask: toggleMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: toggleMutation.isPending,
  };
}
