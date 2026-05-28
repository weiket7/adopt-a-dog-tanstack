import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/dog-runs")({
  component: DogRunsPage,
});

const dogRuns = [
  {
    id: 1,
    name: "Bishan-Ang Mo Kio Park Dog Run (It consists of two parts)",
    area: "Central",
    size: "Approximately 240 Sqm",
    description: "",
    address: "453 Ang Mo Kio Ave 1, Singapore 569972",
    openingHours: "24/7",
  },
  {
    id: 2,
    name: "Toa Payoh Dog Run Park",
    area: "Central",
    size: "Approximately 420 Sqm",
    description: "",
    address: "Toa Payoh Lorong 1 near Blk 128.",
    openingHours: "7am - 9pm",
  },
  {
    id: 3,
    name: "Potong Pasir Dog Run",
    area: "Central",
    size: "approximately: 850 Sqm",
    description: "",
    address: "Potong Pasir Ave 3, S357682",
    openingHours: null,
  },
  {
    id: 4,
    name: "Tiong Bahru Dog Run Park",
    area: "Central",
    size: "approximately 2,100 Sqm",
    description: "",
    address: "1 Henderson Rd, Singapore 15956",
    openingHours: null,
  },
  {
    id: 5,
    name: "East Coast Dog Run Park",
    area: "East",
    size: "Approximately 400 square meters",
    description: "",
    address: "Parkland Green, East Coast Park Service Rd, Singapore 449875",
    openingHours: null,
  },
  {
    id: 6,
    name: "Bedok Town Park Dog Run",
    area: "East",
    size: "Approximately 500–600 square meters",
    description: "",
    address: "* Bedok Town Park, along Bedok North Road.",
    openingHours: "Open 24 hours daily",
  },
  {
    id: 7,
    name: "Pasir Ris Park Dog Run",
    area: "East",
    size: "~ Approximately 800 sqm",
    description: "",
    address: "125 Pasir Ris Rd (Near Carpark E).",
    openingHours: "24/7",
  },
  {
    id: 8,
    name: "Telok Kurau Dog Run",
    area: "East",
    size: "~ Approximately 400–500 Sqm",
    description: "",
    address:
      "Telok Kurau Park, located at the junction of Telok Kurau Lorong N and Lorong M.",
    openingHours: "24/7",
  },
  {
    id: 9,
    name: "Tampines Boulevard Park Dog Run",
    area: "East",
    size: "Approximately 1,200 sqm",
    description: "",
    address: "Along Tampines Ave 12.",
    openingHours: "24/7",
  },
  {
    id: 10,
    name: "Katong Park Dog Run Park",
    area: "East",
    size: "Approximately 150 sqm (Small/Cozy)",
    description: "",
    address: "Junction of Meyer Road and Fort Road.",
    openingHours: "24/7 (Lights until 10 PM)",
  },
  {
    id: 11,
    name: "Lengkong Enam Interim Park Dog Run",
    area: "East",
    size: "Approximately 1,000 sqm",
    description: "",
    address: "Along Jalan Selamat and Lengkong Tujuh.",
    openingHours: "24/7",
  },
  {
    id: 12,
    name: "Mariam Way Dog Run Park",
    area: "East",
    size: "Approximately 300 sqm",
    description: "",
    address: "Mariam Way Playground.",
    openingHours: "24/7",
  },
  {
    id: 13,
    name: "Opera Estate Dog Run",
    area: "East",
    size: "Approximately 300–400 Sqm",
    description: "",
    address:
      "Located at Opera Estate Football Field, along Swan Lake Avenue (near the junction of Fidelio Street), Singapore 455707.",
    openingHours: "Open 24 hours daily",
  },
  {
    id: 14,
    name: "Koon Seng Park Dog Run",
    area: "East",
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
    area: "East",
    size: "Approximately 300–400 Sqm",
    description: "",
    address:
      "Located at the junction of Guillemard Road and Lorong 22 Geylang (opposite the former Guillemard Camp area).",
    openingHours: "Open 24 hours daily",
  },
  {
    id: 16,
    name: "Sembawang Dog Run Park",
    area: "North",
    size: "Approximately 2,700 sqm",
    description: "",
    address: "Northern end of Sembawang Road.",
    openingHours: "24/7 (No dedicated lighting)",
  },
  {
    id: 17,
    name: "Yishun Park Dog Run",
    area: "North",
    size: "Approximately 500 sqm",
    description: "",
    address: "Yishun Central (Opposite Adora Green). Hours: 24/7.",
    openingHours: null,
  },
  {
    id: 18,
    name: "Punggol Waterway Park Dog Run",
    area: "North-East",
    size: "Approximately 500 sqm",
    description: "",
    address: "Sentul Crescent. Hours: 24/7.",
    openingHours: null,
  },
  {
    id: 19,
    name: "Rivervale Dog Run (Sengkang)",
    area: "North-East",
    size: "Approximately 450 sqm",
    description: "",
    address: "Near Block 178 Rivervale Crescent. Hours: 7:00 AM – 10:00 PM.",
    openingHours: null,
  },
  {
    id: 20,
    name: "Woodlands Waterfront Dog Run",
    area: "North",
    size: "Approximately 600 sqm",
    description: "",
    address: "Admiralty Road West. Hours: 24/7.",
    openingHours: null,
  },
  {
    id: 21,
    name: "K9 Park @ NEX (Mall Dog Run)",
    area: "North-East",
    size: "Approximately 180 sqm",
    description: "",
    address: "23 Serangoon Central, NEX Level 4R",
    openingHours: "10:30 AM – 10:30 PM",
  },
  {
    id: 22,
    name: "Sun Plaza Park Dog Run",
    area: "East",
    size: "Approximately 600 sqm",
    description: "",
    address:
      "Tampines Avenue 7 and Tampines Avenue 9, Singapore 520558. (The dog run is situated closer to the Tampines Regional Library and the Tampines Eco Green entrance side of the park).",
    openingHours: "24/7",
  },
  {
    id: 23,
    name: "West Coast Park Dog Run",
    area: "West",
    size: "Massive (Part of the 50-hectare park)",
    description: "",
    address: "Parallel to West Coast Highway (Near Carpark 1).",
    openingHours: "24/7 (Lights until 7 PM)",
  },
  {
    id: 24,
    name: "Clementi Woods Park Dog Run",
    area: "West",
    size: "Approximately 4,000 sqm",
    description: "",
    address: "152 West Coast Road (next to West Coast Plaza).",
    openingHours: "24/7 (Lights until 7 AM)",
  },
  {
    id: 25,
    name: "Jurong Lake Gardens Dog Run",
    area: "West",
    size: "Approximately 2,200 sqm",
    description: "",
    address: "104 Yuan Ching Road.",
    openingHours: "8:00 AM – 10:00 PM",
  },
  {
    id: 26,
    name: "Bukit Gombak Park Dog Run",
    area: "West",
    size: "Approximately 400 sqm",
    description: "",
    address: "Bukit Batok West Ave 5.",
    openingHours: "24/7",
  },
  {
    id: 27,
    name: "Villa Verde Park Dog Run",
    area: "West",
    size: "Approximately 400-500 Sqm",
    description: "",
    address:
      "Located within Villa Verde Park, at the end of Verde View, Singapore 688644 (along the Pang Sua Park Connector)",
    openingHours: "Open 24 hours daily",
  },
];

const RUN_AREAS = ["Central", "East", "North", "North-East", "West"] as const;

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

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

type Run = (typeof dogRuns)[number];

const GALLERY_OFFSETS = [0, 13, 27, 41, 55];

function runGalleryUrls(run: Run): string[] {
  const base = 300 + run.id;
  return GALLERY_OFFSETS.map(
    (o) => `https://placedog.net/1200/800?id=${base + o}`,
  );
}

function DogRunCard({
  run,
  onOpenGallery,
}: {
  run: Run;
  onOpenGallery: (run: Run) => void;
}) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <article className="run-card">
      <button
        type="button"
        className="run-photo"
        onClick={() => onOpenGallery(run)}
        aria-label={`Open photo gallery for ${run.name}`}
      >
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
        <span className="run-gallery-badge" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="14" height="14" rx="2" />
            <path d="M7 21h12a2 2 0 0 0 2-2V9" />
            <path d="m7 13 3-3 4 4" />
          </svg>
          <span>{GALLERY_OFFSETS.length}</span>
        </span>
      </button>
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

function DogRunGallery({ run, onClose }: { run: Run; onClose: () => void }) {
  const images = useMemo(() => runGalleryUrls(run), [run.id]);
  const [idx, setIdx] = useState(0);
  const total = images.length;

  useEffect(() => {
    setIdx(0);
  }, [run.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") setIdx((i) => (i + 1) % total);
      else if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, total]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="gallery-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${run.name} photo gallery`}
    >
      <button
        className="gallery-close"
        onClick={onClose}
        aria-label="Close gallery"
      >
        <CloseIcon />
      </button>
      <div className="gallery-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="gallery-stage">
          <button
            className="gallery-nav prev"
            onClick={() => setIdx((i) => (i - 1 + total) % total)}
            aria-label="Previous photo"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <img
            className="gallery-main"
            src={images[idx]}
            alt={`${run.name} — photo ${idx + 1} of ${total}`}
          />
          <button
            className="gallery-nav next"
            onClick={() => setIdx((i) => (i + 1) % total)}
            aria-label="Next photo"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>
        </div>
        <div className="gallery-foot">
          <div className="gallery-caption">
            <b>{run.name}</b>
            <span>
              {run.address} · {idx + 1} / {total}
            </span>
          </div>
          <div className="gallery-thumbs" role="tablist">
            {images.map((src, i) => (
              <button
                key={i}
                className={`gallery-thumb${i === idx ? " is-active" : ""}`}
                onClick={() => setIdx(i)}
                role="tab"
                aria-selected={i === idx}
                aria-label={`Show photo ${i + 1}`}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DogRunsPage() {
  const [q, setQ] = useState("");
  const [area, setArea] = useState<"all" | (typeof RUN_AREAS)[number]>("all");
  const [galleryRun, setGalleryRun] = useState<Run | null>(null);
  const filtered = dogRuns.filter((r) => {
    if (area !== "all" && r.area !== area) return false;
    if (!q.trim()) return true;
    const qq = q.toLowerCase();
    return (
      r.name.toLowerCase().includes(qq) || r.address.toLowerCase().includes(qq)
    );
  });

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

      <aside className="pitch pitch--mini" aria-label="Vet info correction">
        <div className="pitch-mini-body">
          <svg
            className="pitch-mini-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <span>
            <b>Something off about a run?</b> Gates close, parks get fenced,
            hours shift. If anything here looks wrong, let us know and
            we&rsquo;ll fix it.
          </span>
        </div>
        <a
          className="pitch-button pitch-button--sm"
          href="mailto:vets@homeward.sg?subject=Vet directory — update"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6h16v12H4z" />
            <path d="m4 7 8 6 8-6" />
          </svg>
          Send an update
        </a>
      </aside>

      <div className="runs-controls">
        <div className="search runs-search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by name or area…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div
          className="svc-cats runs-chips"
          role="tablist"
          aria-label="Filter dog runs by area"
        >
          <button
            role="tab"
            aria-selected={area === "all"}
            className={"svc-cat-chip" + (area === "all" ? " active" : "")}
            onClick={() => setArea("all")}
          >
            All
          </button>
          {RUN_AREAS.map((a) => (
            <button
              key={a}
              role="tab"
              aria-selected={area === a}
              className={"svc-cat-chip" + (area === a ? " active" : "")}
              onClick={() => setArea(a)}
            >
              {a}
            </button>
          ))}
        </div>
        <span className="runs-count">
          {filtered.length} {filtered.length === 1 ? "run" : "runs"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty" style={{ padding: "48px 20px" }}>
          <h3
            style={{
              fontFamily: "var(--serif)",
              fontWeight: 500,
              fontSize: 22,
              margin: "0 0 6px",
            }}
          >
            No dog runs here yet
          </h3>
          <p>
            Nothing in {area === "all" ? "this search" : area} matches — try
            another area.
          </p>
        </div>
      ) : (
        <section className="runs-grid">
          {filtered.map((r) => (
            <DogRunCard key={r.id} run={r} onOpenGallery={setGalleryRun} />
          ))}
        </section>
      )}

      {galleryRun && (
        <DogRunGallery run={galleryRun} onClose={() => setGalleryRun(null)} />
      )}
    </main>
  );
}
