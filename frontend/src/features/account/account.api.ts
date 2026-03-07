import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/api-routes';

export const updateUsernameAction = async (username: string) => {
  try {
    const { data } = await api.patch(API_ROUTES.USER.UPDATE_USERNAME, { username });
    return { ok: true, data: data.data };
  } catch (error: unknown) {
    const errorMessage =
      (error as any).response?.data?.message || (error as any).message || 'UNEXPECTED_ERROR';
    return {
      ok: false,
      error: errorMessage,
    };
  }
};

export const updatePasswordAction = async (oldPassword: string, newPassword: string) => {
  try {
    const { data } = await api.post(API_ROUTES.USER.CHANGE_PASSWORD, {
      oldPassword,
      newPassword,
    });
    return { ok: true, data: data.data };
  } catch (error: unknown) {
    const errorMessage =
      (error as any).response?.data?.message || (error as any).message || 'UNEXPECTED_ERROR';
    return {
      ok: false,
      error: errorMessage,
    };
  }
};

export const requestEmailChangeAction = async (newEmail: string, message: string) => {
  try {
    const fullMessage = `Request for email change to: ${newEmail}\n\nReason: ${message}`;
    const { data } = await api.post(API_ROUTES.USER.EMAIL_CHANGE_REQUEST, {
      message: fullMessage,
    });
    return { ok: true, data: data.data };
  } catch (error: unknown) {
    const errorMessage =
      (error as any).response?.data?.message || (error as any).message || 'UNEXPECTED_ERROR';
    return {
      ok: false,
      error: errorMessage,
    };
  }
};
