import { getOrganizations } from "@/api";
import { ButtonDrawer } from "@/components/ButtonDrawer";
import { CreateOrganizationForm } from "@/components/CreateOrganizationForm";
import { buildQueryOptions } from "@/lib/query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Plus } from "lucide-react";

const Organizations: React.FunctionComponent = () => {
  const {
    data: { data: records = [] },
    refetch,
  } = useSuspenseQuery(buildQueryOptions(getOrganizations));
  return (
    <div className="mx-auto max-w-xl pt-4">
      <div className="items-center justify-between flex mb-4">
        <h3 className="text-xl">Organizations</h3>

        <ButtonDrawer
          content={(close) => (
            <CreateOrganizationForm
              onCreated={() => {
                refetch();
                close();
              }}
            />
          )}
          title="Create a new organization"
        >
          <button>
            <Plus />
          </button>
        </ButtonDrawer>
      </div>
      <div className="bg-zinc-800 rounded-xl overflow-hidden flex flex-col">
        {records.map((record) => (
          <ButtonDrawer
            key={record.id}
            content={(close) => (
              <CreateOrganizationForm
                organization={record}
                onCreated={() => {
                  refetch();
                  close();
                }}
              />
            )}
            title="Update organization"
          >
            <button
              key={record.id}
              className="px-4 py-2 text-left flex items-center justify-between hover:bg-zinc-700"
            >
              <div>
                <h4 className="font-medium">{record.name}</h4>
                <p className="text-sm">{record.description}</p>
              </div>
              <div>
                <ChevronRight />
              </div>
            </button>
          </ButtonDrawer>
        ))}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/organizations/")({
  component: Organizations,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(buildQueryOptions(getOrganizations)),
});
