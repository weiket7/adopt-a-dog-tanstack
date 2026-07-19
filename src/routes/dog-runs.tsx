import { createFileRoute } from "@tanstack/react-router";
import { CONTACT_EMAIL } from "~/constants/settings";
import { api } from "convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "~/components/Icon";

export const Route = createFileRoute("/dog-runs")({
  component: DogRunsPage,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(convexQuery(api.dogRuns.listAll, {}));
  },
  head: () => ({
    meta: [
      { title: "Dog Runs — Adopt A Dog Singapore" },
      {
        name: "description",
        content:
          "Find dog runs and off-leash parks across Singapore where your dog can play safely.",
      },
      { property: "og:title", content: "Dog Runs — Adopt A Dog Singapore" },
      {
        property: "og:description",
        content:
          "Find dog runs and off-leash parks across Singapore where your dog can play safely.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

const RUN_AREAS = ["Central", "East", "North", "North-East", "West"] as const;

import type { Doc } from "convex/_generated/dataModel";

type Run = Doc<"dogRuns">;

const GALLERY_OFFSETS = [0, 13, 27, 41, 55];

function runGalleryUrls(run: Run): string[] {
  const base = 300 + run.sortOrder;
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
            <Icon.Paw />
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
            <span>
              <Icon.Pin /> {run.address}
              <a
                className="run-maps-link"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${run.name}, ${run.address}, Singapore`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Maps ↗
              </a>
            </span>
          </span>
          <span>
            <Icon.Clock /> {run.openingHours}
          </span>
        </div>
      </div>
    </article>
  );
}

function DogRunGallery({ run, onClose }: { run: Run; onClose: () => void }) {
  const images = useMemo(() => runGalleryUrls(run), [run._id]);
  const [idx, setIdx] = useState(0);
  const total = images.length;

  useEffect(() => {
    setIdx(0);
  }, [run._id]);

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
        <Icon.Close />
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
  const { data: dogRuns } = useSuspenseQuery(
    convexQuery(api.dogRuns.listAll, {}),
  );
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
          href={`mailto:${CONTACT_EMAIL}?subject=Dog runs update`}
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

      <div className="page-controls">
        <div className="search page-search">
          <Icon.Search />
          <input
            type="text"
            placeholder="Search by name or area…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div
          className="svc-cats page-chips"
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
        <span className="page-count">
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
            <DogRunCard key={r._id} run={r} onOpenGallery={setGalleryRun} />
          ))}
        </section>
      )}

      {galleryRun && (
        <DogRunGallery run={galleryRun} onClose={() => setGalleryRun(null)} />
      )}
    </main>
  );
}
