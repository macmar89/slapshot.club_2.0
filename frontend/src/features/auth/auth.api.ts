import { API_ROUTES } from '@/lib/api-routes';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/use-auth-store';
import { LoginInput, RegisterInput } from './auth.schema';

export const handlePostRegister = async (values: RegisterInput) => {
  const { setUser } = useAuthStore.getState();

  try {
    const { data } = await api.post(API_ROUTES.AUTH.REGISTER, values);

    setUser(data.data.user);

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    const errorMessage = ((error as any).response?.data?.message || 'UNEXPECTED_ERROR') as string;

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const handlePostLogin = async (values: LoginInput) => {
  const { setUser } = useAuthStore.getState();

  try {
    const { data } = await api.post(API_ROUTES.AUTH.LOGIN, values);

    setUser(data.data.user);

    return {
      success: true,
    };
  } catch (error) {
    const errorMessage = ((error as any).response?.data?.message || 'UNEXPECTED_ERROR') as string;

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const handleGetMe = async () => {
  const { setUser } = useAuthStore.getState();

  try {
    const { data } = await api.get(API_ROUTES.AUTH.ME);
    setUser(data.data.user);
    return { success: true, user: data.data.user };
  } catch {
    setUser(null);
    return { success: false, message: 'session_expired' };
  }
};

export const handlePostLogout = async () => {
  try {
    await api.post(API_ROUTES.AUTH.LOGOUT);
    return { success: true };
  } catch {
    return { success: false, message: 'logout_failed' };
  } finally {
    useAuthStore.getState().logout();
    window.location.href = '/';
  }
};

export const handleGetCheckAvailability = async (type: 'username' | 'email', value: string) => {
  try {
    const { data } = await api.get(API_ROUTES.AUTH.CHECK_AVAILABILITY, {
      params: { type, value },
    });

    return {
      success: true,
      available: data.data.available,
    };
  } catch (error: unknown) {
    const errorData = (error as any).response?.data;

    if (
      (error as any).response?.status === 409 &&
      (errorData?.message === 'username_already_exists' ||
        errorData?.message === 'email_already_exists')
    ) {
      return {
        success: true,
        available: false,
      };
    }

    if ((error as any).response?.status === 429) {
      return { success: false, status: 429 };
    }
    return { success: false, status: 500 };
  }
};
