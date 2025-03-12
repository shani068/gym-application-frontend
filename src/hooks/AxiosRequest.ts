import { useAuth } from '@/contexts/auth-context';
import axios, { AxiosRequestConfig } from 'axios';
import { useMutation, useQuery } from 'react-query';


export const usePostRequest = <T>(API_URL: string) => {
  const mutation = useMutation(async (formData: T) => {
    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "application/json"
      }
    })

    return response.data;
  });

  return mutation;
}

export const usePutRequest = <T>(API_URL: string) => {
  const { token } = useAuth();

  const mutation = useMutation(async (formData: T) => {
    const response = await axios.put(API_URL, formData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })

    return response.data;
  });

  return mutation;
}

export const usePostMultiPartRequest = <T>(API_URL: string) => {
  const mutation = useMutation(async (formData: T) => {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data;
  });

  return mutation;
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
  const mutation = useMutation(async (id: number) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  });

  return mutation;
};

export const useGetRequest = <T>(
  API_URL: string,
  queryKey: string,
  params?: Record<string, any>
) => {
  // Build the final URL:
  // If an id is provided in params, append it to the API_URL; otherwise, use the API_URL as-is.
  const finalUrl = params?.id ? `${API_URL}${params.id}` : API_URL;
  const {token} = useAuth();
  console.log("get token", token)
  // Determine if the query should be enabled:
  // - If params is provided and contains an id, then enabled is true.
  // - If no params are provided, then enabled should also be true.
  const isEnabled =( params ? !!params.id : true) && !!token;

  const query = useQuery<T>(
    params?.id ? [queryKey, params.id] : [queryKey], // Unique query key
    async () => {
      const response = await axios.get(finalUrl, {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
         },
      });
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      enabled: isEnabled,
    }
  );

  return query;
};

