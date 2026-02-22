import { createFileRoute, notFound } from "@tanstack/react-router";
import { NotFound } from "~/components/NotFound";
import { PostErrorComponent } from "~/components/PostError";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { toAge } from "~/utils/extensions";
import { Id } from "convex/_generated/dataModel"; // Import the Id type
import { useForm } from "@tanstack/react-form";
import { FieldError } from "~/components/FieldError";
import { emailWelfareGroup } from "~/server/email";

export const Route = createFileRoute("/dogs/$dogId")({
  loader: async ({ params, context }) => {
    const dog = await context.queryClient
      .ensureQueryData(
        convexQuery(api.dogs.get, { id: params.dogId as Id<"dogs"> })
      )
      .catch(() => null); // Catch the Convex validation error and return null

    if (!dog) throw notFound(); // Triggers notFoundComponent
    return dog;
  },
  component: PostComponent,
  errorComponent: PostErrorComponent,
  notFoundComponent: () => {
    return <NotFound>Post not found</NotFound>;
  },
});

function PostComponent() {
  const dog = Route.useLoaderData();
  if (!dog) {
    return <NotFound>Dog not found</NotFound>;
  }

  const form = useForm({
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      message: "",
      dogId: dog!._id,
    },
    onSubmit: async ({ value }) => {
      await emailWelfareGroup({ data: value });
      form.reset();
    },
  });

  return (
    <div className="row">
      <div className="col-lg-9">
        <div className="row">
          <div className="col-lg-6">
            <div className="product mb-0">
              <div className="product-thumb-info border-0 mb-0">
                <div className="product-thumb-info-image">
                  <img
                    alt=""
                    className="img-fluid"
                    src={dog.imageUrl || "img/products/product-grey-4.jpg"}
                  />
                </div>
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
                <i className="fa-solid fa-mars"></i>
              ) : (
                <i className="fa-solid fa-venus"></i>
              )}{" "}
              {dog.gender}
              <br />
              <i className="fa-solid fa-cake-candles"></i> {toAge(dog.birthday)}
              <br />
              <i className="fa-solid fa-house"></i>
              {dog.hdbApproved == "Yes" ? "HDB Approved" : "Not HDB Approved"}
              <br />
              <br />
              {dog.description}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <form.Field
                  name="name"
                  children={(field) => (
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        className={`form-control ${field.state.meta.errors.length ? "is-invalid" : ""}`}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                />

                <form.Field
                  name="mobile"
                  children={(field) => (
                    <div className="mb-3">
                      <label className="form-label">Mobile Number</label>
                      <input
                        type="tel"
                        className={`form-control ${field.state.meta.errors.length ? "is-invalid" : ""}`}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                />

                <form.Field
                  name="email"
                  children={(field) => (
                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className={`form-control ${field.state.meta.errors.length ? "is-invalid" : ""}`}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                />

                <form.Field
                  name="message"
                  children={(field) => (
                    <div className="mb-3">
                      <label className="form-label">Message</label>
                      <textarea
                        rows={4}
                        className={`form-control ${field.state.meta.errors.length ? "is-invalid" : ""}`}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                />

                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2"
                      disabled={!canSubmit || isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  )}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-3"></div>
    </div>
  );
}
