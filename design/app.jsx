/* global React, ReactDOM, DOGS, FINEPRINT */
const { useState, useEffect, useMemo, useRef } = React;

/* ------------------------------------------------------------------ */
/* Tweak defaults                                                      */
/* ------------------------------------------------------------------ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "terracotta",
  "showPhotos": true,
  "density": "comfortable"
}/*EDITMODE-END*/;

const PALETTES = {
  terracotta: {
    label: "Terracotta",
    swatch: ["#b54a2c", "#f4efe3", "#1c1a16"],
    vars: {
      "--bg": "#f4efe3",
      "--paper": "#fbf7ec",
      "--ink": "#1c1a16",
      "--ink-2": "#3c3830",
      "--muted": "#7a7264",
      "--line": "#e3dccc",
      "--line-2": "#d4cbb7",
      "--accent": "#b54a2c",
      "--accent-ink": "#7a2e18",
      "--accent-soft": "#f2d9cb",
      "--hdb": "#4a6b4f",
      "--hdb-soft": "#dbe6dc",
    },
  },
  forest: {
    label: "Forest",
    swatch: ["#2f5d4a", "#f1ede3", "#1a1f1c"],
    vars: {
      "--bg": "#f1ede3",
      "--paper": "#f8f5eb",
      "--ink": "#1a1f1c",
      "--ink-2": "#34403a",
      "--muted": "#6f7770",
      "--line": "#dedbcd",
      "--line-2": "#c9c5b3",
      "--accent": "#2f5d4a",
      "--accent-ink": "#1c3c2f",
      "--accent-soft": "#d3e0d6",
      "--hdb": "#7a5a1f",
      "--hdb-soft": "#ece1c7",
    },
  },
  ink: {
    label: "Ink",
    swatch: ["#1c1a16", "#ebe6d9", "#c75b3c"],
    vars: {
      "--bg": "#ebe6d9",
      "--paper": "#ffffff",
      "--ink": "#0f0e0b",
      "--ink-2": "#2a2722",
      "--muted": "#6d655a",
      "--line": "#dbd4c1",
      "--line-2": "#c4bca7",
      "--accent": "#c75b3c",
      "--accent-ink": "#7e3522",
      "--accent-soft": "#f1d9cd",
      "--hdb": "#3d4f55",
      "--hdb-soft": "#dde3e5",
    },
  },
  blush: {
    label: "Blush",
    swatch: ["#a23a5a", "#f6ece6", "#2a1d20"],
    vars: {
      "--bg": "#f6ece6",
      "--paper": "#fdf6f0",
      "--ink": "#2a1d20",
      "--ink-2": "#4a3338",
      "--muted": "#8a7572",
      "--line": "#ead8cf",
      "--line-2": "#dabfb2",
      "--accent": "#a23a5a",
      "--accent-ink": "#69223a",
      "--accent-soft": "#f0d3dd",
      "--hdb": "#5e6d3a",
      "--hdb-soft": "#e0e4cf",
    },
  },
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
function seededShuffle(arr, seed) {
  // deterministic shuffle from seed so React renders consistently
  const a = arr.slice();
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickFine(dogId, seed) {
  // pick a fineprint slot deterministically given seed + dogId
  const x = ((dogId * 1103515245 + 12345) ^ (seed * 2654435761)) >>> 0;
  return FINEPRINT[x % FINEPRINT.length];
}

function photoUrl(n) {
  return `https://placedog.net/640/480?id=${n}`;
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */
const Icon = {
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
  ),
  Heart: () => (
    <svg viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9.5-9C.5 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4 4.5 8-2.5 4.5-9.5 9-9.5 9z"/></svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 12 10 18 20 6"/></svg>
  ),
  Shuffle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="M4 4l5 5"/></svg>
  ),
  Mars: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="14" r="5"/><path d="m14.5 9.5 5-5"/><path d="M15 4h5v5"/></svg>
  ),
  Venus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="9" r="5"/><path d="M12 14v8"/><path d="M9 19h6"/></svg>
  ),
  Close: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
  ),
  Cake: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V11a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10z"/><path d="M4 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2"/><path d="M12 4v4M10 4a2 2 0 1 1 4 0c0 1-1 2-2 2s-2-1-2-2z"/></svg>
  ),
  Send: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>
  ),
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>
  ),
  FB: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H8v-3h2.4V9.4c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12h2.6l-.4 3h-2.2v7A10 10 0 0 0 22 12z"/></svg>
  ),
  IG: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
  ),
  TT: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.4 6.5a5.2 5.2 0 0 1-3.4-2A5.2 5.2 0 0 1 14.7 2H11v13.4a2.5 2.5 0 1 1-2.5-2.5c.3 0 .5 0 .8.1V9.3a6.4 6.4 0 1 0 5.4 6.3V8.7a8.8 8.8 0 0 0 4.7 1.3V6.5z"/></svg>
  ),
  YT: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.6-.5-5.3a2.8 2.8 0 0 0-2-2C18.8 4.3 12 4.3 12 4.3s-6.8 0-8.5.4a2.8 2.8 0 0 0-2 2C1 8.4 1 12 1 12s0 3.6.5 5.3a2.8 2.8 0 0 0 2 2c1.7.4 8.5.4 8.5.4s6.8 0 8.5-.4a2.8 2.8 0 0 0 2-2C23 15.6 23 12 23 12zM10 15.3V8.7l5.7 3.3-5.7 3.3z"/></svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>
  ),
  Bolt: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>
  ),
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
  ),
  Cal: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>
  ),
  Pin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s7-7 7-13a7 7 0 1 0-14 0c0 6 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>
  ),
  ArrowRight: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
  ),
  Paw: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="6"  cy="10" rx="2"  ry="2.6"/>
      <ellipse cx="10" cy="6.5" rx="2" ry="2.6"/>
      <ellipse cx="14" cy="6.5" rx="2" ry="2.6"/>
      <ellipse cx="18" cy="10" rx="2"  ry="2.6"/>
      <path d="M12 12c-3 0-5.5 2.4-5.5 5 0 1.8 1.3 3 3 3 1 0 1.7-.5 2.5-.5s1.5.5 2.5.5c1.7 0 3-1.2 3-3 0-2.6-2.5-5-5.5-5z"/>
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */
function Nav({ view, setView }) {
  const items = [
    { id: "dogs",    label: "Dogs" },
    { id: "events",  label: "Events" },
    { id: "dogruns", label: "Dog Runs" },
    { id: "groups",  label: "Welfare Groups" },
    { id: "blog",    label: "Blog" },
    { id: "vets",    label: "Vets" },
  ];
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a
          href="#"
          className="logo"
          onClick={(e) => { e.preventDefault(); setView("dogs"); }}
        >
          <span className="mark"><Icon.Paw/></span>
          Homeward
          <small>Dog Rescue</small>
        </a>
        <div className="nav-menu">
          {items.map((it) => (
            <a
              key={it.id}
              href="#"
              className={view === it.id ? "active" : ""}
              onClick={(e) => { e.preventDefault(); setView(it.id); }}
            >
              {it.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Filters                                                             */
/* ------------------------------------------------------------------ */
function Filters({ q, setQ, hdb, setHdb, gender, setGender, favCount, totalCount, resultCount }) {
  return (
    <aside className="filters">
      <div className="filter-eyebrow">Find your match</div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="search">Search by name</label>
        <div className="search">
          <Icon.Search/>
          <input
            id="search"
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
        <p className="filter-help">Show only dogs that meet HDB&rsquo;s approved breed &amp; size list for flat-living.</p>
        <button
          type="button"
          className={"toggle-row" + (hdb ? " on" : "")}
          onClick={() => setHdb(!hdb)}
          aria-pressed={hdb}
        >
          <span className="switch"></span>
          <span>
            <div className="label">HDB-approved only</div>
            <div className="sub">{hdb ? "Showing flat-friendly dogs" : "Showing all dogs"}</div>
          </span>
        </button>
      </div>

      <div className="filter-group">
        <span className="filter-label">Gender</span>
        <div className="seg" role="radiogroup" aria-label="Gender">
          <button role="radio" aria-pressed={gender === "all"}    onClick={() => setGender("all")}>All</button>
          <button role="radio" aria-pressed={gender === "M"}      onClick={() => setGender("M")}>Male</button>
          <button role="radio" aria-pressed={gender === "F"}      onClick={() => setGender("F")}>Female</button>
        </div>
      </div>

      <div className="filter-group">
        <div style={{
          background: "var(--accent-soft)",
          borderRadius: 12,
          padding: "16px 18px",
          fontSize: 13,
          lineHeight: 1.5,
          color: "var(--accent-ink)",
        }}>
          <div style={{
            fontFamily: "var(--serif)",
            fontSize: 18,
            fontWeight: 500,
            color: "var(--accent-ink)",
            marginBottom: 4,
            letterSpacing: "-0.01em",
          }}>
            {favCount > 0 ? `${favCount} on your shortlist` : "Build a shortlist"}
          </div>
          Tap the heart on any card to save dogs you&rsquo;d like to meet.
        </div>

        <a
          href="https://ko-fi.com/homeward"
          target="_blank"
          rel="noreferrer noopener"
          className="kofi-link"
        >
          <span className="kofi-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8h1a3 3 0 0 1 0 6h-1"/>
              <path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/>
              <path d="M6 2v3M10 2v3M14 2v3"/>
            </svg>
          </span>
          <span className="kofi-body">
            <span className="kofi-title">Keep this site online</span>
            <span className="kofi-sub">Homeward is volunteer-run. Buy us a coffee on Ko-fi →</span>
          </span>
        </a>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */
function DogCard({ dog, fine, fav, onFav, onOpen, showPhoto }) {
  const [popped, setPopped] = useState(false);
  const [imgOk, setImgOk] = useState(true);

  const initial = dog.name[0].toUpperCase();

  return (
    <article
      className="card"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(dog)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(dog); } }}
      aria-label={`View ${dog.name}'s profile`}
    >
      <div className="card-photo">
        {showPhoto && imgOk ? (
          <img
            src={photoUrl(dog.photo)}
            alt={`${dog.name}, a ${dog.breed}`}
            loading="lazy"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="placeholder">{initial}</div>
        )}
        <div className="badges">
          {dog.hdb && (
            <span className="badge hdb">
              <Icon.Check/> HDB
            </span>
          )}
        </div>
        <button
          type="button"
          className={"heart" + (fav ? " on" : "") + (popped ? " pop" : "")}
          aria-pressed={fav}
          aria-label={fav ? `Remove ${dog.name} from shortlist` : `Save ${dog.name} to shortlist`}
          onClick={(e) => {
            e.stopPropagation();
            onFav(dog.id);
            setPopped(true);
            setTimeout(() => setPopped(false), 360);
          }}
        >
          <Icon.Heart/>
        </button>
      </div>
      <div className="card-body">
        <div className="card-name-row">
          <h3 className="card-name">{dog.name}</h3>
          <span className="card-gender">
            {dog.gender === "M" ? <Icon.Mars/> : <Icon.Venus/>}
            {dog.gender === "M" ? "Male" : "Female"}
          </span>
        </div>
        <div className="card-meta">
          <b>{dog.breed}</b> &middot; {dog.age}
        </div>
        <div className="card-fine">{fine}</div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Dog detail modal                                                    */
/* ------------------------------------------------------------------ */
function DogDetail({ dog, onClose, showPhoto }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  const sheetRef = useRef(null);

  // close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // scroll sheet to top when dog changes
  useEffect(() => { if (sheetRef.current) sheetRef.current.scrollTop = 0; setImgOk(true); }, [dog?.id]);

  if (!dog) return null;

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitted(true);
  };

  const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

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
          <Icon.Close/>
        </button>

        <div className="modal-body">
          <div>
            <div className="detail-head">
              <div className="detail-eyebrow">Available for adoption</div>
              <h2 className="detail-name">Meet <em>{dog.name}</em></h2>
              <div className="detail-tag">{dog.breed}</div>
            </div>

            <div className="modal-portrait">
              {showPhoto && imgOk ? (
                <img
                  src={photoUrl(dog.photo)}
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
                  {dog.gender === "M" ? <Icon.Mars/> : <Icon.Venus/>}
                  {dog.gender === "M" ? "Male" : "Female"}
                </div>
              </div>
              <div className="detail-cell">
                <div className="k">Age</div>
                <div className="v">{dog.age}</div>
              </div>
              <div className="detail-cell">
                <div className="k">Birthday</div>
                <div className="v"><Icon.Cake/> {dog.birthday || "—"}</div>
              </div>
              <div className="detail-cell">
                <div className="k">HDB approved</div>
                <div className="v">{dog.hdb ? "Yes" : "Landed only"}</div>
              </div>
            </div>

            <div className="detail-about-label">About {dog.name}</div>
            <p className="detail-about">{dog.about}</p>
          </div>

          <aside>
            <div className="form-card">
              {submitted ? (
                <div className="form-success">
                  <span className="check-ring"><Icon.Check/></span>
                  <h4>Thanks, {form.name.split(' ')[0] || 'friend'}.</h4>
                  <p>We&rsquo;ve received your interest in {dog.name}. Our adoption team will be in touch within 2 working days.</p>
                </div>
              ) : (
                <>
                  <h3>Interested in {dog.name}?</h3>
                  <p className="form-sub">Tell us a little about yourself and we&rsquo;ll arrange a meet at the shelter.</p>
                  <form onSubmit={submit}>
                    <div className="form-field">
                      <label htmlFor="adopter-name">Your name</label>
                      <input id="adopter-name" type="text" placeholder="Full name" value={form.name} onChange={update('name')} required />
                    </div>
                    <div className="form-row">
                      <div className="form-field">
                        <label htmlFor="adopter-email">Email</label>
                        <input id="adopter-email" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
                      </div>
                      <div className="form-field">
                        <label htmlFor="adopter-phone">Phone</label>
                        <input id="adopter-phone" type="tel" placeholder="+65 9123 4567" value={form.phone} onChange={update('phone')} />
                      </div>
                    </div>
                    <div className="form-field">
                      <label htmlFor="adopter-message">Tell us about your home</label>
                      <textarea id="adopter-message" placeholder={`Where do you live, who else is at home, and what made ${dog.name} catch your eye?`} value={form.message} onChange={update('message')} />
                    </div>
                    <button type="submit" className="form-submit">
                      <Icon.Send/> Send interest
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
/* Welfare groups view                                                 */
/* ------------------------------------------------------------------ */
function SocialLink({ href, label, children }) {
  if (!href) return null;
  return (
    <a
      className="group-social"
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      title={label}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </a>
  );
}

function GroupCard({ group }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <article className="group-card">
      <div className="group-top">
        <div className="group-logo">
          {imgOk ? (
            <img src={group.image} alt={group.name} loading="lazy" onError={() => setImgOk(false)} />
          ) : (
            <div className="group-logo-fallback"><Icon.Paw/></div>
          )}
        </div>
        <div className="group-id">
          <h3 className="group-name">{group.name}</h3>
          <p className="group-blurb" dangerouslySetInnerHTML={{ __html: group.blurb }} />
          <div className="group-count">
            <b>{group.dogsAvailable}</b>
            <span>dogs for adoption</span>
          </div>
        </div>
      </div>

      <div className="group-socials">
        <SocialLink href={group.website}   label="Website">   <Icon.Globe/></SocialLink>
        <SocialLink href={group.facebook}  label="Facebook">  <Icon.FB/></SocialLink>
        <SocialLink href={group.instagram} label="Instagram"> <Icon.IG/></SocialLink>
        <SocialLink href={group.tiktok}    label="TikTok">    <Icon.TT/></SocialLink>
        <SocialLink href={group.youtube}   label="YouTube">   <Icon.YT/></SocialLink>
      </div>
    </article>
  );
}

function GroupsView() {
  const [q, setQ] = useState("");
  const list = window.GROUPS.filter((g) =>
    !q.trim() || g.name.toLowerCase().includes(q.toLowerCase())
  );
  const totalDogs = window.GROUPS.reduce((n, g) => n + (g.dogsAvailable || 0), 0);
  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>Welfare groups <em>doing the work.</em></h1>
          <p>The non-profits, shelters and small collectives rehoming Singapore&rsquo;s street and surrendered dogs. Follow them, foster with them, or just send a few dollars their way.</p>
        </div>
        <div className="stat"><b>{totalDogs}</b>dogs across {window.GROUPS.length} groups</div>
      </header>

      <div className="runs-toolbar">
        <div className="search" style={{maxWidth: 320}}>
          <Icon.Search/>
          <input
            type="text"
            placeholder="Search welfare groups…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <span className="runs-count">{list.length} {list.length === 1 ? "group" : "groups"}</span>
      </div>

      <section className="groups-grid">
        {list.map((g) => <GroupCard key={g.id} group={g} />)}
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Blog view                                                           */
/* ------------------------------------------------------------------ */
function BlogCard({ post, featured }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <article className={"post-card" + (featured ? " featured" : "")}>
      <div className="post-cover">
        {imgOk ? (
          <img src={post.cover} alt={post.title} loading="lazy" onError={() => setImgOk(false)} />
        ) : (
          <div className="post-placeholder"><Icon.Paw/></div>
        )}
        <span className="post-category">{post.category}</span>
      </div>
      <div className="post-body">
        <div className="post-meta">
          <span>{post.date}</span>
          <span className="dot" aria-hidden="true">·</span>
          <span>{post.readTime}</span>
        </div>
        <h3 className="post-title">{post.title}</h3>
        <p className="post-excerpt">{post.excerpt}</p>
        <div className="post-foot">
          <span className="post-author">by {post.author}</span>
          <button className="post-cta">Read more <Icon.ArrowRight/></button>
        </div>
      </div>
    </article>
  );
}

function BlogView() {
  const [filter, setFilter] = useState("all");
  const all = window.POSTS;
  const cats = ["all", ...Array.from(new Set(all.map((p) => p.category)))];
  const filtered = filter === "all" ? all : all.filter((p) => p.category === filter);
  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>From the <em>shelter.</em></h1>
          <p>Adoption stories, guidance for new adopters, and the things we wish someone had told us before we brought our first dog home.</p>
        </div>
        <div className="stat"><b>{all.length}</b>posts &amp; counting</div>
      </header>

      <div className="runs-toolbar">
        <div className="blog-tabs" role="tablist">
          {cats.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={filter === c}
              className={filter === c ? "on" : ""}
              onClick={() => setFilter(c)}
            >
              {c === "all" ? "All posts" : c}
            </button>
          ))}
        </div>
        <span className="runs-count">{filtered.length} {filtered.length === 1 ? "post" : "posts"}</span>
      </div>

      <section className="blog-grid">
        {filtered.map((p, i) => (
          <BlogCard key={p.id} post={p} featured={filter === "all" && i === 0} />
        ))}
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Vets view                                                           */
/* ------------------------------------------------------------------ */
function VetCard({ vet }) {
  return (
    <article className="vet-card">
      <div className="vet-head">
        <span className="vet-area">{vet.area}</span>
        <div className="vet-flags">
          {vet.emergency && (
            <span className="vet-flag emerg" title="24h emergency services">
              <Icon.Bolt/> Emergency
            </span>
          )}
          {vet.publicHolidays && (
            <span className="vet-flag ph" title="Open on public holidays">
              <Icon.Sun/> PH open
            </span>
          )}
        </div>
      </div>
      <h3 className="vet-name">{vet.name}</h3>
      <div className="vet-meta">
        <span><Icon.Pin/> {vet.address}</span>
        <span><Icon.Clock/> {vet.hours}</span>
        <span><Icon.Phone/> {vet.phone}</span>
      </div>
    </article>
  );
}

function VetsView() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all"); // all | emergency | ph
  const list = window.VETS.filter((v) => {
    if (q.trim()) {
      const qq = q.toLowerCase();
      if (!v.name.toLowerCase().includes(qq) && !v.address.toLowerCase().includes(qq) && !v.area.toLowerCase().includes(qq)) return false;
    }
    if (filter === "emergency" && !v.emergency) return false;
    if (filter === "ph" && !v.publicHolidays) return false;
    return true;
  });
  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>Our partner <em>vets.</em></h1>
          <p>A small directory of clinics our adopters and fosters know and trust. Always call ahead, especially after hours.</p>
        </div>
        <div className="stat"><b>{window.VETS.length}</b>clinics islandwide</div>
      </header>

      <div className="runs-toolbar">
        <div className="search" style={{maxWidth: 320}}>
          <Icon.Search/>
          <input
            type="text"
            placeholder="Search by name, area…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="seg" role="radiogroup" aria-label="Filter vets" style={{width: "auto"}}>
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

/* ------------------------------------------------------------------ */
/* Dog runs view                                                       */
/* ------------------------------------------------------------------ */
function DogRunCard({ run }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <article className="run-card">
      <div className="run-photo">
        {imgOk ? (
          <img src={run.image} alt={run.name} loading="lazy" onError={() => setImgOk(false)} />
        ) : (
          <div className="run-placeholder"><Icon.Paw/></div>
        )}
        <span className="run-size">{run.size}</span>
      </div>
      <div className="run-body">
        <h3 className="run-name">{run.name}</h3>
        <div className="run-meta">
          <span><Icon.Pin/> {run.address}</span>
          <span><Icon.Clock/> {run.hours}</span>
        </div>
      </div>
    </article>
  );
}

function DogRunsView() {
  const [q, setQ] = useState("");
  const filtered = window.DOGRUNS.filter((r) =>
    !q.trim() || r.name.toLowerCase().includes(q.toLowerCase()) || r.address.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>Dog runs <em>around Singapore.</em></h1>
          <p>A growing list of fenced spaces where your dog can stretch their legs and meet some friends. Hours and sizes are a rough guide — do check NParks for the latest.</p>
        </div>
        <div className="stat"><b>{window.DOGRUNS.length}</b>dog runs island-wide</div>
      </header>

      <div className="runs-toolbar">
        <div className="search" style={{maxWidth: 360}}>
          <Icon.Search/>
          <input
            type="text"
            placeholder="Search by name or area…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <span className="runs-count">{filtered.length} {filtered.length === 1 ? "run" : "runs"}</span>
      </div>

      <section className="runs-grid">
        {filtered.map((r) => <DogRunCard key={r.id} run={r} />)}
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Events view                                                         */
/* ------------------------------------------------------------------ */
function EventCard({ ev }) {
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
            <Icon.Paw/>
          </div>
        )}
        <span className="event-kind">{ev.kind}</span>
        {ev.tag && <span className="event-tag">{ev.tag}</span>}
      </div>
      <div className="event-body">
        <h3 className="event-title" dangerouslySetInnerHTML={{ __html: ev.title }} />
        <div className="event-meta">
          <span className="event-meta-row">
            <Icon.Cal/>
            <span>{ev.dateLine}</span>
          </span>
          <span className="event-meta-row">
            <Icon.Pin/>
            <span>{ev.location}</span>
          </span>
        </div>
        <p className="event-short" dangerouslySetInnerHTML={{ __html: ev.short }} />
        <button className="event-cta">
          {ev.cta || "Learn more"} <Icon.ArrowRight/>
        </button>
      </div>
    </article>
  );
}

function EventsView() {
  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>
            What&rsquo;s on at <em>Homeward.</em>
          </h1>
          <p>
            Adoption drives, fairs, community walks and the occasional vet clinic.
            Everyone&rsquo;s welcome — dogs included.
          </p>
        </div>
        <div className="stat">
          <b>{window.EVENTS.length}</b>
          upcoming events
        </div>
      </header>

      <section className="events-list">
        {window.EVENTS.map((ev) => <EventCard key={ev.id} ev={ev} />)}
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // top-level view: dogs | events | blog | vets
  const [view, setView] = useState("dogs");

  // apply palette tokens
  useEffect(() => {
    const p = PALETTES[t.palette] || PALETTES.terracotta;
    const root = document.documentElement;
    Object.entries(p.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [t.palette]);

  // filter state
  const [q, setQ] = useState("");
  const [hdb, setHdb] = useState(false);
  const [gender, setGender] = useState("all");

  // favorites (persist to localStorage)
  const [favs, setFavs] = useState(() => {
    try {
      const raw = localStorage.getItem("homeward.favs");
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  });
  useEffect(() => {
    try { localStorage.setItem("homeward.favs", JSON.stringify([...favs])); } catch {}
  }, [favs]);

  const toggleFav = (id) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // shuffle seed — random per-session, can be re-rolled by user
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e6) + 1);

  // selected dog for detail modal
  const [selectedDog, setSelectedDog] = useState(null);

  const ordered = useMemo(() => seededShuffle(DOGS, seed), [seed]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return ordered.filter((d) => {
      if (ql && !d.name.toLowerCase().includes(ql) && !d.breed.toLowerCase().includes(ql)) return false;
      if (hdb && !d.hdb) return false;
      if (gender !== "all" && d.gender !== gender) return false;
      return true;
    });
  }, [ordered, q, hdb, gender]);

  const clearFilters = () => { setQ(""); setHdb(false); setGender("all"); };

  return (
    <>
      <Nav view={view} setView={setView} />

      {view === "dogs" && (
        <main className="page">
        <header className="header">
          <div>
            <h1>
              Meet the dogs <em>looking for home.</em>
            </h1>
            <p>
              Every dog here is fully vaccinated, sterilised and waiting for someone patient.
              Browse below, save your favourites, and we&rsquo;ll arrange a meet at our Sembawang shelter or with a foster carer.
            </p>
          </div>
          <div className="stat">
            <b>{DOGS.length}</b>
            dogs currently in our care
          </div>
        </header>

        <div className="layout">
          <Filters
            q={q} setQ={setQ}
            hdb={hdb} setHdb={setHdb}
            gender={gender} setGender={setGender}
            favCount={favs.size}
            totalCount={DOGS.length}
            resultCount={filtered.length}
          />

          <section>
            <div className="results-meta">
              <div className="results-count">
                {filtered.length} {filtered.length === 1 ? "dog" : "dogs"}
                <span> &middot; in random order</span>
              </div>
              <button className="shuffle" onClick={() => setSeed(Math.floor(Math.random() * 1e6) + 1)} title="Shuffle order">
                <Icon.Shuffle/> Shuffle
              </button>
            </div>

            <div className="grid">
              {filtered.length === 0 ? (
                <div className="empty">
                  <h3>No dogs match those filters</h3>
                  <p>Try widening your search &mdash; the right match may not be the one you came in for.</p>
                  <button onClick={clearFilters}>Clear all filters</button>
                </div>
              ) : (
                filtered.map((d) => (
                  <DogCard
                    key={d.id}
                    dog={d}
                    fine={pickFine(d.id, seed)}
                    fav={favs.has(d.id)}
                    onFav={toggleFav}
                    onOpen={setSelectedDog}
                    showPhoto={t.showPhotos}
                  />
                ))
              )}
            </div>
          </section>
        </div>
        </main>
      )}

      {view === "events" && <EventsView />}

      {view === "dogruns" && <DogRunsView />}

      {view === "vets" && <VetsView />}

      {view === "blog" && <BlogView />}

      {view === "groups" && <GroupsView />}

      <footer className="foot">
        <span>&copy; 2026 Homeward Dog Rescue &middot; Sembawang, Singapore</span>
        <span>hello@homeward.sg &middot; +65 6555 0142</span>
      </footer>

      {selectedDog && (
        <DogDetail dog={selectedDog} onClose={() => setSelectedDog(null)} showPhoto={t.showPhotos} />
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette">
          <TweakColor
            label="Theme"
            value={PALETTES[t.palette].swatch}
            options={Object.values(PALETTES).map((p) => p.swatch)}
            onChange={(arr) => {
              const key = Object.keys(PALETTES).find(
                (k) => PALETTES[k].swatch[0].toLowerCase() === String(arr[0]).toLowerCase()
              );
              if (key) setTweak("palette", key);
            }}
          />
        </TweakSection>
        <TweakSection label="Cards">
          <TweakToggle
            label="Dog photos"
            value={t.showPhotos}
            onChange={(v) => setTweak("showPhotos", v)}
          />
          <TweakButton
            label="Shuffle order"
            onClick={() => setSeed(Math.floor(Math.random() * 1e6) + 1)}
          />
          <TweakButton
            label="Clear shortlist"
            secondary
            onClick={() => setFavs(new Set())}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

/* ------------------------------------------------------------------ */
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
