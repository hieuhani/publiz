import { createFileRoute } from "@tanstack/react-router";

const Tags: React.FunctionComponent = () => {
  return <div>Tags</div>;
};

export const Route = createFileRoute("/tags/")({
  component: Tags,
});
