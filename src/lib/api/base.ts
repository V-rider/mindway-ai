
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
    try {
      const query = supabase.from(table as any);
      const { data, error } = await query.select(params?.select || '*');
      if (error) handleApiError(error);
      return data || [];
    } catch (error) {
      console.error(`Table ${table} might not exist:`, error);
      return [];
    }
  },
  
  post: async (table: string, data: any) => {
    try {
      const { data: result, error } = await supabase.from(table as any).insert(data);
      if (error) handleApiError(error);
      return result;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },
  
  put: async (table: string, id: string, data: any) => {
    try {
      const { data: result, error } = await supabase.from(table as any).update(data).eq('id', id);
      if (error) handleApiError(error);
      return result;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  },
  
  delete: async (table: string, id: string) => {
    try {
      const { data, error } = await supabase.from(table as any).delete().eq('id', id);
      if (error) handleApiError(error);
      return data;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  }
};
