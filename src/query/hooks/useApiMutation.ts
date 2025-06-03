import type { AxiosRequestConfig } from "axios"
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult
} from "@tanstack/react-query"
import axiosInstance from "../axios.instance"
import { useSession } from "next-auth/react"

/**
 * Example:
 *   const loginQuery = useApiMutation<User, { email: string; password: string }>(
      '/auth/login',
      'post',
      {
        onSuccess: data => {
          console.log(data);
        },
      },
    );
  *
  * loginQuery.mutate({ email: 'john@doe.com', password: 'pwd' })
 */

export const useApiMutation = <
  TData = unknown,
  TVariables = unknown,
  TError = unknown
>(
  url: string,
  method: "delete" | "post" | "put" | "patch" = "post",
  options: UseMutationOptions<TData, TError, TVariables> = {},
  axiosConfiguration: Partial<AxiosRequestConfig> = {}
): UseMutationResult<TData, TError, TVariables> => {
  const { data: session } = useSession()
  const config: AxiosRequestConfig | undefined = axiosConfiguration

  return useMutation<TData, TError, TVariables>({
    retry: 0,
    mutationFn: async data => {
      return await axiosInstance
        .request({
          url,
          method,
          data,
          ...(typeof session?.apiToken !== "undefined"
            ? { headers: { Authorization: `Bearer ${session.apiToken}` } }
            : {}),
          ...config
        })
        .then(response => response.data)
    },
    ...options
  })
}
