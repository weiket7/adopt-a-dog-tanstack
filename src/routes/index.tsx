import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { toAge } from "~/utils/extensions";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DogDetail } from "~/components/DogDetail";
import { Icon } from "~/components/Icon";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(convexQuery(api.dogs.listAll, {}));
  },
  head: () => ({
    meta: [
      { title: "Adopt A Dog — Dogs for Adoption in Singapore" },
      {
        name: "description",
        content:
          "Browse dogs available for adoption from welfare groups across Singapore. Find your new best friend today.",
      },
      { property: "og:title", content: "Adopt A Dog — Dogs for Adoption in Singapore" },
      {
        property: "og:description",
        content:
          "Browse dogs available for adoption from welfare groups across Singapore. Find your new best friend today.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const FINEPRINT = [
  "House-trained, loves long walks at East Coast.",
  "A little shy at first, completely devoted once she trusts you.",
  "Knows sit, stay, paw. Working on “leave it.”",
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
  "Crate-trained. Travels well.",
  "Loves squeaky toys, hates the vacuum.",
  "Food-motivated. Will work for cheese.",
  "Best suited to a ground-floor home with a garden.",
  "Needs a daily walk and a daily nap. In that order.",
  "Gets along with cats after slow introductions.",
  "Will follow you from room to room. Velcro dog.",
  "Big personality in a small package.",
  "Calm, easygoing, perfect first dog.",
  "Loves the beach. Tolerates the bath.",
  "Talks back when ignored. Very expressive.",
  "Smart, sensitive, slightly dramatic.",
  "Foster says: “The sweetest dog I’ve ever met.”",
  "Looking for a forever, not a maybe.",
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
/* Filters                                                             */
/* ------------------------------------------------------------------ */

function Filters({
  q,
  setQ,
  hdb,
  setHdb,
  gender,
  setGender,
  favCount,
}: {
  q: string;
  setQ: (v: string) => void;
  hdb: boolean;
  setHdb: (v: boolean) => void;
  gender: string;
  setGender: (v: string) => void;
  favCount: number;
}) {
  return (
    <aside className="filters">
      {/* <div className="filter-eyebrow">Find your match</div> */}

      <div className="filter-group">
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
      </div>

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

      {/* <div className="filter-group">
        <div className="shortlist-callout">
          <div className="shortlist-callout-title">
            {favCount > 0
              ? `${favCount} on your shortlist`
              : "Build a shortlist"}
          </div>
          Tap the heart on any card to save dogs you&rsquo;d like to meet.
        </div>
      </div> */}
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* DogCard                                                             */
/* ------------------------------------------------------------------ */

function DogCard({
  dog,
  fine,
  fav,
  onFav,
  onOpen,
}: {
  dog: any;
  fine: string;
  fav: boolean;
  onFav: (id: string) => void;
  onOpen: (dog: any) => void;
}) {
  const [popped, setPopped] = useState(false);
  const [imgOk, setImgOk] = useState(true);

  const initial = dog.name[0].toUpperCase();

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

        {/* <button
          type="button"
          className={"heart" + (fav ? " on" : "") + (popped ? " pop" : "")}
          aria-pressed={fav}
          aria-label={
            fav
              ? `Remove ${dog.name} from shortlist`
              : `Save ${dog.name} to shortlist`
          }
          onClick={(e) => {
            e.stopPropagation();
            onFav(dog._id);
            setPopped(true);
            setTimeout(() => setPopped(false), 360);
          }}
        >
          <Icon.Heart />
        </button> */}
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
        {/* <div className="card-fine">{dog.description || fine}</div> */}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

function Home() {
  const { data: allDogs } = useSuspenseQuery(convexQuery(api.dogs.listAll, {}));

  const [q, setQ] = useState("");
  const [hdb, setHdb] = useState(false);
  const [gender, setGender] = useState("all");
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e6) + 1);
  const [selectedDog, setSelectedDog] = useState<any>(null);

  const [favs, setFavs] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem("homeward.favs");
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("homeward.favs", JSON.stringify([...favs]));
    } catch {}
  }, [favs]);

  const toggleFav = (id: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
    <main className="page">
      <header className="header">
        <div>
          <h1>
            Meet the dogs <em>looking for home.</em>
          </h1>
          <p>
            Every dog here is fully vaccinated, sterilised and waiting for
            someone patient. Browse below, save your favourites, and contact the
            welfare group to meet the dog.
          </p>
        </div>
        <div className="stat">
          <b>{allDogs?.length ?? 0}</b>
          dogs currently in our care
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
          favCount={favs.size}
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
                <DogCard
                  key={dog._id}
                  dog={dog}
                  fine={pickFine(dog._id, seed)}
                  fav={favs.has(dog._id)}
                  onFav={toggleFav}
                  onOpen={setSelectedDog}
                />
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
