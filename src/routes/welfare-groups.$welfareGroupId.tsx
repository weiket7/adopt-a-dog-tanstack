import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { toAge } from "~/utils/extensions";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DogDetail } from "~/components/DogDetail";

export const Route = createFileRoute("/welfare-groups/$welfareGroupId")({
  component: WelfareGroupDogsPage,
  loader: async ({ context: { queryClient }, params }) => {
    const id = params.welfareGroupId as Id<"welfareGroups">;
    await Promise.all([
      queryClient.ensureQueryData(
        convexQuery(api.welfareGroups.getById, { id }),
      ),
      queryClient.ensureQueryData(
        convexQuery(api.dogs.listByWelfareGroup, { welfareGroupId: id }),
      ),
    ]);
  },
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const FINEPRINT = [
  "House-trained, loves long walks at East Coast.",
  "A little shy at first, completely devoted once she trusts you.",
  "Knows sit, stay, paw. Working on 'leave it.'",
  "Best as the only dog in the home.",
  "Great with kids over 8. Calm around babies.",
  "Loves car rides and rolling in fresh laundry.",
  "Needs a patient owner — still learning the world.",
  "Fully vaccinated, sterilised, microchipped.",
  "Currently in foster. Visits by appointment.",
  "Quiet apartment dog. Sleeps through the night.",
  "Cuddles first, eats second. Always.",
  "Walks beautifully on leash. No pulling.",
  "Affectionate with everyone she meets, including the postman.",
  "Would thrive with another playful dog at home.",
  "Senior gentleman looking for a soft sofa.",
  "Recovered from a rough start — now thriving.",
];

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = arr.slice();
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickFine(dogId: string, seed: number): string {
  let hash = seed;
  for (let i = 0; i < dogId.length; i++) {
    hash = (((hash * 31) >>> 0) + dogId.charCodeAt(i)) >>> 0;
  }
  return FINEPRINT[hash % FINEPRINT.length];
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="11"
    height="11"
  >
    <polyline points="4 12 10 18 20 6" />
  </svg>
);
const MarsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="10" cy="14" r="5" />
    <path d="m14.5 9.5 5-5" />
    <path d="M15 4h5v5" />
  </svg>
);
const VenusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="9" r="5" />
    <path d="M12 14v8" />
    <path d="M9 19h6" />
  </svg>
);
const ShuffleIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 3h5v5" />
    <path d="M4 20 21 3" />
    <path d="M21 16v5h-5" />
    <path d="m15 15 6 6" />
    <path d="M4 4l5 5" />
  </svg>
);
/* ------------------------------------------------------------------ */
/* Filters                                                             */
/* ------------------------------------------------------------------ */

function Filters({
  q,
  setQ,
  hdb,
  setHdb,
  gender,
  setGender,
}: {
  q: string;
  setQ: (v: string) => void;
  hdb: boolean;
  setHdb: (v: boolean) => void;
  gender: string;
  setGender: (v: string) => void;
}) {
  return (
    <aside className="filters">
      {/* <div className="filter-eyebrow">Find your match</div> */}

      {/* <div className="filter-group">
        <label className="filter-label" htmlFor="dog-search">
          Search by name
        </label>
        <div className="search">
          <SearchIcon />
          <input
            id="dog-search"
            type="text"
            placeholder="e.g. Mochi, Bruno…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div> */}

      <div className="filter-group">
        <span className="filter-label">HDB approved</span>
        <p className="filter-help">
          Show only dogs that meet HDB&rsquo;s approved breed &amp; size list
          for flat-living.
        </p>
        <button
          type="button"
          className={"toggle-row" + (hdb ? " on" : "")}
          onClick={() => setHdb(!hdb)}
          aria-pressed={hdb}
        >
          <span className="switch" />
          <span>
            <div className="toggle-label">HDB-approved only</div>
            <div className="toggle-sub">
              {hdb ? "Showing flat-friendly dogs" : "Showing all dogs"}
            </div>
          </span>
        </button>
      </div>

      <div className="filter-group">
        <span className="filter-label">Gender</span>
        <div className="seg" role="radiogroup" aria-label="Gender">
          <button
            role="radio"
            aria-pressed={gender === "all"}
            onClick={() => setGender("all")}
          >
            All
          </button>
          <button
            role="radio"
            aria-pressed={gender === "Male"}
            onClick={() => setGender("Male")}
          >
            Male
          </button>
          <button
            role="radio"
            aria-pressed={gender === "Female"}
            onClick={() => setGender("Female")}
          >
            Female
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* DogCard                                                             */
/* ------------------------------------------------------------------ */

function DogCard({ dog, onOpen }: { dog: any; onOpen: (dog: any) => void }) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <article
      className="card"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(dog)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(dog);
        }
      }}
      aria-label={`View ${dog.name}'s profile`}
    >
      <div className="card-photo">
        {dog.imageUrl && imgOk ? (
          <img
            src={dog.imageUrl}
            alt={dog.name}
            loading="lazy"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="placeholder">{dog.name[0].toUpperCase()}</div>
        )}
        <div className="badges">
          {dog.hdbApproved === "Yes" && (
            <span className="badge hdb">
              <CheckIcon /> HDB
            </span>
          )}
        </div>
      </div>
      <div className="card-body">
        <div className="card-name-row">
          <h3 className="card-name">{dog.name}</h3>
          <span className="card-gender">
            {dog.gender === "Male" ? <MarsIcon /> : <VenusIcon />}
            {dog.gender}
          </span>
        </div>
        <div className="card-meta">
          {dog.birthday ? toAge(dog.birthday) : <span>&nbsp;</span>}
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function WelfareGroupDogsPage() {
  const { welfareGroupId } = Route.useParams();
  const id = welfareGroupId as Id<"welfareGroups">;
  const navigate = useNavigate();

  const { data: group } = useSuspenseQuery(
    convexQuery(api.welfareGroups.getById, { id }),
  );
  const { data: allDogs } = useSuspenseQuery(
    convexQuery(api.dogs.listByWelfareGroup, { welfareGroupId: id }),
  );

  const [q, setQ] = useState("");
  const [hdb, setHdb] = useState(false);
  const [gender, setGender] = useState("all");
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e6) + 1);
  const [selectedDog, setSelectedDog] = useState<any>(null);

  const shuffled = useMemo(
    () => seededShuffle(allDogs ?? [], seed),
    [allDogs, seed],
  );

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return shuffled.filter((d) => {
      if (ql && !d.name.toLowerCase().includes(ql)) return false;
      if (hdb && d.hdbApproved !== "Yes") return false;
      if (gender !== "all" && d.gender !== gender) return false;
      return true;
    });
  }, [shuffled, q, hdb, gender]);

  const clearFilters = () => {
    setQ("");
    setHdb(false);
    setGender("all");
  };

  return (
    <main className="page" style={{ position: "relative" }}>
      <header className="header">
        <button
          type="button"
          className="back-link"
          onClick={() => navigate({ to: "/welfare-groups" })}
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
          Back to welfare groups
        </button>
        <div>
          <h1>
            {group?.name ?? "Welfare group"} <em>dogs for adoption.</em>
          </h1>
          <p>
            Browse dogs currently available through {group?.name}. Every dog is
            fully vaccinated, sterilised and waiting for someone patient.
          </p>
        </div>
        <div className="stat">
          <div>
            <b>{allDogs?.length ?? 0}</b> dogs currently in care
          </div>
        </div>
      </header>

      <div className="layout">
        <Filters
          q={q}
          setQ={setQ}
          hdb={hdb}
          setHdb={setHdb}
          gender={gender}
          setGender={setGender}
        />

        <section>
          <div className="results-meta">
            <div className="results-count">
              {filtered.length} {filtered.length === 1 ? "dog" : "dogs"}
              <span> &middot; in random order</span>
            </div>
            <button
              className="shuffle"
              onClick={() => setSeed(Math.floor(Math.random() * 1e6) + 1)}
              title="Shuffle order"
            >
              <ShuffleIcon /> Shuffle
            </button>
          </div>

          <div className="grid">
            {filtered.length === 0 ? (
              <div className="empty">
                <h3>No dogs match those filters</h3>
                <p>
                  Try widening your search &mdash; the right match may not be
                  the one you came in for.
                </p>
                <button onClick={clearFilters}>Clear all filters</button>
              </div>
            ) : (
              filtered.map((dog) => (
                <DogCard key={dog._id} dog={dog} onOpen={setSelectedDog} />
              ))
            )}
          </div>
        </section>
      </div>

      {selectedDog &&
        createPortal(
          <DogDetail dog={selectedDog} onClose={() => setSelectedDog(null)} />,
          document.body,
        )}
    </main>
  );
}
