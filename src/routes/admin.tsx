import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { useConvexAuth, useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminNav() {
  const role = useQuery(api.users.role);
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  return (
    <div className="admin-subnav">
      <div className="admin-subnav-inner">
        <Link to="/admin/dogs" activeProps={{ className: "active" }}>
          Dogs
        </Link>
        <Link to="/admin/events" activeProps={{ className: "active" }}>
          Events
        </Link>
        {role === "Admin" && (
          <>
            <Link to="/admin/services" activeProps={{ className: "active" }}>
              Services
            </Link>
            <Link to="/admin/dog-runs" activeProps={{ className: "active" }}>
              Dog Runs
            </Link>
            <Link to="/admin/vets" activeProps={{ className: "active" }}>
              Vets
            </Link>
            <Link to="/admin/users" activeProps={{ className: "active" }}>
              Users
            </Link>
            <a
              href="#"
              onClick={async (e) => {
                e.preventDefault();
                await signOut();
                navigate({ to: "/" });
              }}
            >
              Log out
            </a>
          </>
        )}
      </div>
    </div>
  );
}

function AdminLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !isAuthenticated) return null;

  return (
    <>
      <AdminNav />
      <Outlet />
    </>
  );
}
