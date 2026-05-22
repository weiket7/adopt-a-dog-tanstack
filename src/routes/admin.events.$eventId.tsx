import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { useMutation } from "@tanstack/react-query";
import { deleteEventAction, saveEventAction } from "~/server/event.functions";
import { api } from "convex/_generated/api";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { FieldError } from "~/components/FieldError";

export const Route = createFileRoute("/admin/events/$eventId")({
  component: EventFormPage,
});

function EventFormPage() {
  const { eventId } = Route.useParams();
  const router = useRouter();

  const isEdit = eventId !== "add";

  const existingEvent = useQuery(
    api.events.get,
    isEdit ? { id: eventId as any } : "skip"
  );

  const { mutate: deleteEvent, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      return await deleteEventAction({ data: id });
    },
    onSuccess: () => {
      router.invalidate().then(() => {
        router.navigate({ to: "/admin/events" });
      });
    },
  });

  const { mutate: upsertEvent, isPending } = useMutation({
    mutationFn: async (variables: FormData) => {
      return await saveEventAction({ data: variables });
    },
    onSuccess: () => {
      router.invalidate().then(() => {
        router.navigate({ to: "/admin/events" });
      });
    },
    onError: (error) => {
      console.error("Submission Error:", error);
      alert("Submission failed. Check console for details.");
    },
  });

  const form = useForm({
    defaultValues: {
      name: existingEvent?.name || "",
      location: existingEvent?.location || "",
      image: existingEvent?.image || "",
      dateTime: existingEvent?.dateTime || "",
      link: existingEvent?.link || "",
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("name", value.name);
      formData.append("location", value.location);
      formData.append("image", value.image);
      formData.append("dateTime", value.dateTime);
      formData.append("link", value.link);
      if (isEdit) formData.append("eventId", eventId);
      upsertEvent(formData);
    },
  });

  if (isEdit && existingEvent === undefined)
    return <div className="container p-5">Loading...</div>;

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h4 className="mb-3">
            {isEdit ? `Update ${existingEvent?.name}` : "Add Event"}
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
                  validators={{ onChange: z.string().min(1, "Name is required") }}
                  children={(field) => (
                    <div className="mb-3">
                      <label>Name</label>
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

                <form.Field
                  name="location"
                  validators={{ onChange: z.string().min(1, "Location is required") }}
                  children={(field) => (
                    <div className="mb-3">
                      <label>Location</label>
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

                <form.Field
                  name="dateTime"
                  validators={{ onChange: z.string().min(1, "Date / time is required") }}
                  children={(field) => (
                    <div className="mb-3">
                      <label>Date / Time</label>
                      <input
                        className={`form-control ${field.state.meta.errors.length ? "is-invalid" : ""}`}
                        placeholder='e.g. "Starts at 4 Apr 2025, 10am"'
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                />

                <form.Field
                  name="image"
                  children={(field) => (
                    <div className="mb-3">
                      <label>Image URL</label>
                      <input
                        className="form-control"
                        placeholder="https://..."
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                />

                <form.Field
                  name="link"
                  children={(field) => (
                    <div className="mb-4">
                      <label>Link</label>
                      <input
                        className="form-control"
                        placeholder="https://..."
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
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
                            if (confirm(`Delete ${existingEvent?.name}?`)) {
                              await deleteEvent(eventId);
                            }
                          }}
                        >
                          {isDeleting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Deleting...
                            </>
                          ) : (
                            "DELETE EVENT"
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
