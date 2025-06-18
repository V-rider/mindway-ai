
import { supabase } from '@/integrations/supabase/client';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  throw new ApiError(error.message || 'An unexpected error occurred', error.status);
};

export const apiClient = {
  get: async (table: string, params?: any) => {
    const { data, error } = await supabase.from(table).select(params?.select || '*');
    if (error) handleApiError(error);
    return data;
  },
  
  post: async (table: string, data: any) => {
    const { data: result, error } = await supabase.from(table).insert(data);
    if (error) handleApiError(error);
    return result;
  },
  
  put: async (table: string, id: string, data: any) => {
    const { data: result, error } = await supabase.from(table).update(data).eq('id', id);
    if (error) handleApiError(error);
    return result;
  },
  
  delete: async (table: string, id: string) => {
    const { data, error } = await supabase.from(table).delete().eq('id', id);
    if (error) handleApiError(error);
    return data;
  }
};
