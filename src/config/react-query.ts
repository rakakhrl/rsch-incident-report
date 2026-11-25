import { AxiosError } from "axios";
import { QueryClient } from "@tanstack/react-query";
import type {
  DefaultOptions,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

const queryConfig: DefaultOptions = {
  queries: {
    throwOnError: true,
    refetchOnWindowFocus: false,
    retry: false,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

export type ExtractFnReturnType<FnType extends (...args: any) => any> = Awaited<
  ReturnType<FnType>
>;

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<
    ExtractFnReturnType<QueryFnType>, // TQueryFnData
    AxiosError, // TError
    ExtractFnReturnType<QueryFnType>, // TData
    any // TQueryKey
  >,
  "queryKey" | "queryFn"
>;

export type MutationConfig<MutationFnType extends (...args: any) => any> =
  UseMutationOptions<
    ExtractFnReturnType<MutationFnType>,
    AxiosError,
    Parameters<MutationFnType>[0]
  >;
