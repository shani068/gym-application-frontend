import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios, { AxiosRequestConfig } from 'axios';
import { useToast } from './useToast';

// Define supported HTTP methods
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Define options for API requests
interface UseHttpClientOptions {
  url: string;
  method: RequestMethod;
  data?: any;
  config?: AxiosRequestConfig;
  cacheKey?: string; // For caching GET requests
}

// Hook to manage API requests
export const useApiRequest = <TResponse = any, TError = any>() => {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();

  // Perform an API request
  const performRequest = async ({ url, method, data, config }: UseHttpClientOptions): Promise<TResponse> => {
    try {
      const response = await axios({ url, method, data, ...config });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  };

  // Simplified GET hook
  const useGet = (url: string, cacheKey: string, config?: AxiosRequestConfig) => {
    return useQuery<TResponse, TError>(
      cacheKey,
      () => performRequest({ url, method: 'GET', config }),
      {
        onSuccess: () => toastSuccess('Data fetched successfully'),
        onError: (error: TError) => toastError(`Error: ${error}`),
        staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
      }
    );
  };

  // Simplified mutation hook
  const useMutationRequest = (
    method: RequestMethod,
    options?: {
      onSuccess?: (data: TResponse) => void;
      onError?: (error: TError) => void;
      invalidateCacheKeys?: string[]; // Cache keys to invalidate
    }
  ) => {
    return useMutation<TResponse, TError, UseHttpClientOptions>(
      ({ url, data, config }: UseHttpClientOptions) => performRequest({ url, method, data, config }),
      {
        onSuccess: (data, variables) => {
          options?.onSuccess?.(data);
          if (method !== 'GET' && options?.invalidateCacheKeys) {
            options.invalidateCacheKeys.forEach((key) => queryClient.invalidateQueries(key));
          }
          toastSuccess(`${method} request was successful`);
        },
        onError: (error) => {
          options?.onError?.(error);
          toastError(`Error: ${error}`);
        },
      }
    );
  };

  return {
    useGet,
    usePost: (options?: Parameters<typeof useMutationRequest>[1]) => useMutationRequest('POST', options),
    usePut: (options?: Parameters<typeof useMutationRequest>[1]) => useMutationRequest('PUT', options),
    useDelete: (options?: Parameters<typeof useMutationRequest>[1]) => useMutationRequest('DELETE', options),
  };
};