import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/dog-runs")({
  component: DogRunsPage,
});

const dogRuns = [
  {
    id: 1,
    name: "Bishan-Ang Mo Kio Park Dog Run (It consists of two parts)",
    region: "Central & South",
    size: "Approximately 240 Sqm",
    description: "",
    address: "453 Ang Mo Kio Ave 1, Singapore 569972",
    openingHours: "24/7",
  },
  {
    id: 2,
    name: "Toa Payoh Dog Run Park",
    region: "Central & South",
    size: "Approximately 420 Sqm",
    description: "",
    address: "Toa Payoh Lorong 1 near Blk 128.",
    openingHours: "7am - 9pm",
  },
  {
    id: 3,
    name: "Potong Pasir Dog Run",
    region: "Central & South",
    size: "approximately: 850 Sqm",
    description: "",
    address: "Potong Pasir Ave 3, S357682",
    openingHours: null,
  },
  {
    id: 4,
    name: "Tiong Bahru Dog Run Park",
    region: "Central & South",
    size: "approximately 2,100 Sqm",
    description: "",
    address: "1 Henderson Rd, Singapore 15956",
    openingHours: null,
  },
  {
    id: 5,
    name: "East Coast Dog Run Park",
    region: "East",
    size: "Approximately 400 square meters",
    description: "",
    address: "Parkland Green, East Coast Park Service Rd, Singapore 449875",
    openingHours: null,
  },
  {
    id: 6,
    name: "Bedok Town Park Dog Run",
    region: "East",
    size: "Approximately 500–600 square meters",
    description: "",
    address: "* Bedok Town Park, along Bedok North Road.",
    openingHours: "Open 24 hours daily",
  },
  {
    id: 7,
    name: "Pasir Ris Park Dog Run",
    region: "East",
    size: "~ Approximately 800 sqm",
    description: "",
    address: "125 Pasir Ris Rd (Near Carpark E).",
    openingHours: "24/7",
  },
  {
    id: 8,
    name: "Telok Kurau Dog Run",
    region: "East",
    size: "~ Approximately 400–500 Sqm",
    description: "",
    address:
      "Telok Kurau Park, located at the junction of Telok Kurau Lorong N and Lorong M.",
    openingHours: "24/7",
  },
  {
    id: 9,
    name: "Tampines Boulevard Park Dog Run",
    region: "East",
    size: "Approximately 1,200 sqm",
    description: "",
    address: "Along Tampines Ave 12.",
    openingHours: "24/7",
  },
  {
    id: 10,
    name: "Katong Park Dog Run Park",
    region: "East",
    size: "Approximately 150 sqm (Small/Cozy)",
    description: "",
    address: "Junction of Meyer Road and Fort Road.",
    openingHours: "24/7 (Lights until 10 PM)",
  },
  {
    id: 11,
    name: "Lengkong Enam Interim Park Dog Run",
    region: "East",
    size: "Approximately 1,000 sqm",
    description: "",
    address: "Along Jalan Selamat and Lengkong Tujuh.",
    openingHours: "24/7",
  },
  {
    id: 12,
    name: "Mariam Way Dog Run Park",
    region: "East",
    size: "Approximately 300 sqm",
    description: "",
    address: "Mariam Way Playground.",
    openingHours: "24/7",
  },
  {
    id: 13,
    name: "Opera Estate Dog Run",
    region: "East",
    size: "Approximately 300–400 Sqm",
    description: "",
    address:
      "Located at Opera Estate Football Field, along Swan Lake Avenue (near the junction of Fidelio Street), Singapore 455707.",
    openingHours: "Open 24 hours daily",
  },
  {
    id: 14,
    name: "Koon Seng Park Dog Run",
    region: "East",
    size: "Approximately 250-300 Sqm",
    description: "",
    address:
      "Located within Koon Seng Park, at the junction of Koon Seng Road and Joo Chiat Lane, Singapore 427013.",
    openingHours: "Open 24 hours daily",
    image: "koon-seng.png",
  },
  {
    id: 15,
    name: "Guillemard Road Open Space Dog Run",
    region: "East",
    size: "Approximately 300–400 Sqm",
    description: "",
    address:
      "Located at the junction of Guillemard Road and Lorong 22 Geylang (opposite the former Guillemard Camp area).",
    openingHours: "Open 24 hours daily",
  },
  {
    id: 16,
    name: "Sembawang Dog Run Park",
    region: "North & North East",
    size: "Approximately 2,700 sqm",
    description: "",
    address: "Northern end of Sembawang Road.",
    openingHours: "24/7 (No dedicated lighting)",
  },
  {
    id: 17,
    name: "Yishun Park Dog Run",
    region: "North & North East",
    size: "Approximately 500 sqm",
    description: "",
    address: "Yishun Central (Opposite Adora Green). Hours: 24/7.",
    openingHours: null,
  },
  {
    id: 18,
    name: "Punggol Waterway Park Dog Run",
    region: "North & North East",
    size: "Approximately 500 sqm",
    description: "",
    address: "Sentul Crescent. Hours: 24/7.",
    openingHours: null,
  },
  {
    id: 19,
    name: "Rivervale Dog Run (Sengkang)",
    region: "North & North East",
    size: "Approximately 450 sqm",
    description: "",
    address: "Near Block 178 Rivervale Crescent. Hours: 7:00 AM – 10:00 PM.",
    openingHours: null,
  },
  {
    id: 20,
    name: "Woodlands Waterfront Dog Run",
    region: "North & North East",
    size: "Approximately 600 sqm",
    description: "",
    address: "Admiralty Road West. Hours: 24/7.",
    openingHours: null,
  },
  {
    id: 21,
    name: "K9 Park @ NEX (Mall Dog Run)",
    region: "North & North East",
    size: "Approximately 180 sqm",
    description: "",
    address: "23 Serangoon Central, NEX Level 4R",
    openingHours: "10:30 AM – 10:30 PM",
  },
  {
    id: 22,
    name: "Sun Plaza Park Dog Run",
    region: "North & North East",
    size: "Approximately 600 sqm",
    description: "",
    address:
      "Tampines Avenue 7 and Tampines Avenue 9, Singapore 520558. (The dog run is situated closer to the Tampines Regional Library and the Tampines Eco Green entrance side of the park).",
    openingHours: "24/7",
  },
  {
    id: 23,
    name: "West Coast Park Dog Run",
    region: "West",
    size: "Massive (Part of the 50-hectare park)",
    description: "",
    address: "Parallel to West Coast Highway (Near Carpark 1).",
    openingHours: "24/7 (Lights until 7 PM)",
  },
  {
    id: 24,
    name: "Clementi Woods Park Dog Run",
    region: "West",
    size: "Approximately 4,000 sqm",
    description: "",
    address: "152 West Coast Road (next to West Coast Plaza).",
    openingHours: "24/7 (Lights until 7 AM)",
  },
  {
    id: 25,
    name: "Jurong Lake Gardens Dog Run",
    region: "West",
    size: "Approximately 2,200 sqm",
    description: "",
    address: "104 Yuan Ching Road.",
    openingHours: "8:00 AM – 10:00 PM",
  },
  {
    id: 26,
    name: "Bukit Gombak Park Dog Run",
    region: "West",
    size: "Approximately 400 sqm",
    description: "",
    address: "Bukit Batok West Ave 5.",
    openingHours: "24/7",
  },
  {
    id: 27,
    name: "Villa Verde Park Dog Run",
    region: "West",
    size: "Approximately 400-500 Sqm",
    description: "",
    address:
      "Located within Villa Verde Park, at the end of Verde View, Singapore 688644 (along the Pang Sua Park Connector)",
    openingHours: "Open 24 hours daily",
  },
];

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function PawIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="6" cy="10" rx="2" ry="2.6" />
      <ellipse cx="10" cy="6.5" rx="2" ry="2.6" />
      <ellipse cx="14" cy="6.5" rx="2" ry="2.6" />
      <ellipse cx="18" cy="10" rx="2" ry="2.6" />
      <path d="M12 12c-3 0-5.5 2.4-5.5 5 0 1.8 1.3 3 3 3 1 0 1.7-.5 2.5-.5s1.5.5 2.5.5c1.7 0 3-1.2 3-3 0-2.6-2.5-5-5.5-5z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s7-7 7-13a7 7 0 1 0-14 0c0 6 7 13 7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

type Run = (typeof dogRuns)[number];

function DogRunCard({ run }: { run: Run }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <article className="run-card">
      <div className="run-photo">
        {run.image && imgOk ? (
          <img
            src={`/dog-runs/${run.image}`}
            alt={run.name}
            loading="lazy"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="run-placeholder">
            <PawIcon />
          </div>
        )}
        <span className="run-size">{run.size}</span>
      </div>
      <div className="run-body">
        <h3 className="run-name">{run.name}</h3>
        <div className="run-meta">
          <span>
            <PinIcon /> {run.address}
          </span>
          <span>
            <ClockIcon /> {run.openingHours}
          </span>
        </div>
      </div>
    </article>
  );
}

function DogRunsPage() {
  const [q, setQ] = useState("");
  const filtered = dogRuns.filter(
    (r) =>
      !q.trim() ||
      r.name.toLowerCase().includes(q.toLowerCase()) ||
      r.address.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>
            Dog runs <em>around Singapore.</em>
          </h1>
          <p>
            A growing list of fenced spaces where your dog can stretch their
            legs and meet some friends. Hours and sizes are a rough guide — do
            check NParks for the latest.
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
        {filtered.map((r) => (
          <DogRunCard key={r.id} run={r} />
        ))}
      </section>
    </main>
  );
}
