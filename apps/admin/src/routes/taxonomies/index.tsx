import { createFileRoute } from "@tanstack/react-router";

const Taxonomies: React.FunctionComponent = () => {
  return <div>Taxonomies</div>;
};

export const Route = createFileRoute("/taxonomies/")({
  component: Taxonomies,
});
