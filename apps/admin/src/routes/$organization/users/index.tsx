import { createFileRoute } from '@tanstack/react-router'

const Users: React.FunctionComponent = () => {
  return <div>Users</div>
}

export const Route = createFileRoute('/$organization/users/')({
  component: Users,
})
