import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { toAge } from "~/utils/extensions";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { emailWelfareGroup } from "~/server/email";

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

const SearchIcon = () => (
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
const CloseIcon = () => (
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
const SendIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4z" />
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
      <div className="filter-eyebrow">Find your match</div>

      <div className="filter-group">
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
/* DogDetail modal                                                     */
/* ------------------------------------------------------------------ */

function DogDetail({ dog, onClose }: { dog: any; onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (sheetRef.current) sheetRef.current.scrollTop = 0;
    setImgOk(true);
  }, [dog?._id]);

  if (!dog) return null;

  const update =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSending(true);
    await emailWelfareGroup({
      data: {
        dogId: dog._id,
        name: form.name,
        email: form.email,
        mobile: form.phone,
        message: form.message,
      },
    });
    setSending(false);
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-sheet"
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${dog.name}'s profile`}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        <div className="modal-body">
          <div>
            <div className="detail-head">
              <div className="detail-eyebrow">Available for adoption</div>
              <h2 className="detail-name">
                Meet <em>{dog.name}</em>
              </h2>
            </div>
            <div className="modal-portrait">
              {dog.imageUrl && imgOk ? (
                <img
                  src={dog.imageUrl}
                  alt={dog.name}
                  onError={() => setImgOk(false)}
                />
              ) : (
                <div className="placeholder">{dog.name[0]}</div>
              )}
            </div>
            <div className="detail-grid">
              <div className="detail-cell">
                <div className="k">Gender</div>
                <div className="v">
                  {dog.gender === "Male" ? <MarsIcon /> : <VenusIcon />}
                  {dog.gender}
                </div>
              </div>
              <div className="detail-cell">
                <div className="k">Age</div>
                <div className="v">
                  {dog.birthday ? toAge(dog.birthday) : "—"}
                </div>
              </div>
              <div className="detail-cell">
                <div className="k">HDB approved</div>
                <div className="v">
                  {dog.hdbApproved === "Yes" ? "Yes" : "Landed only"}
                </div>
              </div>
            </div>
            {dog.description && (
              <>
                <div className="detail-about-label">About {dog.name}</div>
                <p className="detail-about">{dog.description}</p>
              </>
            )}
          </div>

          <aside>
            <div className="form-card">
              {submitted ? (
                <div className="form-success">
                  <span className="check-ring">
                    <CheckIcon />
                  </span>
                  <h4>Thanks, {form.name.split(" ")[0] || "friend"}.</h4>
                  <p>
                    We&rsquo;ve received your interest in {dog.name}. Our
                    adoption team will be in touch within 2 working days.
                  </p>
                </div>
              ) : (
                <>
                  <h3>Interested in {dog.name}?</h3>
                  <p className="form-sub">
                    Tell us a little about yourself and we&rsquo;ll arrange a
                    meet at the shelter.
                  </p>
                  <form onSubmit={submit}>
                    <div className="form-field">
                      <label htmlFor="adopter-name">Your name</label>
                      <input
                        id="adopter-name"
                        type="text"
                        placeholder="Full name"
                        value={form.name}
                        onChange={update("name")}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-field">
                        <label htmlFor="adopter-email">Email</label>
                        <input
                          id="adopter-email"
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={update("email")}
                          required
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="adopter-phone">Phone</label>
                        <input
                          id="adopter-phone"
                          type="tel"
                          placeholder="+65 9123 4567"
                          value={form.phone}
                          onChange={update("phone")}
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <label htmlFor="adopter-message">
                        Tell us about your home
                      </label>
                      <textarea
                        id="adopter-message"
                        placeholder={`Where do you live, who else is at home, and what made ${dog.name} catch your eye?`}
                        value={form.message}
                        onChange={update("message")}
                      />
                    </div>
                    <button
                      type="submit"
                      className="form-submit"
                      disabled={sending}
                    >
                      <SendIcon /> {sending ? "Sending…" : "Send interest"}
                    </button>
                    <div className="form-disclaimer">
                      Adoption is subject to home visit &amp; suitability check.
                    </div>
                  </form>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function WelfareGroupDogsPage() {
  const { welfareGroupId } = Route.useParams();
  const id = welfareGroupId as Id<"welfareGroups">;

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
    <main className="page">
      <header className="header">
        <div>
          <div className="page-header-back">
            <Link to="/welfare-groups">&larr; Welfare groups</Link>
          </div>
          <h1>
            {group?.name ?? "Welfare group"} <em>dogs for adoption.</em>
          </h1>
          <p>
            Browse dogs currently available through {group?.name}. Every dog is
            fully vaccinated, sterilised and waiting for someone patient.
          </p>
        </div>
        <div className="stat">
          <b>{allDogs?.length ?? 0}</b>
          dogs currently in care
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
