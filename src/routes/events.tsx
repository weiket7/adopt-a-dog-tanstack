import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/events")({
  component: EventsPage,
});

const events = [
  {
    id: 1,
    title: "Spring Adoption Drive",
    kind: "Adoption",
    banner: "https://placedog.net/1200/600?id=200",
    location: "Bishan Park Pavilion, Hall A",
    dateLine: "5 Apr 2026 to 6 Apr 2026, 8am to 9pm daily",
    short: "Meet 30+ rescue dogs over one weekend. On-site adoption counsellors, free goodie bags, and a quiet room for shy doggos to mingle slowly with prospective families.",
    cta: "Reserve a slot",
    tag: "Featured",
  },
  {
    id: 2,
    title: "Homeward Annual Pet Fair",
    kind: "Pet Fair",
    banner: "https://placedog.net/1200/600?id=210",
    location: "Suntec Convention Hall 401",
    dateLine: "17 May 2026, 10am to 7pm",
    short: "Our biggest day of the year. 40+ small businesses, vet talks, training demos, paw-print art for the kids, and a live shelter dog showcase every hour on the hour.",
    cta: "Get tickets",
    tag: null,
  },
  {
    id: 3,
    title: "Microchip & Vaccination Day",
    kind: "Clinic",
    banner: "https://placedog.net/1200/600?id=220",
    location: "Mt Pleasant Vet, Whitley Road",
    dateLine: "22 Jun 2026, 9am to 1pm",
    short: "Subsidised microchipping ($15) and core vaccinations ($40) for adopted dogs and Singapore Specials. By appointment — limited to 60 slots.",
    cta: "Book a slot",
    tag: null,
  },
  {
    id: 4,
    title: "Sunset Sembawang Walk",
    kind: "Community",
    banner: "https://placedog.net/1200/600?id=230",
    location: "Sembawang Park Boardwalk",
    dateLine: "12 Jul 2026, 5pm to 7pm",
    short: "A monthly community walk for adopters, fosters and curious dog-lovers. Bring water, bring your dog, bring a friend who's been thinking about adopting.",
    cta: "RSVP",
    tag: null,
  },
  {
    id: 5,
    title: "Senior Dogs Meet & Greet",
    kind: "Adoption",
    banner: "https://placedog.net/1200/600?id=240",
    location: "Homeward Shelter, Sembawang",
    dateLine: "3 Aug 2026 to 4 Aug 2026, 11am to 5pm daily",
    short: "Eight of our older residents need quiet homes for their best years yet. Drop by for a slow afternoon, a cup of tea, and the company of a very good old dog.",
    cta: "Plan your visit",
    tag: null,
  },
  {
    id: 6,
    title: "Foster Carer Workshop",
    kind: "Training",
    banner: "https://placedog.net/1200/600?id=250",
    location: "Homeward Shelter, Sembawang",
    dateLine: "14 Sep 2026, 2pm to 5pm",
    short: "Considering becoming a foster carer? Spend an afternoon with our team learning the basics — feeding, decompression, vet visits, and how to say goodbye.",
    cta: "Sign up free",
    tag: null,
  },
];

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

type Event = typeof events[number];

function EventCard({ ev }: { ev: Event }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <article className="event-card">
      <div className="event-banner">
        {imgOk ? (
          <img
            src={ev.banner}
            alt={ev.title}
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
        <h3 className="event-title">{ev.title}</h3>
        <div className="event-meta">
          <span className="event-meta-row">
            <CalIcon />
            <span>{ev.dateLine}</span>
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
        {events.map((ev) => <EventCard key={ev.id} ev={ev} />)}
      </section>
    </main>
  );
}
