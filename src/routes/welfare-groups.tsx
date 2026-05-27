import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/welfare-groups")({
  component: () => <Outlet />,
});
