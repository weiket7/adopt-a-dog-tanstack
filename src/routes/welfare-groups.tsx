import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";

export const Route = createFileRoute("/welfare-groups")({
  // This ensures the data is prefetched on the server (SSR)
  loader: async ({ context }) => {
    return await context.queryClient.ensureQueryData(
      convexQuery(api.welfareGroups.list, {})
    );
  },
  pendingComponent: () => <div>Loading welfare groups...</div>,
  component: WelfareGroupsPage,
});

function WelfareGroupsPage() {
  // Use the pre-warmed cache
  // Real-time updates. If a group name changes in the database, it changes on the screen instantly.
  // const { data: groups } = useQuery(convexQuery(api.welfareGroups.list, {}));

  //not real-time. If the data changes in Convex, this component won't update until you refresh the page or navigate away and back.
  const groups = Route.useLoaderData();

  return (
    <>
      <h1>Welfare Groups</h1>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="row g-4">
          {groups?.map((group) => (
            <div key={group._id} className="col-md-6 col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{group.name}</h5>

                  <p className="card-text">
                    {group.email && (
                      <>
                        <i className="fa-regular fa-envelope"></i>&nbsp;
                        <a
                          href={`mailto:${group.email}`}
                          className="text-decoration-none"
                        >
                          {group.email}
                        </a>
                      </>
                    )}
                  </p>

                  <div className="d-flex gap-2 mt-auto">
                    {group.website && (
                      <a
                        href={group.website}
                        target="_blank"
                        className="btn btn-sm btn-outline-primary"
                      >
                        Website
                      </a>
                    )}
                    {group.facebook && (
                      <a
                        href={group.facebook}
                        target="_blank"
                        className="btn btn-sm btn-outline-secondary"
                      >
                        Facebook
                      </a>
                    )}
                    {group.volunteerUrl && (
                      <a
                        href={group.volunteerUrl}
                        target="_blank"
                        className="btn btn-sm btn-primary"
                      >
                        Volunteer
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
