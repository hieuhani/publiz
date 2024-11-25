import { getMyOrganizations, getOrganizations } from "@/api";
import { useCurrentUser } from "@/contexts/CurrentUserContext";
import { buildQueryOptions } from "@/lib/query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

const RoleAdministrator = 0b0000000000000000000000001000000;

export const Route = createFileRoute("/")({
  component: Index,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(buildQueryOptions(getMyOrganizations)),
});

function Index() {
  const {
    data: { data: records = [] },
  } = useSuspenseQuery(buildQueryOptions(getOrganizations));
  const currentUser = useCurrentUser();
  const systemSlug: string = "-";
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur">
      <div className="max-w-md mx-auto bg mt-12 rounded-xl border bg-card text-card-foreground shadow space-y-1.5 py-6">
        <div className="px-6 mb-4">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Select organization
          </h3>
          <p className="text-sm text-muted-foreground">
            Your working organizations
          </p>
        </div>

        <div className="px-2">
          {currentUser.rolesMask &&
            !!(currentUser.rolesMask & RoleAdministrator) && (
              <Link
                to={`/${systemSlug}`}
                className="px-4 rounded py-3 flex text-left justify-between items-center w-full hover:bg-zinc-800"
              >
                <div>
                  <h4 className="font-medium">System</h4>
                  <p className="text-sm">System management</p>
                </div>

                <div>
                  <ChevronRight />
                </div>
              </Link>
            )}
          {records.map((record) => (
            <Link
              to={`/${record.slug}`}
              key={record.id}
              className="px-4 rounded py-3 flex text-left justify-between items-center w-full hover:bg-zinc-800"
            >
              <div>
                <h4 className="font-medium">{record.name}</h4>
                <p className="text-sm">{record.description}</p>
              </div>

              <div>
                <ChevronRight />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
