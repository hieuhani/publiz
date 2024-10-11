import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <h3 className="text-white">Welcome Home!</h3>
    </div>
  );
}
