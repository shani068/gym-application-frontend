import { useAuth } from '@/contexts/auth-context';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';

export const usePostRequest = <T, U=void>(API_URL: string) => {
  return useMutation<T, AxiosError, U>({
    mutationFn: async (formData) => {
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      return response.data;
    }
  })
}

export const usePutRequest = <T, U=unknown>(API_URL: string) => {
  const { token } = useAuth();

  return useMutation<T, AxiosError, U>({
    mutationFn: async (formData) => {
      const response = await axios.put<T>(API_URL, formData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      return response.data;
    }
  })
}

export const usePostMultiPartRequest = <T, U extends FormData = FormData>(API_URL: string) => {

  return useMutation<T, AxiosError, U>({
    mutationFn: async (formData) => {
      const resposne = await axios.post<T>(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return resposne.data;
    }
  })
}

// export const usePutRequest = <T>(API_URL: string) => {
//   const mutation = useMutation(async ({ id, formData }: { id: string; formData: T }) => {
//     const response = await axios.put(`${API_URL}/${id}`, formData, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   });

//   return mutation;
// };

export const useDeleteRequest = (API_URL: string) => {

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      return response.data;
    }
  })
  // const mutation = useMutation(async (id: number) => {
  //   const response = await axios.delete(`${API_URL}/${id}`, {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   return response.data;
  // });

  // return mutation;
};



export const useGetRequest = <T>(
  API_URL: string,
  queryKey: string,
  params?: { id?: string }
) => {
  const { token } = useAuth();
  
  const id = params?.id;
  const isEnabled = (params ? !!id : true) && !!token;

  const query = useQuery<T, AxiosError>({
    queryKey: [queryKey, id].filter(Boolean),
    queryFn: async ({ queryKey, signal }) => {
      const [, queryId] = queryKey;
      const url = queryId ? `${API_URL}/${queryId}` : API_URL;
      
      const response = await axios.get<T>(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        signal,
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: isEnabled,
  });

  return query;
};

