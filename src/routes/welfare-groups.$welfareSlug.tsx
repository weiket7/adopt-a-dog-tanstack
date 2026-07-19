import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { toAge } from "~/utils/extensions";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DogDetail } from "~/components/DogDetail";
import { Icon } from "~/components/Icon";

export const Route = createFileRoute("/welfare-groups/$welfareSlug")({
  component: WelfareGroupDogsPage,
  loader: async ({ context: { queryClient }, params }) => {
    const { welfareSlug } = params;
    const group = await queryClient.ensureQueryData(
      convexQuery(api.welfareGroups.getBySlug, { slug: welfareSlug }),
    );
    if (group) {
      await queryClient.ensureQueryData(
        convexQuery(api.dogs.listByWelfareGroup, { welfareGroupId: group._id }),
      );
    }
    return { group };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.group?.name;
    const title = name
      ? `${name} — Adopt A Dog Singapore`
      : "Welfare Group — Adopt A Dog Singapore";
    const description = name
      ? `Dogs available for adoption from ${name} in Singapore.`
      : "Dogs available for adoption from this welfare group in Singapore.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
      ],
    };
  },
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

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
          <Icon.Search />
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
              <Icon.Check /> HDB
            </span>
          )}
        </div>
      </div>
      <div className="card-body">
        <div className="card-name-row">
          <h3 className="card-name">{dog.name}</h3>
          <span className="card-gender">
            {dog.gender === "Male" ? <Icon.Mars /> : <Icon.Venus />}
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
  const { welfareSlug } = Route.useParams();
  const navigate = useNavigate();

  const { data: group } = useSuspenseQuery(
    convexQuery(api.welfareGroups.getBySlug, { slug: welfareSlug }),
  );
  const { data: allDogs } = useSuspenseQuery(
    convexQuery(api.dogs.listByWelfareGroup, { welfareGroupId: group!._id }),
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
              <Icon.Shuffle /> Shuffle
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
