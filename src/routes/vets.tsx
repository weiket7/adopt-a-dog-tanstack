import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

export const Route = createFileRoute("/vets")({
  component: VetsPage,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(convexQuery(api.vets.listAll, {}));
  },
});

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
    </svg>
  );
}
function BoltIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>;
}
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s7-7 7-13a7 7 0 1 0-14 0c0 6 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>
    </svg>
  );
}

type Filter = "all" | "emergency" | "ph";

function VetCard({ vet }: { vet: any }) {
  return (
    <article className="vet-card">
      <div className="vet-head">
        <span className="vet-area">{vet.area}</span>
        <div className="vet-flags">
          {vet.emergency && (
            <span className="vet-flag emerg" title="24h emergency services">
              <BoltIcon /> Emergency
            </span>
          )}
          {vet.publicHolidays && (
            <span className="vet-flag ph" title="Open on public holidays">
              <SunIcon /> PH open
            </span>
          )}
        </div>
      </div>
      <h3 className="vet-name">{vet.name}</h3>
      <div className="vet-meta">
        <span><PinIcon /> {vet.address}</span>
        <span><ClockIcon /> {vet.hours}</span>
        <span><PhoneIcon /> {vet.phone}</span>
      </div>
    </article>
  );
}

function VetsPage() {
  const { data: allVets } = useSuspenseQuery(convexQuery(api.vets.listAll, {}));
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const list = allVets.filter((v) => {
    if (q.trim()) {
      const qq = q.toLowerCase();
      if (
        !v.name.toLowerCase().includes(qq) &&
        !v.address.toLowerCase().includes(qq) &&
        !v.area.toLowerCase().includes(qq)
      ) return false;
    }
    if (filter === "emergency" && !v.emergency) return false;
    if (filter === "ph" && !v.publicHolidays) return false;
    return true;
  });

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>Our partner <em>vets.</em></h1>
          <p>
            A small directory of clinics our adopters and fosters know and trust.
            Always call ahead, especially after hours.
          </p>
        </div>
        <div className="stat">
          <b>{allVets.length}</b>
          clinics islandwide
        </div>
      </header>

      <div className="runs-toolbar">
        <div className="search" style={{ maxWidth: 320 }}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by name, area…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="seg" role="radiogroup" aria-label="Filter vets" style={{ width: "auto" }}>
          <button role="radio" aria-pressed={filter === "all"}       onClick={() => setFilter("all")}>All</button>
          <button role="radio" aria-pressed={filter === "emergency"} onClick={() => setFilter("emergency")}>24h Emergency</button>
          <button role="radio" aria-pressed={filter === "ph"}        onClick={() => setFilter("ph")}>Open on PH</button>
        </div>
      </div>

      <section className="vets-grid">
        {list.map((v) => <VetCard key={v._id} vet={v} />)}
      </section>
    </main>
  );
}
