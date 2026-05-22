/// <reference types="vite/client" />

import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { HeadContent, Link, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
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
      { title: "Homeward — Dogs for Adoption" },
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
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="logo">
          <span className="mark">
            <PawIcon />
          </span>
          Homeward
          <small>Dog Rescue</small>
        </Link>
        <div className="nav-menu">
          <Link
            to="/"
            activeProps={{ className: "active" }}
            activeOptions={{ exact: true }}
          >
            Dogs
          </Link>
          <Link to="/events" activeProps={{ className: "active" }}>
            Events
          </Link>
          <Link to="/welfare-groups" activeProps={{ className: "active" }}>
            Welfare Groups
          </Link>
          <Link to="/dog-runs" activeProps={{ className: "active" }}>
            Dog Runs
          </Link>
          <Link to="/vets" activeProps={{ className: "active" }}>
            Vets
          </Link>
          <Link to="/blog" activeProps={{ className: "active" }}>
            Blog
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <span>&copy; 2026 Homeward Dog Rescue &middot; Singapore</span>
      <span>hello@homeward.sg</span>
    </footer>
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
