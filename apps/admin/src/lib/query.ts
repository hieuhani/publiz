import { type QueryFunction, queryOptions } from "@tanstack/react-query";

export const buildQueryOptions = <T>(fn: QueryFunction<T>) => {
  return queryOptions({
    queryKey: [fn.name],
    queryFn: fn,
  });
};
