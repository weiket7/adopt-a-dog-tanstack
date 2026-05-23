import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Doc } from "convex/_generated/dataModel";

export const Route = createFileRoute("/events")({
  component: EventsPage,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(convexQuery(api.events.list, {}));
  },
});

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

function CalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>
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

function ArrowRightIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7"/>
    </svg>
  );
}

function EventCard({ ev }: { ev: Doc<"events"> }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <article className="event-card">
      <div className="event-banner">
        {imgOk && ev.image ? (
          <img
            src={ev.image}
            alt={ev.name}
            loading="lazy"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="event-placeholder" aria-hidden="true">
            <PawIcon />
          </div>
        )}
        <span className="event-kind">{ev.kind}</span>
        {ev.tag && <span className="event-tag">{ev.tag}</span>}
      </div>
      <div className="event-body">
        <h3 className="event-title">{ev.name}</h3>
        <div className="event-meta">
          <span className="event-meta-row">
            <CalIcon />
            <span>{ev.dateTime}</span>
          </span>
          <span className="event-meta-row">
            <PinIcon />
            <span>{ev.location}</span>
          </span>
        </div>
        <p className="event-short">{ev.short}</p>
        <button className="event-cta">
          {ev.cta || "Learn more"} <ArrowRightIcon />
        </button>
      </div>
    </article>
  );
}

function EventsPage() {
  const { data: events } = useSuspenseQuery(convexQuery(api.events.list, {}));

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>What&rsquo;s on at <em>Homeward.</em></h1>
          <p>
            Adoption drives, fairs, community walks and the occasional vet
            clinic. Everyone&rsquo;s welcome — dogs included.
          </p>
        </div>
        <div className="stat">
          <b>{events.length}</b>
          upcoming events
        </div>
      </header>

      <section className="events-list">
        {events.map((ev) => <EventCard key={ev._id} ev={ev} />)}
      </section>
    </main>
  );
}
