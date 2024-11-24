import { createFileRoute } from '@tanstack/react-router'

const MetaSchemas: React.FunctionComponent = () => {
  return <div>Meta Schemas</div>
}

export const Route = createFileRoute('/$organization/meta-schemas/')({
  component: MetaSchemas,
})
