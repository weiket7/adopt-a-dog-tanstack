import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(convexQuery(api.services.listAll, {}));
  },
});

const SERVICE_CATEGORIES = [
  "Artists",
  "Cremation",
  "Pet shops",
  "Animal communication",
  "Pet laundromats",
  "Boarding",
  "Grooming",
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

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function ServiceCard({ service }: { service: any }) {
  return (
    <article className="svc-card">
      <div className="svc-head">
        <span
          className={
            "svc-cat svc-cat--" +
            service.category.toLowerCase().replace(/[^a-z]/g, "")
          }
        >
          {service.category}
        </span>
        {service.priceFrom && service.priceFrom !== "—" && (
          <span className="svc-price">from {service.priceFrom}</span>
        )}
      </div>
      <h3 className="svc-name">{service.name}</h3>
      <p className="svc-blurb">{service.blurb}</p>
      <div className="svc-meta">
        <span>
          <PinIcon /> {service.area}
        </span>
        {service.phone && (
          <span>
            <PhoneIcon /> {service.phone}
          </span>
        )}
      </div>
      {service.website && (
        <a
          className="svc-link"
          href={service.website}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit website
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </a>
      )}
    </article>
  );
}

function ServicesPage() {
  const { data: allServices } = useSuspenseQuery(
    convexQuery(api.services.listAll, {}),
  );
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const list = allServices.filter((s) => {
    if (cat !== "all" && s.category !== cat) return false;
    if (q.trim()) {
      const qq = q.toLowerCase();
      if (
        !s.name.toLowerCase().includes(qq) &&
        !(s.blurb ?? "").toLowerCase().includes(qq) &&
        !(s.area ?? "").toLowerCase().includes(qq) &&
        !s.category.toLowerCase().includes(qq)
      )
        return false;
    }
    return true;
  });

  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>
            Services <em>for the good life.</em>
          </h1>
          <p>
            A small, hand-picked directory of dog-friendly businesses our
            adopters and fosters quietly recommend — from fresh-meal kitchens to
            memorial potters. No paid listings.
          </p>
        </div>
        <div className="stat">
          <b>{allServices.length}</b>
          businesses across {SERVICE_CATEGORIES.length} categories
        </div>
      </header>

      <div className="runs-toolbar">
        <div className="search" style={{ maxWidth: 320 }}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search services…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <span className="runs-count">
          {list.length} {list.length === 1 ? "result" : "results"}
        </span>
      </div>

      <div className="svc-cats" role="tablist" aria-label="Service categories">
        <button
          role="tab"
          aria-selected={cat === "all"}
          className={"svc-cat-chip" + (cat === "all" ? " active" : "")}
          onClick={() => setCat("all")}
        >
          All
        </button>
        {SERVICE_CATEGORIES.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            className={"svc-cat-chip" + (cat === c ? " active" : "")}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="empty" style={{ padding: "48px 20px" }}>
          <h3
            style={{
              fontFamily: "var(--serif)",
              fontWeight: 500,
              fontSize: 22,
              margin: "0 0 6px",
            }}
          >
            Nothing yet
          </h3>
          <p>Try a different search or category.</p>
        </div>
      ) : (
        <section className="svc-grid">
          {list.map((s) => (
            <ServiceCard key={s._id} service={s} />
          ))}
        </section>
      )}
    </main>
  );
}
