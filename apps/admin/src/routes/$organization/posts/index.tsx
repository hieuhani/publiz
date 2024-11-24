import { createFileRoute } from '@tanstack/react-router'

const Posts: React.FunctionComponent = () => {
  return <div>Posts</div>
}

export const Route = createFileRoute('/$organization/posts/')({
  component: Posts,
})
