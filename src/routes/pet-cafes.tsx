import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pet-cafes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/pet-cafes"!</div>
}
