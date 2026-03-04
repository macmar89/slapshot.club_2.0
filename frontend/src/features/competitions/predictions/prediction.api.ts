import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/api-routes';
import { CreatePredictionInput } from './prediction.types';

export const postCreatePrediction = async (values: CreatePredictionInput) => {
  try {
    const response = await api.post(API_ROUTES.PREDICTION.CREATE, values);

    return { success: response.status === 201 };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'UNEXPECTED_ERROR';
    return { success: false, error: errorMessage };
  }
};
