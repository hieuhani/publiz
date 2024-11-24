import { getMyOrganization } from "@/api";
import { SideBar } from "@/components/SideBar";
import { CurrentOrganizationContextProvider } from "@/contexts/CurrentOrganizationContext";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";

const OrganizationLayout: React.FunctionComponent = () => {
  const { organization } = Route.useParams();

  const { data: myOrganizationResponse } = useSuspenseQuery({
    queryKey: ["myOrganization", organization],
    queryFn: () =>
      organization === "-" ? null : getMyOrganization(organization),
  });

  return (
    <CurrentOrganizationContextProvider
      value={{
        isSystem: organization === "-",
        organization: myOrganizationResponse?.data ?? null,
      }}
    >
      <div className="flex h-screen w-full">
        <SideBar organization={organization} />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </CurrentOrganizationContextProvider>
  );
};

export const Route = createFileRoute("/$organization")({
  component: OrganizationLayout,
  loader: async ({ context, params }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["myOrganization", params.organization],
      queryFn: () =>
        params.organization === "-"
          ? null
          : getMyOrganization(params.organization),
    }),
});
