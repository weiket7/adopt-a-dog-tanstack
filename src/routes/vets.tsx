import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/vets")({
  component: VetsPage,
});

const vets = [
  { id: 1,  name: "Mount Pleasant Animal Medical Centre",         address: "232 Whitley Rd",                        hours: "Mon–Sat 9am–7pm · Sun 9am–1pm",          phone: "+65 6250 8333", emergency: true,  publicHolidays: false, area: "Central" },
  { id: 2,  name: "Animal Recovery Veterinary Centre",            address: "30 Burn Rd, #01-01",                    hours: "Open 24 hours",                          phone: "+65 6634 1117", emergency: true,  publicHolidays: true,  area: "East" },
  { id: 3,  name: "Beecroft Animal Specialist & Emergency Hospital", address: "5 Burn Rd, #02-01",                  hours: "Open 24 hours",                          phone: "+65 6256 2275", emergency: true,  publicHolidays: true,  area: "East" },
  { id: 4,  name: "The Animal Doctors",                           address: "6 Greenwood Ave",                       hours: "Mon–Fri 10am–8pm · Sat–Sun 10am–6pm",   phone: "+65 6253 1300", emergency: false, publicHolidays: false, area: "North" },
  { id: 5,  name: "The Joyous Vet",                               address: "240 Pasir Panjang Rd",                  hours: "Mon–Sat 10am–8pm · Sun 10am–4pm",        phone: "+65 6873 3622", emergency: false, publicHolidays: true,  area: "West" },
  { id: 6,  name: "Light of Life Veterinary Clinic",              address: "Blk 153 Serangoon North Ave 1",         hours: "Daily 10am–9pm",                         phone: "+65 6286 0030", emergency: false, publicHolidays: true,  area: "Central" },
  { id: 7,  name: "Animal & Avian Veterinary Clinic",             address: "21 Jalan Tua Kong",                     hours: "Mon–Sat 9am–8pm · Sun 9am–5pm",          phone: "+65 6243 3282", emergency: false, publicHolidays: false, area: "East" },
  { id: 8,  name: "The Animal Clinic — Frankel",                  address: "21 Jalan Tua Kong",                     hours: "Mon–Fri 9am–9pm · Sat–Sun 9am–5pm",      phone: "+65 6244 8009", emergency: false, publicHolidays: false, area: "East" },
  { id: 9,  name: "Vet Central",                                  address: "62 Eng Watt St",                        hours: "Mon–Sat 10am–8pm",                       phone: "+65 6224 5754", emergency: false, publicHolidays: false, area: "Central" },
  { id: 10, name: "Allpets & Aqualife Veterinary Clinic",         address: "151 Serangoon North Ave 2",             hours: "Daily 10am–10pm",                        phone: "+65 6280 3833", emergency: false, publicHolidays: true,  area: "North" },
  { id: 11, name: "Companion Animal Surgery",                     address: "162 Bukit Merah Central, #01-3545",     hours: "Mon–Sat 9am–7pm · Sun 9am–1pm",          phone: "+65 6271 8488", emergency: false, publicHolidays: false, area: "South" },
  { id: 12, name: "Pet Hospital 24/7 — Tampines",                 address: "1 Tampines North Drive 1",              hours: "Open 24 hours",                          phone: "+65 6260 7080", emergency: true,  publicHolidays: true,  area: "East" },
];

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>
    </svg>
  );
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

type Vet = typeof vets[number];
type Filter = "all" | "emergency" | "ph";

function VetCard({ vet }: { vet: Vet }) {
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
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const list = vets.filter((v) => {
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
          <b>{vets.length}</b>
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
        {list.map((v) => <VetCard key={v.id} vet={v} />)}
      </section>
    </main>
  );
}
