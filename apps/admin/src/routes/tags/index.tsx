import { createTag, getTags, updateTag } from "@/api";
import { ButtonDrawer } from "@/components/ButtonDrawer";
import { CreateForm } from "@/components/crud/CreateForm";
import { buildQueryOptions } from "@/lib/query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Plus } from "lucide-react";
import { z } from "zod";

const Tags: React.FunctionComponent = () => {
  const {
    data: { data: records = [] },
    refetch,
  } = useSuspenseQuery(buildQueryOptions(getTags));

  return (
    <div className="mx-auto max-w-xl pt-4">
      <div className="items-center justify-between flex mb-4">
        <h3 className="text-xl">Tags</h3>
        <ButtonDrawer
          content={(close) => (
            <CreateForm
              onCreated={() => {
                refetch();
                close();
              }}
              schema={z.object({
                name: z.string().min(1).max(100),
                slug: z.string().min(1).max(100),
                parentId: z.number().optional(),
                taxonomyId: z.number().optional(),
              })}
              createFn={(tag) => createTag([tag])}
              updateFn={updateTag}
            />
          )}
          title="Create a new tag"
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
              <CreateForm
                currentData={record}
                onCreated={() => {
                  refetch();
                  close();
                }}
                schema={z.object({
                  name: z.string().min(1).max(100),
                  slug: z.string().min(1).max(100),
                  parentId: z.number().optional(),
                  taxonomyId: z.number().optional(),
                })}
                createFn={(tag) => createTag([tag])}
                updateFn={updateTag}
              />
            )}
            title="Update tag"
          >
            <button
              key={record.id}
              className="px-4 py-2 text-left flex items-center justify-between hover:bg-zinc-700"
            >
              <div>
                <h4 className="font-medium">{record.name}</h4>
                <p className="text-sm">{record.slug}</p>
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

export const Route = createFileRoute("/tags/")({
  component: Tags,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(buildQueryOptions(getTags)),
});
