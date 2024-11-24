import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$organization/")({
  component: () => <div>Hello welcome</div>,
});
