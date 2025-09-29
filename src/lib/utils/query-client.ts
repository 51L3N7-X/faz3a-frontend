import { MutationCache, QueryCache } from "@tanstack/react-query";
import { mutationErrorHandler, queryErrorHandler } from "./error-handler";

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      suspense: false,
      refetchInterval: 0,
      cacheTime: 0,
      staleTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: queryErrorHandler,
  }),
  mutationCache: new MutationCache({
    onError: mutationErrorHandler,
  }),
};
