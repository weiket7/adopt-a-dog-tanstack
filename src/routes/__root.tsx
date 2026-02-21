/// <reference types="vite/client" />

import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { HeadContent, Link, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title:
          "TanStack Start | Type-Safe, Client-First, Full-Stack React Framework",
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      //{ rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
    scripts: [
      {
        src: "/customScript.js",
        type: "text/javascript",
      },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

const menu = [
  // {
  //   name: "Home",
  //   link: "/",
  // },
  {
    name: "Dogs for Adoption",
    link: "/",
  },
  {
    name: "Welfare Groups",
    link: "/welfare-groups",
  },
  {
    name: "Events",
    link: "/events",
  },
  {
    name: "Listings",
    link: "",
    subMenu: [
      {
        name: "Dog Runs",
        link: "/dog-runs",
      },
      {
        name: "Pet Stores",
        link: "/pet-stores",
      },
      {
        name: "Vets",
        link: "/vets",
      },
      {
        name: "Pet Cafes",
        link: "/pet-cafes",
      },
      {
        name: "Pet Transport",
        link: "/pet-transport",
      },
      {
        name: "Grooming",
        link: "/grooming",
      },
      {
        name: "Services", //boarding, training, portraits (rachel)
        link: "/services",
      },
    ],
  },
  // {
  //   name: ".NET Starter Kit",
  //   link: "/dotnet-starter-kit",
  // },
  // {
  //   name: "Blog",
  //   link: "/blog",
  // },
];

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>Adopt a Dog</title>

        <meta name="keywords" content="WebSite Template" />
        <meta
          name="description"
          content="Porto - Multipurpose Website Template"
        />
        <meta name="author" content="okler.net" />

        <link rel="shortcut icon" href="/img/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/img/apple-touch-icon.png" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1.0, shrink-to-fit=no"
        />

        <link
          id="googleFonts"
          href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800%7CShadows+Into+Light&display=swap"
          rel="stylesheet"
          type="text/css"
        />

        <link rel="stylesheet" href="/vendor/bootstrap/css/bootstrap.min.css" />
        <link
          rel="stylesheet"
          href="/vendor/fontawesome-free/css/all.min.css"
        />
        <link rel="stylesheet" href="/vendor/animate/animate.compat.css" />
        <link
          rel="stylesheet"
          href="/vendor/simple-line-icons/css/simple-line-icons.min.css"
        />
        <link
          rel="stylesheet"
          href="/vendor/owl.carousel/assets/owl.carousel.min.css"
        />
        <link
          rel="stylesheet"
          href="/vendor/owl.carousel/assets/owl.theme.default.min.css"
        />
        <link
          rel="stylesheet"
          href="/vendor/magnific-popup/magnific-popup.min.css"
        />

        <link rel="stylesheet" href="/css/theme.css" />
        <link rel="stylesheet" href="/css/theme-elements.css" />
        <link rel="stylesheet" href="/css/theme-blog.css" />
        <link rel="stylesheet" href="/css/theme-shop.css" />

        <link
          rel="stylesheet"
          href="/vendor/circle-flip-slideshow/css/component.css"
        />

        <link id="skinCSS" rel="stylesheet" href="/css/skins/default.css" />

        <link rel="stylesheet" href="/css/custom.css" />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"
        />
      </head>
      <body data-plugin-page-transition>
        <div className="body">
          <header
            id="header"
            className="header-effect-shrink"
            suppressHydrationWarning={true}
            data-plugin-options="{'stickyEnabled': true, 'stickyEnableOnBoxed': true, 'stickyEnableOnMobile': false, 'stickyChangeLogo': false, 'stickyStartAt': 0}"
          >
            <div
              className="header-body border-top-0"
              suppressHydrationWarning={true}
            >
              <div className="header-container container">
                <div className="header-row">
                  <div className="header-column">
                    <div className="header-row">
                      <p
                        className="mb-0 text-dark"
                        style={{ fontSize: "20px" }}
                      >
                        <strong>
                          <a href="/">Adopt A Dog | Singapore</a>
                        </strong>
                      </p>
                    </div>
                  </div>
                  <div className="header-column justify-content-end">
                    <div className="header-row">
                      <div className="header-nav header-nav-line header-nav-top-line header-nav-top-line-with-border order-2 order-lg-1">
                        <div className="header-nav-main header-nav-main-square header-nav-main-effect-2 header-nav-main-sub-effect-1">
                          <nav className="collapse">
                            {/* <nav className="collapse"> */}
                            <ul className="nav nav-pills" id="mainNav">
                              {menu.map((x) => (
                                <li key={x.link} className="dropdown">
                                  <Link
                                    to={x.link}
                                    suppressHydrationWarning={true} // Move it here!
                                    className="dropdown-item dropdown-toggle"
                                    // activeProps={{ className: 'active' }} // Optional: add an active class automatically
                                  >
                                    {x.name}
                                  </Link>
                                  {x.subMenu && (
                                    <ul className="dropdown-menu">
                                      {x.subMenu.map((sub) => (
                                        <li key={sub.link}>
                                          <Link
                                            to={sub.link}
                                            suppressHydrationWarning={true}
                                            className="dropdown-item"
                                          >
                                            {sub.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </nav>
                        </div>
                        <button
                          className="btn header-btn-collapse-nav"
                          data-bs-toggle="collapse"
                          data-bs-target=".header-nav-main nav"
                        >
                          <i className="fas fa-bars"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div role="main" className="main">
            {/* <!-- <section
              className="page-header page-header-modern bg-color-grey page-header-sm"
            >
              <div className="container">
                <div className="row">
                  <div
                    className="col-md-8 align-self-center p-static order-2 order-md-1"
                  >
                    <h1 className="text-dark text-uppercase">
                      <strong><slot name="header" /></strong>
                    </h1>
                  </div>
                  <div className="col-md-4 align-self-center order-1 order-md-2">
                    <ul className="breadcrumb d-block text-md-end">
                      <li><a href="#">Home</a></li>
                      <li className="active">Features</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section> --> */}

            <div className="container py-4">
              {children}
              <TanStackRouterDevtools position="bottom-right" />
            </div>
          </div>
        </div>

        <script src="/vendor/plugins/js/plugins.min.js"></script>

        <script src="/js/theme.js"></script>

        <script src="/vendor/circle-flip-slideshow/js/jquery.flipshow.min.js"></script>
        <script src="/js/views/view.home.js"></script>

        <script src="/js/custom.js"></script>

        <script src="/js/theme.init.js"></script>

        <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
        <Scripts />
      </body>
    </html>
    // <html>
    //   <head>
    //     <HeadContent />
    //   </head>
    //   <body>
    //     <div className="p-2 flex gap-2 text-lg">
    //       <Link
    //         to="/"
    //         activeProps={{
    //           className: 'font-bold',
    //         }}
    //         activeOptions={{ exact: true }}
    //       >
    //         Home
    //       </Link>{' '}
    //       <Link
    //         to="/posts"
    //         activeProps={{
    //           className: 'font-bold',
    //         }}
    //       >
    //         Posts
    //       </Link>{' '}
    //       <Link
    //         to="/users"
    //         activeProps={{
    //           className: 'font-bold',
    //         }}
    //       >
    //         Users
    //       </Link>{' '}
    //       <Link
    //         to="/route-a"
    //         activeProps={{
    //           className: 'font-bold',
    //         }}
    //       >
    //         Pathless Layout
    //       </Link>{' '}
    //       <Link
    //         to="/deferred"
    //         activeProps={{
    //           className: 'font-bold',
    //         }}
    //       >
    //         Deferred
    //       </Link>{' '}
    //       <Link
    //         // @ts-expect-error
    //         to="/this-route-does-not-exist"
    //         activeProps={{
    //           className: 'font-bold',
    //         }}
    //       >
    //         This Route Does Not Exist
    //       </Link>
    //     </div>
    //     <hr />
    //     {children}
    //     <TanStackRouterDevtools position="bottom-right" />
    //     <Scripts />
    //   </body>
    // </html>
  );
}
