/// <reference types="vite/client" />

import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import {
  HeadContent,
  Link,
  Scripts,
  useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import * as React from "react";
import { api } from "../../convex/_generated/api";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import appCss from "~/styles/app.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Adoptadog — Dogs for adoption in Singapore" },
      {
        name: "description",
        content:
          "Find your perfect dog companion. Browse dogs available for adoption in Singapore.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

function PawIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="6" cy="10" rx="2" ry="2.6" />
      <ellipse cx="10" cy="6.5" rx="2" ry="2.6" />
      <ellipse cx="14" cy="6.5" rx="2" ry="2.6" />
      <ellipse cx="18" cy="10" rx="2" ry="2.6" />
      <path d="M12 12c-3 0-5.5 2.4-5.5 5 0 1.8 1.3 3 3 3 1 0 1.7-.5 2.5-.5s1.5.5 2.5.5c1.7 0 3-1.2 3-3 0-2.6-2.5-5-5.5-5z" />
    </svg>
  );
}

function Nav() {
  const role = useQuery(api.users.role);
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="logo">
          <span className="mark">
            <PawIcon />
          </span>
          Adopt A Dog
          <small>Singapore</small>
        </Link>
        <div className="nav-right">
          <div className="nav-menu">
            {role === "Admin" ? (
              <>
                <Link to="/admin/dogs" activeProps={{ className: "active" }}>
                  Dogs
                </Link>
                <Link to="/admin/events" activeProps={{ className: "active" }}>
                  Events
                </Link>
                <Link to="/admin/users" activeProps={{ className: "active" }}>
                  Users
                </Link>
                <span className="nav-divider" aria-hidden="true" />
                <button className="nav-signout" onClick={handleSignOut}>
                  Log out
                </button>
              </>
            ) : role === "Member" ? (
              <>
                <Link to="/admin/dogs" activeProps={{ className: "active" }}>
                  Dogs
                </Link>
                <span className="nav-divider" aria-hidden="true" />
                <button className="nav-signout" onClick={handleSignOut}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  activeProps={{ className: "active" }}
                  activeOptions={{ exact: true }}
                >
                  Dogs
                </Link>
                <Link
                  to="/welfare-groups"
                  activeProps={{ className: "active" }}
                >
                  Welfare Groups
                </Link>
                <Link to="/events" activeProps={{ className: "active" }}>
                  Events
                </Link>
                <Link to="/dog-runs" activeProps={{ className: "active" }}>
                  Dog Runs
                </Link>
                <Link to="/vets" activeProps={{ className: "active" }}>
                  Vets
                </Link>
              </>
            )}
          </div>
          {!isAuthenticated && (
            <a
              className="nav-support"
              href="https://ko-fi.com/adoptadogsg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Support us on Ko-fi — donations go towards hosting this site"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 21s-7.5-4.6-9.6-9.2C1.1 8.7 3 5.5 6.1 5.5c1.9 0 3.3 1 3.9 2.6.6-1.6 2-2.6 3.9-2.6 3.1 0 5 3.2 3.7 6.3C19.5 16.4 12 21 12 21z" />
              </svg>
              Support us
              <span className="nav-support-tip" role="tooltip">
                Donations go towards hosting this site
              </span>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  const navigate = useNavigate();
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  const linkStyle = {
    color: "var(--muted)",
    textDecoration: "underline",
    textUnderlineOffset: "3px",
  };

  return (
    <>
      <footer className="foot">
        <span>&copy; 2026 Adopt A Dog &middot; Singapore</span>
        <span>
          <span>Developed by Wei Ket</span>
          &nbsp; | &nbsp;
          {isAuthenticated ? (
            <>
              <a
                href="#"
                onClick={async (e) => {
                  e.preventDefault();
                  await signOut();
                  navigate({ to: "/" });
                }}
                style={linkStyle}
              >
                Log out
              </a>
            </>
          ) : (
            <Link to="/login" style={linkStyle}>
              Log in
            </Link>
          )}
        </span>
      </footer>
    </>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <Nav />
        {children}
        <Footer />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
