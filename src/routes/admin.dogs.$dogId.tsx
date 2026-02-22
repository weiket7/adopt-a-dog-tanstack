import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { useMutation } from "@tanstack/react-query";
import { deleteDogAction, saveDogAction } from "~/server/dog.functions";
import { api } from "convex/_generated/api";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { FieldError } from "~/components/FieldError";

export const Route = createFileRoute("/admin/dogs/$dogId")({
  component: DogFormPage,
});

function DogFormPage() {
  const { dogId } = Route.useParams();
  const router = useRouter();

  const isEdit = dogId !== "add";

  const existingDog = useQuery(
    api.dogs.get,
    isEdit ? { id: dogId as any } : "skip"
  );

  const welfareGroups = useQuery(api.welfareGroups.list, {}) || [];

  const { mutate: deleteDog, isPending: isDeleting } = useMutation({
    mutationFn: async (dogId: string) => {
      return await deleteDogAction({ data: dogId });
    },
    onSuccess: () => {
      router.invalidate().then(() => {
        router.navigate({ to: "/admin/dogs" });
      });
    },
  });

  //You should use mutateAsync only if you need to do something in your onClick function immediately after the deletion finishes,
  //but before the onSuccess logic kicks in, or if you want to use a try/catch block inside the component.
  const {
    mutate: upsertDog,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: async (variables: FormData) => {
      return await saveDogAction({ data: variables });
    },
    onSuccess: () => {
      router.invalidate().then(() => {
        router.navigate({ to: "/admin/dogs" });
      });
    },
    onError: (error) => {
      console.error("Submission Error:", error);
      alert("Submission failed. Check console for details.");
    },
  });

  const form = useForm({
    defaultValues: {
      name: existingDog?.name || "",
      gender: existingDog?.gender || "Male",
      hdbApproved: existingDog?.hdbApproved || "Yes",
      birthday: existingDog?.birthday || "",
      welfareGroupId: existingDog?.welfareGroupId || "",
      image: null as File | null,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();

      formData.append("name", value.name);
      formData.append("gender", value.gender);
      formData.append("hdbApproved", value.hdbApproved);
      formData.append("birthday", value.birthday);
      formData.append("welfareGroupId", value.welfareGroupId);
      if (value.image) formData.append("image", value.image);

      if (isEdit) formData.append("dogId", dogId);
      if (existingDog?.imageStorageId) {
        formData.append("existingStorageId", existingDog.imageStorageId);
      }

      upsertDog(formData);
    },
  });

  if (isEdit && existingDog === undefined)
    return <div className="container p-5">Loading...</div>;

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h4 className="mb-3">
            {isEdit ? `Update ${existingDog?.name}` : "Add Dog"}
          </h4>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="card">
              <div className="card-body">
                <form.Field
                  name="name"
                  validators={{
                    onChange: z.string().min(1, "Name is required"),
                  }}
                  children={(field) => (
                    <div className="mb-3">
                      <label className="">Name</label>
                      <input
                        className={`form-control ${field.state.meta.errors.length ? "is-invalid" : ""}`}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                />

                <div className="row mb-3">
                  <form.Field
                    name="gender"
                    children={(field) => (
                      <div className="col-md-6">
                        <label className="">Gender</label>
                        <select
                          className="form-control form-select"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    )}
                  />

                  <form.Field
                    name="hdbApproved"
                    children={(field) => (
                      <div className="col-md-6">
                        <label className="">HDB Approved</label>
                        <select
                          className="form-control form-select"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    )}
                  />
                </div>

                <form.Field
                  name="birthday"
                  children={(field) => (
                    <div className="mb-3">
                      <label className="">Birthday</label>
                      <input
                        className="form-control"
                        placeholder="YYYY-MM-DD"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                />

                <form.Field
                  name="welfareGroupId"
                  validators={{
                    onChange: z.string().min(1, "Welfare Group is required"),
                  }}
                  children={(field) => (
                    <div className="mb-3">
                      <label className="form-label">Welfare Group</label>
                      <select
                        className={`form-control form-select ${
                          field.state.meta.errors.length ? "is-invalid" : ""
                        }`}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      >
                        <option value="">Select a Group...</option>
                        {welfareGroups.map((group) => (
                          <option key={group._id} value={group._id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                />

                <form.Field
                  name="image"
                  children={(field) => (
                    <div className="mb-4">
                      <label className="">Image</label>
                      {existingDog?.imageUrl && (
                        <div className="mb-2">
                          <img
                            src={existingDog.imageUrl}
                            className="rounded"
                            style={{
                              width: 120,
                              height: 120,
                              objectFit: "cover",
                            }}
                            alt="Dog"
                          />
                          <p className="text-muted small mt-1">
                            Leave blank to keep current
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) =>
                          field.handleChange(e.target.files?.[0] || null)
                        }
                      />
                    </div>
                  )}
                />

                <form.Subscribe
                  selector={(state) => [state.canSubmit]}
                  children={([canSubmit]) => (
                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={!canSubmit || isPending}
                      >
                        {isPending ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Saving...
                          </>
                        ) : isEdit ? (
                          "Save"
                        ) : (
                          "Add"
                        )}
                      </button>

                      {isEdit && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          disabled={isPending || isDeleting}
                          onClick={async () => {
                            if (
                              confirm(
                                `Are you sure you want to delete ${existingDog?.name}?`
                              )
                            ) {
                              await deleteDog(dogId);
                            }
                          }}
                        >
                          {isDeleting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Deleting...
                            </>
                          ) : (
                            "DELETE DOG"
                          )}
                        </button>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
