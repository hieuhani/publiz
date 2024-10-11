import { getSystemDatabaseMigrations } from "@/api";
import { AuthContextState } from "@/contexts/AuthContext";
import { buildQueryOptions } from "@/lib/query";
import { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: AuthContextState;
}>()({
  component: () => (
    <div>
      <Toaster />
      <Outlet />
    </div>
  ),
  beforeLoad: async ({ context, location }) => {
    const { data } = await context.queryClient.ensureQueryData(
      buildQueryOptions(getSystemDatabaseMigrations)
    );
    if (data.length === 0 && location.pathname !== "/welcome") {
      throw redirect({ to: "/welcome" });
    }
    const isAuthenticated = await context.auth.checkAuth();
    if (!isAuthenticated && location.pathname !== "/sign-in") {
      throw redirect({ to: "/sign-in" });
    }
  },
});
