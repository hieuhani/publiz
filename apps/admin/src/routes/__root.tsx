import { getSystemDatabaseMigrations } from "@/api";
import { RootEntry } from "@/components/RootEntry";
import { AuthContextState } from "@/contexts/AuthContext";
import { buildQueryOptions } from "@/lib/query";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, redirect } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: AuthContextState;
}>()({
  component: () => <RootEntry />,
  beforeLoad: async ({ context, location }) => {
    const { data } = await context.queryClient.ensureQueryData(
      buildQueryOptions(getSystemDatabaseMigrations)
    );
    if (data.length === 0 && location.pathname !== "/welcome") {
      throw redirect({ to: "/welcome" });
    }
  },
});
