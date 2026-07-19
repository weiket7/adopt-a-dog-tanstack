import { createFileRoute } from "@tanstack/react-router";
import { CONTACT_EMAIL } from "~/constants/settings";
import { api } from "convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { Icon } from "~/components/Icon";

const SINGAPORE_CENTER = { lat: 1.3521, lng: 103.8198 };

export const Route = createFileRoute("/vets")({
  component: VetsPage,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(convexQuery(api.vets.listAll, {}));
  },
  head: () => ({
    meta: [
      { title: "Vets — Adopt A Dog Singapore" },
      {
        name: "description",
        content:
          "Find veterinary clinics across Singapore, complete with locations, opening hours, and emergency contacts.",
      },
      { property: "og:title", content: "Vets — Adopt A Dog Singapore" },
      {
        property: "og:description",
        content:
          "Find veterinary clinics across Singapore, complete with locations, opening hours, and emergency contacts.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

type Filter = "all" | "emergency" | "ph";

function VetCard({ vet }: { vet: any }) {
  return (
    <article className="vet-card">
      <div className="vet-head">
        <span className="vet-area">{vet.area}</span>
        <div className="vet-flags">
          {vet.emergency && (
            <span className="vet-flag emerg" title={vet.emergency}>
              <Icon.Bolt /> Emergency
            </span>
          )}
          {vet.publicHolidays && (
            <span className="vet-flag ph" title="Open on public holidays">
              <Icon.Sun /> PH open
            </span>
          )}
        </div>
      </div>
      <h3 className="vet-name">{vet.name}</h3>
      <div className="vet-meta">
        <span>
          <Icon.Pin /> {vet.block} {vet.street}, #{vet.floor}-{vet.unit},
          Singapore {vet.postalCode}
        </span>
        {vet.openingHours && (
          <span>
            <Icon.Clock /> {vet.openingHours}
          </span>
        )}
        {vet.phone && (
          <span>
            <Icon.Phone /> {vet.phone}
          </span>
        )}
        <span>
          <Icon.Globe />{" "}
          <a href={vet.website} target="_blank">
            {vet.website}
          </a>
        </span>
      </div>
    </article>
  );
}

function VetsMap({ vets }: { vets: any[] }) {
  const [selected, setSelected] = useState<any>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;
  const located = vets.filter((v) => v.lat != null && v.lng != null);

  if (!apiKey) return null;

  return (
    <div className="vets-map">
      <APIProvider apiKey={apiKey}>
        <Map
          mapId={mapId}
          defaultCenter={SINGAPORE_CENTER}
          defaultZoom={11}
          gestureHandling="greedy"
          disableDefaultUI={false}
          style={{ width: "100%", height: "100%" }}
        >
          {located.map((v) => (
            <AdvancedMarker
              key={v._id}
              position={{ lat: v.lat, lng: v.lng }}
              onClick={() => setSelected(v)}
              title={v.name}
            />
          ))}
          {selected && (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => setSelected(null)}
            >
              <div className="vet-map-info">
                <b>{selected.name}</b>
                <div>
                  {selected.block} {selected.street}, Singapore{" "}
                  {selected.postalCode}
                </div>
                {selected.phone && <div>{selected.phone}</div>}
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
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
        //!v.address.toLowerCase().includes(qq) &&
        !v.area.toLowerCase().includes(qq)
      )
        return false;
    }
    if (filter === "emergency" && !v.emergency) return false;
    if (filter === "ph" && !v.publicHolidays) return false;
    return true;
  });

  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>
            Our partner <em>vets.</em>
          </h1>
          <p>
            A small directory of clinics our adopters and fosters know and
            trust. Always call ahead, especially after hours.
          </p>
        </div>
        <div className="stat">
          <b>{allVets.length}</b>
          clinics islandwide
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
            <b>Spotted something out of date?</b> Vet clinics change hours,
            move, or close. If anything here looks wrong, drop us a line and
            we&rsquo;ll update it.
          </span>
        </div>
        <a
          className="pitch-button pitch-button--sm"
          href={`mailto:${CONTACT_EMAIL}?subject=Vets update`}
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

      <VetsMap vets={list} />

      <div className="page-controls">
        <div className="search" style={{ maxWidth: 320 }}>
          <Icon.Search />
          <input
            type="text"
            placeholder="Search by name, area…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div
          className="seg"
          role="radiogroup"
          aria-label="Filter vets"
          style={{ width: "auto" }}
        >
          <button
            role="radio"
            aria-pressed={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            role="radio"
            aria-pressed={filter === "emergency"}
            onClick={() => setFilter("emergency")}
          >
            24h Emergency
          </button>
          <button
            role="radio"
            aria-pressed={filter === "ph"}
            onClick={() => setFilter("ph")}
          >
            Open on PH
          </button>
        </div>
        <span className="page-count">
          {list.length} {list.length === 1 ? "result" : "results"}
        </span>
      </div>

      <section className="vets-grid">
        {list.map((v) => (
          <VetCard key={v._id} vet={v} />
        ))}
      </section>
    </main>
  );
}
