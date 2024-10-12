import { createFileRoute } from "@tanstack/react-router";

const Files: React.FunctionComponent = () => {
  return <div>Files</div>;
};

export const Route = createFileRoute("/files/")({
  component: Files,
});
