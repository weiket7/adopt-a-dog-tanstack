import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/dog-runs")({
  component: DogRunsPage,
});

const dogRuns = [
  { id: 1,  name: "Bishan-Ang Mo Kio Dog Run",      address: "1382 Ang Mo Kio Ave 1",              hours: "Open 24 hours",       image: "https://placedog.net/600/400?id=301", size: "Large" },
  { id: 2,  name: "West Coast Park Dog Run",         address: "West Coast Ferry Rd",                hours: "Open 24 hours",       image: "https://placedog.net/600/400?id=302", size: "Large" },
  { id: 3,  name: "Tampines Eco Green Dog Run",      address: "Tampines Ave 12",                    hours: "7am – 7pm daily",     image: "https://placedog.net/600/400?id=303", size: "Medium" },
  { id: 4,  name: "Katong Park Dog Run",             address: "Meyer Rd, Katong",                   hours: "Open 24 hours",       image: "https://placedog.net/600/400?id=304", size: "Small" },
  { id: 5,  name: "Punggol Promenade Dog Run",       address: "Punggol Pt Walk",                    hours: "Open 24 hours",       image: "https://placedog.net/600/400?id=305", size: "Medium" },
  { id: 6,  name: "Tiong Bahru Park Dog Run",        address: "Henderson Rd, Tiong Bahru",          hours: "5am – 11pm daily",    image: "https://placedog.net/600/400?id=306", size: "Medium" },
  { id: 7,  name: "Jurong Lake Gardens Dog Run",     address: "Yuan Ching Rd, Jurong",              hours: "Open 24 hours",       image: "https://placedog.net/600/400?id=307", size: "Large" },
  { id: 8,  name: "Bedok Reservoir Dog Run",         address: "Bedok Reservoir Rd",                 hours: "Open 24 hours",       image: "https://placedog.net/600/400?id=308", size: "Medium" },
  { id: 9,  name: "Sengkang Riverside Dog Run",      address: "Anchorvale St, Sengkang",            hours: "Open 24 hours",       image: "https://placedog.net/600/400?id=309", size: "Small" },
  { id: 10, name: "Pasir Ris Central Dog Run",       address: "Pasir Ris Central, Blk 738",         hours: "6am – 10pm daily",    image: "https://placedog.net/600/400?id=310", size: "Small" },
  { id: 11, name: "East Coast Park Dog Run",         address: "East Coast Park, Area E",            hours: "Open 24 hours",       image: "https://placedog.net/600/400?id=311", size: "Large" },
  { id: 12, name: "Hong Lim Park Dog Run",           address: "Upper Pickering St",                 hours: "5am – 11pm daily",    image: "https://placedog.net/600/400?id=312", size: "Small" },
];

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
    </svg>
  );
}

function PawIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="6"  cy="10" rx="2"  ry="2.6"/>
      <ellipse cx="10" cy="6.5" rx="2" ry="2.6"/>
      <ellipse cx="14" cy="6.5" rx="2" ry="2.6"/>
      <ellipse cx="18" cy="10" rx="2"  ry="2.6"/>
      <path d="M12 12c-3 0-5.5 2.4-5.5 5 0 1.8 1.3 3 3 3 1 0 1.7-.5 2.5-.5s1.5.5 2.5.5c1.7 0 3-1.2 3-3 0-2.6-2.5-5-5.5-5z"/>
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

type Run = typeof dogRuns[number];

function DogRunCard({ run }: { run: Run }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <article className="run-card">
      <div className="run-photo">
        {imgOk ? (
          <img src={run.image} alt={run.name} loading="lazy" onError={() => setImgOk(false)} />
        ) : (
          <div className="run-placeholder"><PawIcon /></div>
        )}
        <span className="run-size">{run.size}</span>
      </div>
      <div className="run-body">
        <h3 className="run-name">{run.name}</h3>
        <div className="run-meta">
          <span><PinIcon /> {run.address}</span>
          <span><ClockIcon /> {run.hours}</span>
        </div>
      </div>
    </article>
  );
}

function DogRunsPage() {
  const [q, setQ] = useState("");
  const filtered = dogRuns.filter((r) =>
    !q.trim() ||
    r.name.toLowerCase().includes(q.toLowerCase()) ||
    r.address.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>Dog runs <em>around Singapore.</em></h1>
          <p>
            A growing list of fenced spaces where your dog can stretch their legs
            and meet some friends. Hours and sizes are a rough guide — do check
            NParks for the latest.
          </p>
        </div>
        <div className="stat">
          <b>{dogRuns.length}</b>
          dog runs island-wide
        </div>
      </header>

      <div className="runs-toolbar">
        <div className="search" style={{ maxWidth: 360 }}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by name or area…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <span className="runs-count">
          {filtered.length} {filtered.length === 1 ? "run" : "runs"}
        </span>
      </div>

      <section className="runs-grid">
        {filtered.map((r) => <DogRunCard key={r.id} run={r} />)}
      </section>
    </main>
  );
}
