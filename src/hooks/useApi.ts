
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useApi = () => {
  const queryClient = useQueryClient();

  const createQuery = <T>(
    queryKey: string[],
    queryFn: () => Promise<T>,
    options?: any
  ) => {
    return useQuery({
      queryKey,
      queryFn,
      ...options
    });
  };

  const createMutation = <T, V>(
    mutationFn: (variables: V) => Promise<T>,
    options?: {
      onSuccess?: (data: T) => void;
      onError?: (error: Error) => void;
      invalidateQueries?: string[][];
    }
  ) => {
    return useMutation({
      mutationFn,
      onSuccess: (data) => {
        if (options?.invalidateQueries) {
          options.invalidateQueries.forEach(queryKey => {
            queryClient.invalidateQueries({ queryKey });
          });
        }
        options?.onSuccess?.(data);
        toast.success('Operation completed successfully');
      },
      onError: (error) => {
        options?.onError?.(error);
        toast.error(error.message || 'An error occurred');
      }
    });
  };

  return { createQuery, createMutation };
};
