import { createFileRoute } from "@tanstack/react-router";

const dogRuns = [{}];

export const Route = createFileRoute("/vets")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="row">
      <div className="col">
        <h1>Vets</h1>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Opening Hours</th>
            </tr>
          </thead>
          <tbody>
            {dogRuns.map((x) => (
              <tr></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
