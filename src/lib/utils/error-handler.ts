import { refreshToken } from "../../services/auth.service";
import { AxiosError, AxiosRequestConfig } from "axios";
import { Mutation, Query } from "@tanstack/react-query";
import {
  setAccessToken,
  removeAccessToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
} from "./tokens";
import { redirect } from "@/i18n/navigation";

export interface IErrorResponse {
  message: string;
}

let isRedirecting = false;
let isRefreshing = false;
let failedQueue: {
  query?: Query<unknown, unknown, unknown, readonly unknown[]>;
  mutation?: Mutation<unknown, unknown, unknown, unknown>;
  variables?: unknown;
}[] = [];

const errorHandler = (
  error: unknown,
  query?: Query<unknown, unknown, unknown, readonly unknown[]>,
  mutation?: Mutation<unknown, unknown, unknown, unknown>,
  variables?: unknown
) => {
  const { status, data } = (error as AxiosError<IErrorResponse>).response!;

  if (status === 401) {
    if (mutation) refreshTokenAndRetry(undefined, mutation, variables);
    else refreshTokenAndRetry(query);
  } else console.error(data?.message);
};

export const queryErrorHandler = (
  error: unknown,
  query: Query<unknown, unknown, unknown, readonly unknown[]>
) => {
  errorHandler(error, query);
};

export const mutationErrorHandler = (
  error: unknown,
  variables: unknown,
  context: unknown,
  mutation: Mutation<unknown, unknown, unknown, unknown>
) => {
  errorHandler(error, undefined, mutation, variables);
};

const processFailedQueue = () => {
  failedQueue.forEach(({ query, mutation, variables }) => {
    if (mutation) {
      // const { options } = mutation;
      // mutation.setOptions(options);
      mutation.execute(variables);
    }
    if (query) query.fetch();
  });
  isRefreshing = false;
  failedQueue = [];
};

const refreshTokenAndRetry = async (
  query?: Query<unknown, unknown, unknown, readonly unknown[]>,
  mutation?: Mutation<unknown, unknown, unknown, unknown>,
  variables?: unknown
) => {
  try {
    if (!isRefreshing) {
      isRefreshing = true;
      failedQueue.push({ query, mutation, variables });
      const { token, refreshToken: newRefreshToken } = await refreshToken(
        getRefreshToken()!
      );
      setAccessToken(token);
      setRefreshToken(newRefreshToken);
      processFailedQueue();
    } else failedQueue.push({ query, mutation, variables });
  } catch {
    removeAccessToken();
    removeRefreshToken();
    if (!isRedirecting) {
      isRedirecting = true;
      redirect({ href: "/login", locale: "ar" });
    }
  }
};
