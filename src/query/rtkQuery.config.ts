import type { QueryClientConfig } from "@tanstack/react-query"

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 3,
      // INFO: staleTime is the time that the data will be considered fresh in our case we will take 45 minutes (even tough it's 1 hour in our system)
      staleTime: 1000 * 60 * 45,
      // INFO: re-fetches the data on mount if in cache it is stale
      refetchOnMount: true,
      // INFO: interval to re-fetch the data
      refetchInterval: false,
      refetchIntervalInBackground: false
    },

    mutations: {
      retry: 1
    }
  }
}

export default queryClientConfig
