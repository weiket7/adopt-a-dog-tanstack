import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "~/components/NotFound";
import { PostErrorComponent } from "~/components/PostError";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { toAge } from "~/utils/extensions";
import { Id } from "convex/_generated/dataModel"; // Import the Id type

export const Route = createFileRoute("/dogs/$dogId")({
  //loader: ({ params: { dogId } }) => useSuspenseQuery(convexQuery(api.dogs.list, {})),
  loader: async ({ params, context: { queryClient } }) => {
    return await queryClient.ensureQueryData(
      convexQuery(api.dogs.get, { id: params.dogId as Id<"dogs"> })
    );
  },
  component: PostComponent,
  errorComponent: PostErrorComponent,
  notFoundComponent: () => {
    return <NotFound>Post not found</NotFound>;
  },
});

function PostComponent() {
  const dog = Route.useLoaderData();

  return (
    <div className="row">
      <div className="col-lg-9">
        <div className="row">
          <div className="col-lg-6">
            <div className="product mb-0">
              <div className="product-thumb-info border-0 mb-0">
                {/* <!-- <div className="product-thumb-info-badges-wrapper">
                  <span className="badge badge-ecommerce text-bg-success">NEW</span>
                </div> --> 

                <!-- <div className="addtocart-btn-wrapper">
                  <a
                    href="shop-cart.html"
                    className="text-decoration-none addtocart-btn"
                    title="Add to Cart"
                  >
                    <i className="icons icon-bag"></i>
                  </a>
                </div> -->

                <!-- <a href="shop-product-sidebar-left.html"> -->-->*/}
                <div className="product-thumb-info-image">
                  <img
                    alt=""
                    className="img-fluid"
                    src={dog.imageUrl || "img/products/product-grey-4.js"}
                  />
                </div>
                {/* </a>  */}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="summary entry-summary position-relative">
              <h1 className="mb-0 font-weight-semibold text-7">{dog.name}</h1>
              <div className="divider divider-small">
                <hr className="bg-color-grey-400" />
              </div>
              {dog.gender == "Male" ? (
                <i className="fa-solid fa-mars" />
              ) : (
                <i className="fa-solid fa-venus" />
              )}
              {/* <!-- <span className="sale text-color-dark font-weight-semi-bold">
                {dog.gender}
              </span> --> */}
              {dog.gender}
              <br />
              <i className="fa-solid fa-cake-candles"></i> {toAge(dog.birthday)}
              <br />
              <i className="fa-solid fa-house"></i>
              {dog.hdbApproved == "Yes" ? "HDB Approved" : "Not HDB Approved"}
              {/* <!-- <ul className="list list-unstyled text-2">
                <li className="mb-0">
                  AVAILABILITY: <strong className="text-color-dark">AVAILABLE</strong>
                </li>
                <li className="mb-0">
                  SKU: <strong className="text-color-dark">1234567890</strong>
                </li>
              </ul> --> */}
              <br />
              <br />
              {dog.description}
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-3"></div>
    </div>
  );
}
