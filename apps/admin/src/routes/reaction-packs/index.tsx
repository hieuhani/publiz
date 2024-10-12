import { createFileRoute } from "@tanstack/react-router";

const ReactionPacks: React.FunctionComponent = () => {
  return <div>ReactionPacks</div>;
};

export const Route = createFileRoute("/reaction-packs/")({
  component: ReactionPacks,
});
