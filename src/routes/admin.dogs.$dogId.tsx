import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import { saveDogAction } from "~/funcs/dog-actions";
import { api } from "convex/_generated/api";

export const Route = createFileRoute("/admin/dogs/$dogId")({
  component: DogFormPage,
});

function DogFormPage() {
  const { dogId } = Route.useParams();
  const router = useRouter();

  const isEdit = dogId !== "add";
  // Fetch existing data if we have an ID
  const existingDog = useQuery(
    api.dogs.get,
    isEdit ? { id: dogId as any } : "skip"
  );

  console.log(existingDog);

  // Use TanStack Query's useMutation to wrap the Server Function
  const { mutate, isPending } = useMutation<
    { success: boolean },
    Error,
    FormData
  >({
    // 2. Variables here is now correctly inferred as FormData
    mutationFn: async (variables) => {
      return saveDogAction({ data: variables });
    },
    onSuccess: () => {
      router.invalidate().then(() => {
        router.navigate({ to: "/" });
      });
    },
    onError: (error) => {
      // This will tell you if it's a 500 error or a network issue
      console.error("Submission Error:", error);
      alert("Submission failed. Check console for details.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Append context metadata for the server function
    if (dogId) formData.append("dogId", dogId);
    if (existingDog?.imageStorageId)
      formData.append("existingStorageId", existingDog.imageStorageId);

    mutate(formData);
  };

  if (isEdit && existingDog === undefined)
    return <div className="container p-5">Loading...</div>;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="font-weight-bold mb-4">
            {isEdit ? `Update ${existingDog?.name}` : "Register New Dog"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="card shadow-sm border-0 p-4">
              <div className="mb-3">
                <label className="form-label font-weight-bold">Name</label>
                <input
                  name="name"
                  className="form-control"
                  defaultValue={existingDog?.name}
                  required
                />
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label font-weight-bold">Gender</label>
                  <select
                    name="gender"
                    className="form-select"
                    defaultValue={existingDog?.gender || "Male"}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label font-weight-bold">
                    HDB Approved
                  </label>
                  <select
                    name="hdb-approved"
                    className="form-select"
                    defaultValue={existingDog?.hdbApproved || "Yes"}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label font-weight-bold">Birthday</label>
                <input
                  name="birthday"
                  className="form-control"
                  defaultValue={existingDog?.birthday}
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <div className="mb-4">
                <label className="form-label font-weight-bold">Image</label>
                {existingDog?.imageUrl && (
                  <div className="mb-2">
                    <img
                      src={existingDog.imageUrl}
                      className="rounded"
                      style={{ width: 120, height: 120, objectFit: "cover" }}
                      alt="Dog"
                    />
                    <p className="text-muted small mt-1">
                      Leave blank to keep current image
                    </p>
                  </div>
                )}
                <input
                  name="image"
                  type="file"
                  className="form-control"
                  accept="image/*"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : isEdit ? (
                  "SAVE CHANGES"
                ) : (
                  "ADD DOG"
                )}
              </button>
              {isEdit && (
                <button
                  type="button"
                  className="btn btn-danger btn-lg"
                  disabled={isPending}
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this dog?")) {
                      // Call your delete function here, e.g.:
                      // deleteDogAction(dogId);
                      alert("Delete functionality not implemented yet.");
                    }
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
