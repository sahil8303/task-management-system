import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/lib/api';
import { useToastStore } from '@/store/toast.store';
import { useRouter } from 'next/navigation';

/**
 * Custom hook for authentication operations
 */
export function useAuth() {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const { addToast } = useToastStore();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      const { accessToken, user: userData } = response.data.data;
      
      setAuth(userData, accessToken);
      addToast('success', 'Login successful');
      router.push('/dashboard');
    } catch (error: unknown) {
      const message = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed'
        : 'Login failed';
      addToast('error', message);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      await authApi.register({ email, password, name });
      addToast('success', 'Registration successful! Please login.');
      router.push('/login');
    } catch (error: unknown) {
      const message = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Registration failed'
        : 'Registration failed';
      addToast('error', message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      clearAuth();
      addToast('success', 'Logged out successfully');
      router.push('/login');
    } catch (error) {
      // Clear auth even if API call fails
      clearAuth();
      router.push('/login');
    }
  };

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  };
}
