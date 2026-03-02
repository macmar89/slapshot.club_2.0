import { API_ROUTES } from '@/lib/api-routes';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { LoginInput } from './auth.schema';

export const handlePostLogin = async (values: LoginInput) => {
  const { setUser } = useAuthStore.getState();

  try {
    const { data } = await api.post(API_ROUTES.AUTH.LOGIN, values);

    setUser(data);

    return {
      success: true,
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'UNEXPECTED_ERROR';

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const handlePostLogout = async () => {
  try {
    await api.post(API_ROUTES.AUTH.LOGOUT);
    return { success: true };
  } catch (error) {
    return { success: false, message: 'logout_failed' };
  } finally {
    useAuthStore.getState().logout();
    window.location.href = '/';
  }
};
