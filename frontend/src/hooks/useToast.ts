import { useToastStore } from '@/store/toast.store';

type ToastType = 'success' | 'error' | 'info';

/**
 * Custom hook for toast notifications
 */
export function useToast() {
  const { addToast } = useToastStore();

  const toast = {
    success: (message: string) => addToast('success', message),
    error: (message: string) => addToast('error', message),
    info: (message: string) => addToast('info', message),
  };

  return toast;
}
