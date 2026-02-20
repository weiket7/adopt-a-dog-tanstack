import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { toAge } from "~/utils/extensions";
import { z } from "zod";

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
    return await queryClient.ensureQueryData(
      convexQuery(api.dogs.list, {
        name: search.name,
        hdbApproved: search.hdbApproved,
        gender: search.gender,
      })
    );
  },
});

function Home() {
  const search = Route.useSearch();
  //const { name, hdbApproved, gender } = Route.useSearch()
  const dogs = Route.useLoaderData();

  return (
    <div className="row">
      <div className="col-lg-3 order-2 order-lg-1">
        <aside className="sidebar">
          <form action="/" method="get">
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
                  />
                  <label className="form-check-label" htmlFor="gender-female">
                    {" "}
                    Female
                  </label>
                </div>
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </aside>
      </div>
      <div className="col-lg-9 order-1 order-lg-2">
        <div
          className="row products product-thumb-info-list"
          data-plugin-masonry
          data-plugin-options="{'layoutMode': 'fitRows'}"
        >
          {dogs.map((x) => (
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
                        src={x.imageUrl || "img/products/product-grey-4.js"}
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
                  )}
                  <span>{x.gender}</span>
                  <br />
                  <i className="fa-solid fa-cake-candles" /> {toAge(x.birthday)}
                  <br />
                  <i className="fa-solid fa-house" />{" "}
                  {x.hdbApproved == "Yes" ? "HDB Approved" : "Not HDB Approved"}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* <!-- <div className="row mt-4">
          <div className="col">
            <ul className="pagination float-end">
              <li className="page-item">
                <a className="page-link" href="#"
                  ><i className="fas fa-angle-left"></i></a
                >
              </li>
              <li className="page-item active">
                <a className="page-link" href="#">1</a>
              </li>
              <li className="page-item"><a className="page-link" href="#">2</a></li>
              <li className="page-item"><a className="page-link" href="#">3</a></li>
              <li className="page-item">
                <a className="page-link" href="#"
                  ><i className="fas fa-angle-right"></i></a
                >
              </li>
            </ul>
          </div>
        </div> --> */}
      </div>
    </div>
  );
}
