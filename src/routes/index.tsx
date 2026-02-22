import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { toAge } from "~/utils/extensions";
import { z } from "zod";
import { useEffect, useRef } from "react";
import { convexQuery } from "@convex-dev/react-query";
import {
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";

const schema = z.object({
  name: z
    .string()
    .optional()
    .transform((v) => v || undefined),
  hdbApproved: z
    .string()
    .optional()
    .transform((v) => v || undefined),
  gender: z
    .string()
    .optional()
    .transform((v) => v || undefined),
});

export const Route = createFileRoute("/")({
  component: Home,
  validateSearch: (search) => schema.parse(search),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context: { queryClient }, deps: { search } }) => {
    const args = {
      name: search.name,
      hdbApproved: search.hdbApproved,
      gender: search.gender,
    };

    await queryClient.ensureInfiniteQueryData({
      // 1. The queryKey must include the args + a label for 'infinite'
      queryKey: ["dogs", "list", args],
      queryFn: ({ pageParam }) => {
        return queryClient.fetchQuery(
          convexQuery(api.dogs.list, {
            ...args,
            paginationOpts: {
              numItems: 12,
              cursor: pageParam as string | null,
            },
          })
        );
      },
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage.continueCursor || null,
    });
  },
});

function Home() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath }); // Get navigation tool
  const dogs = Route.useLoaderData();
  const formRef = useRef<HTMLFormElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const clear = () => {
    formRef.current?.reset();
    navigate({ search: {} }); // Clear search params
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const hdbApproved = formData.get("hdbApproved") as string;
    const gender = formData.get("gender") as string;

    // Navigate to the same page with new search params
    navigate({
      search: (prev) => ({
        ...prev,
        name: name || undefined,
        hdbApproved: hdbApproved || undefined,
        gender: gender || undefined,
      }),
    });
  };

  const queryClient = useQueryClient(); // From @tanstack/react-query

  const args = {
    name: search.name,
    hdbApproved: search.hdbApproved,
    gender: search.gender,
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["dogs", "list", args],
      queryFn: ({ pageParam }) => {
        return queryClient.fetchQuery(
          convexQuery(api.dogs.list, {
            ...args,
            paginationOpts: {
              numItems: 12,
              cursor: pageParam as string | null,
            },
          })
        );
      },
      initialPageParam: null,
      // Convex returns 'continueCursor' and 'isDone'
      getNextPageParam: (lastPage) =>
        lastPage.isDone ? null : lastPage.continueCursor,
    });

  const allDogs = data.pages.flatMap((p) => p.page);

  useEffect(() => {
    // 2. Initialize the native observer
    const observer = new IntersectionObserver(
      (entries) => {
        // If the div is visible and there is more to load
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "200px" } // Load 200px before reaching bottom
    );

    // 3. Start observing the target
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    // 4. Cleanup: stop observing when component unmounts
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]); // Re-run when status changes

  return (
    <div className="row">
      <div className="col-lg-3 order-2 order-lg-1">
        <aside className="sidebar">
          <form onSubmit={handleSubmit} ref={formRef}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label mb-1 text-2">
                  <b>Name</b>
                </label>
                <input
                  type="text"
                  data-msg-required="Please enter your name."
                  maxLength={50}
                  className="form-control text-3 h-auto py-2"
                  name="name"
                  defaultValue={search.name}
                />
              </div>

              <div className="col-12">
                <label className="form-label mb-1 text-2">
                  <b>HDB Approved</b>
                </label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="hdbApproved"
                    value="Yes"
                    id="hdbApproved-yes"
                    defaultChecked={search.hdbApproved === "Yes"}
                  />
                  <label className="form-check-label" htmlFor="hdbApproved-yes">
                    {" "}
                    Yes{" "}
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="hdbApproved"
                    value="No"
                    id="hdbApproved-no"
                    defaultChecked={search.hdbApproved === "No"}
                  />
                  <label className="form-check-label" htmlFor="hdbApproved-no">
                    {" "}
                    No{" "}
                  </label>
                </div>
              </div>

              <div className="col-12">
                <label className="form-label mb-1 text-2">
                  <b>Gender</b>
                </label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    value="Male"
                    id="gender-male"
                    defaultChecked={search.gender === "Male"}
                  />
                  <label className="form-check-label" htmlFor="gender-male">
                    {" "}
                    Male
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    value="Female"
                    id="gender-female"
                    defaultChecked={search.gender === "Female"}
                  />
                  <label className="form-check-label" htmlFor="gender-female">
                    {" "}
                    Female
                  </label>
                </div>
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
                <button
                  type="button"
                  className="btn btn-link btn-sm"
                  onClick={clear}
                >
                  Clear
                </button>
              </div>
            </div>
          </form>
        </aside>
      </div>
      <div className="col-lg-9 order-1 order-lg-2">
        {allDogs.length === 0 ? (
          "No dogs found"
        ) : (
          <div
            className="row products product-thumb-info-list"
            data-plugin-masonry
            data-plugin-options="{'layoutMode': 'fitRows'}"
          >
            {allDogs.map((x) => (
              <div className="col-sm-6 col-lg-4" key={x._id}>
                <div className="product mb-0">
                  <div className="product-thumb-info border-0 mb-3">
                    {/* <div className="product-thumb-info-badges-wrapper">
                        <span className="badge badge-ecommerce text-bg-success">
                          NEW
                        </span>
                      </div> */}

                    {/* <div className="addtocart-btn-wrapper">
                        <a
                          href="shop-cart.html"
                          className="text-decoration-none addtocart-btn"
                          title="Add to Cart"
                        >
                          <i className="icons icon-bag" />
                        </a>
                      </div> */}

                    <a href={"dogs/" + x._id}>
                      <div className="product-thumb-info-image">
                        <img
                          alt=""
                          className="img-fluid"
                          src={x.imageUrl || "img/products/product-grey-4.jpg"}
                        />
                      </div>
                    </a>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div>
                      {/* <a
                      href="#"
                      className="d-block text-uppercase text-decoration-none text-color-default text-color-hover-primary line-height-1 text-0 mb-1"
                    >
                      electronics
                    </a> */}
                      <h3 className="font-weight-medium font-alternative text-transform-none line-height-3 mb-0">
                        <a
                          href={"dogs/" + x._id}
                          className="text-color-dark text-color-hover-primary"
                        >
                          {x.name}
                        </a>
                      </h3>
                    </div>
                    {/* <a
                      href="#"
                      className="text-decoration-none text-color-default text-color-hover-dark text-4"
                    >
                      <i className="far fa-heart" />
                    </a> */}
                  </div>
                  {/* <div title="Rated 5 out of 5">
                    <input
                      type="text"
                      className="d-none"
                      value="5"
                      title=""
                      data-plugin-star-rating
                      data-plugin-options="{'displayOnly': true, 'color': 'default', 'size':'xs'}"
                    />
                  </div> */}
                  <p className="text-4 mb-3">
                    {x.gender == "Male" ? (
                      <i className="fa-solid fa-mars" />
                    ) : (
                      <i className="fa-solid fa-venus" />
                    )}{" "}
                    <span>{x.gender}</span>
                    <br />
                    <i className="fa-solid fa-cake-candles" />{" "}
                    {toAge(x.birthday)}
                    <br />
                    <i className="fa-solid fa-house" />{" "}
                    {x.hdbApproved == "Yes"
                      ? "HDB Approved"
                      : "Not HDB Approved"}
                  </p>
                </div>
              </div>
            ))}

            {/* {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </button>
            )} */}

            {/* 5. The Sentinel Element (Ref is attached here) */}
            <div ref={observerTarget} className="col-12 py-5 text-center">
              {isFetchingNextPage && (
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
              {!hasNextPage && allDogs.length > 0 && (
                <p className="text-muted">You've seen all the dogs! 🐾</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
