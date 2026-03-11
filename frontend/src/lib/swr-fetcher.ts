import { api } from './api';

export const swrFetcher = async (url: string) => {
  try {
    const res = await api.get(url);
    return res.data.data;
  } catch (error: any) {
    if (error.response) {
      error.status = error.response.status;
      error.info = error.response.data;
    }
    throw error;
  }
};
