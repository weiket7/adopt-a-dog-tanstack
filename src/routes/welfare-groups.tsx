import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/welfare-groups")({
  component: WelfareGroupsPage,
});

function WelfareGroupsPage() {
  return (
    <main className="page">
      <header className="page-header" style={{ gridTemplateColumns: "1fr" }}>
        <div>
          <h1>Welfare groups <em>doing the work.</em></h1>
          <p>
            The non-profits, shelters and small collectives rehoming
            Singapore&rsquo;s street and surrendered dogs.
          </p>
        </div>
      </header>
      <div className="page-empty">
        <div className="page-empty-icon">✦</div>
        <h3>Directory coming soon</h3>
        <p>We&rsquo;re compiling a list of trusted welfare groups and shelters.</p>
      </div>
    </main>
  );
}
