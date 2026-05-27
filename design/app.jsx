/* global React, ReactDOM, DOGS, FINEPRINT */
const { useState, useEffect, useMemo, useRef } = React;

/* ------------------------------------------------------------------ */
/* Hot-swap built-in DOGS with admin-managed list if present           */
/* ------------------------------------------------------------------ */
(function loadAdminDogs() {
  try {
    const raw = localStorage.getItem("homeward.dogs.v1");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        window.DOGS = parsed;
      }
    }
  } catch {}
})();

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
    { id: "dogs",     label: "Dogs" },
    { id: "groups",   label: "Welfare Groups" },
    { id: "services", label: "Services" },
    { id: "events",   label: "Events" },
    { id: "blog",     label: "Blog" },
    { id: "dogruns",  label: "Dog Runs" },
    { id: "vets",     label: "Vets" },
  ];

  const [menuOpen, setMenuOpen] = useState(false);

  // close on Esc + lock body when open
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const go = (id) => {
    setView(id);
    setMenuOpen(false);
  };

  return (
    <nav className={"nav" + (menuOpen ? " nav--open" : "")}>
      <div className="nav-inner">
        <a
          href="#"
          className="logo"
          onClick={(e) => { e.preventDefault(); go("dogs"); }}
        >
          <span className="mark"><Icon.Paw/></span>
          Homeward
          <small>Dog Rescue</small>
        </a>
        <div className="nav-right">
          <div className="nav-menu">
            {items.map((it) => (
              <a
                key={it.id}
                href="#"
                className={view === it.id ? "active" : ""}
                onClick={(e) => { e.preventDefault(); go(it.id); }}
              >
                {it.label}
              </a>
            ))}
          </div>
          <a
            className="nav-support"
            href="https://ko-fi.com/homewardsg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Support us on Ko-fi — donations go towards hosting this site"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 21s-7.5-4.6-9.6-9.2C1.1 8.7 3 5.5 6.1 5.5c1.9 0 3.3 1 3.9 2.6.6-1.6 2-2.6 3.9-2.6 3.1 0 5 3.2 3.7 6.3C19.5 16.4 12 21 12 21z"/>
            </svg>
            <span className="nav-support-label">Support us</span>
            <span className="nav-support-tip" role="tooltip">
              Donations go towards hosting this site. Thank you!
            </span>
          </a>
          <button
            type="button"
            className="nav-burger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="nav-mobile-panel"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="nav-mobile-scrim" onClick={() => setMenuOpen(false)} aria-hidden="true"></div>
      )}
      <div
        id="nav-mobile-panel"
        className={"nav-mobile" + (menuOpen ? " open" : "")}
        aria-hidden={!menuOpen}
      >
        {items.map((it) => (
          <a
            key={it.id}
            href="#"
            className={"nav-mobile-link" + (view === it.id ? " active" : "")}
            onClick={(e) => { e.preventDefault(); go(it.id); }}
          >
            {it.label}
          </a>
        ))}
        <a
          className="nav-mobile-support"
          href="https://ko-fi.com/homewardsg"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 21s-7.5-4.6-9.6-9.2C1.1 8.7 3 5.5 6.1 5.5c1.9 0 3.3 1 3.9 2.6.6-1.6 2-2.6 3.9-2.6 3.1 0 5 3.2 3.7 6.3C19.5 16.4 12 21 12 21z"/>
          </svg>
          Support us on Ko-fi
        </a>
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
/* Login modal                                                         */
/* ------------------------------------------------------------------ */
function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setSubmitting(true);
    setMsg(null);
    setTimeout(() => {
      setSubmitting(false);
      setMsg({ kind: 'info', text: "Login is not connected yet — we'll get back to you soon." });
    }, 700);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="login-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <button className="login-close" onClick={onClose} aria-label="Close">
          <Icon.Close/>
        </button>

        <div className="login-body">
          <h2 id="login-title">Welcome back.</h2>
          <p className="login-sub">Sign in to manage your fosters, volunteer shifts and adoption applications.</p>

          <form onSubmit={submit} className="login-form">
            <label className="login-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoFocus
                required
              />
            </label>

            <label className="login-field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            <div className="login-row">
              <label className="login-remember">
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <a href="#" className="login-link" onClick={(e) => e.preventDefault()}>Forgot password?</a>
            </div>

            <button type="submit" className="login-submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </button>

            {msg && (
              <div className="login-msg">{msg.text}</div>
            )}

            <p className="login-foot">
              No account yet?{" "}
              <a href="#" className="login-link" onClick={(e) => e.preventDefault()}>Get in touch with us</a>
            </p>
          </form>
        </div>
      </div>
    </div>
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

function GroupCard({ group, dogCount, onPick }) {
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
          <button
            type="button"
            className="group-count is-button"
            onClick={() => onPick && onPick(group)}
            title={`Show dogs from ${group.name}`}
          >
            <b>{dogCount != null ? dogCount : group.dogsAvailable}</b>
            <span>dogs for adoption</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </button>
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

/* Deterministic group assignment for legacy seed dogs without
   `welfareGroupId` — keeps counts and filters consistent. */
function effectiveGroupId(dog) {
  if (dog.welfareGroupId != null) return dog.welfareGroupId;
  const groups = window.GROUPS || [];
  if (groups.length === 0) return null;
  return groups[(dog.id - 1) % groups.length].id;
}

function GroupsView({ onPickGroup }) {
  const [q, setQ] = useState("");
  const groups = window.GROUPS;
  // count actual dogs assigned to each group (real + deterministic fallback)
  const countsByGroup = useMemo(() => {
    const m = new Map();
    for (const d of DOGS) {
      const gid = effectiveGroupId(d);
      m.set(gid, (m.get(gid) || 0) + 1);
    }
    return m;
  }, []);
  const list = groups.filter((g) =>
    !q.trim() || g.name.toLowerCase().includes(q.toLowerCase())
  );
  const totalDogs = DOGS.length;
  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>Welfare groups <em>doing the work.</em></h1>
          <p>The non-profits, shelters and small collectives rehoming Singapore&rsquo;s street and surrendered dogs. Follow them, foster with them, or just send a few dollars their way.</p>
        </div>
        <div className="stat"><b>{totalDogs}</b>dogs across {groups.length} groups</div>
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
        {list.map((g) => (
          <GroupCard
            key={g.id}
            group={g}
            dogCount={countsByGroup.get(g.id) || 0}
            onPick={onPickGroup}
          />
        ))}
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
/* Services view                                                       */
/* ------------------------------------------------------------------ */
const SERVICE_CATEGORIES = [
  "Artists",
  "Cremation",
  "Pet shops",
  "Small businesses",
  "Animal communication",
  "Pet laundromats",
  "Boarding",
  "Grooming",
];

function ServiceCard({ service }) {
  return (
    <article className={"svc-card" + (service.featured ? " svc-card--featured" : "")}>
      {service.featured && (
        <span className="svc-featured-flag" aria-label="Featured listing">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.39 6.95H22l-5.94 4.32L18.45 22 12 17.77 5.55 22l2.39-8.73L2 8.95h7.61z"/></svg>
          Featured
        </span>
      )}
      <div className="svc-head">
        <span className={"svc-cat svc-cat--" + service.category.toLowerCase().replace(/[^a-z]/g, "")}>
          {service.category}
        </span>
        {service.priceFrom && service.priceFrom !== "—" && (
          <span className="svc-price">from {service.priceFrom}</span>
        )}
      </div>
      <h3 className="svc-name">{service.name}</h3>
      <p className="svc-blurb">{service.blurb}</p>
      <div className="svc-meta">
        <span><Icon.Pin/> {service.area}</span>
        {service.phone && <span><Icon.Phone/> {service.phone}</span>}
      </div>
      {service.website && (
        <a className="svc-link" href={service.website} target="_blank" rel="noopener noreferrer">
          Visit website
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>
        </a>
      )}
    </article>
  );
}

function ServicesView() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const list = (window.SERVICES || []).filter((s) => {
    if (cat !== "all" && s.category !== cat) return false;
    if (q.trim()) {
      const qq = q.toLowerCase();
      if (!s.name.toLowerCase().includes(qq) &&
          !s.blurb.toLowerCase().includes(qq) &&
          !s.area.toLowerCase().includes(qq) &&
          !s.category.toLowerCase().includes(qq)) return false;
    }
    return true;
  });
  // featured first, otherwise preserve source order
  const sorted = list.slice().sort((a, b) => {
    const af = a.featured ? 0 : 1;
    const bf = b.featured ? 0 : 1;
    return af - bf;
  });
  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>Services <em>for the good life.</em></h1>
          <p>A small, hand-picked directory of dog-friendly businesses our adopters and fosters quietly recommend — from fresh-meal kitchens to memorial potters. No paid listings.</p>
        </div>
        <div className="stat">
          <b>{(window.SERVICES || []).length}</b>
          businesses across {SERVICE_CATEGORIES.length} categories
        </div>
      </header>

      <aside className="pitch" aria-labelledby="pitch-title">
        <div className="pitch-body">
          <span className="pitch-eyebrow">For small businesses</span>
          <h2 id="pitch-title">List your dog-loving business with <em>Homeward.</em></h2>
          <p>
            We&rsquo;re a volunteer-run directory of trusted, dog-friendly small businesses in Singapore.
            If you make beautiful things for dogs, care for them, feed them, photograph them, or send them off with dignity &mdash; we&rsquo;d love to share what you do with our adopters and fosters.
          </p>
          <ul className="pitch-list">
            <li>Free to list. No paid placements, ever.</li>
            <li>Independent Singapore businesses preferred &mdash; sole traders welcome.</li>
            <li>Listings stay so long as our community continues to recommend you.</li>
          </ul>
        </div>
        <div className="pitch-cta">
          <a className="pitch-button" href="mailto:services@homeward.sg?subject=Service listing — Homeward">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>
            Apply to be listed
          </a>
          <span className="pitch-note">Drop us a line at <b>services@homeward.sg</b> with a short intro, your website, and where you&rsquo;re based.</span>
        </div>
      </aside>

      <div className="runs-toolbar">
        <div className="search" style={{maxWidth: 320}}>
          <Icon.Search/>
          <input
            type="text"
            placeholder="Search services…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <span className="runs-count">{list.length} {list.length === 1 ? "result" : "results"}</span>
      </div>

      <div className="svc-cats" role="tablist" aria-label="Service categories">
        <button
          role="tab"
          aria-selected={cat === "all"}
          className={"svc-cat-chip" + (cat === "all" ? " active" : "")}
          onClick={() => setCat("all")}
        >All</button>
        {SERVICE_CATEGORIES.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            className={"svc-cat-chip" + (cat === c ? " active" : "")}
            onClick={() => setCat(c)}
          >{c}</button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="empty" style={{padding: "48px 20px"}}>
          <h3 style={{fontFamily:'var(--serif)', fontWeight:500, fontSize:22, margin:'0 0 6px'}}>Nothing yet</h3>
          <p>Try a different search or category.</p>
        </div>
      ) : (
        <section className="svc-grid">
          {sorted.map((s) => <ServiceCard key={s.id} service={s} />)}
        </section>
      )}
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
          <h1>Licensed <em>vet clinics.</em></h1>
          <p>Clinics licensed by the <b>Animal &amp; Veterinary Service (AVS)</b>, the Singapore government agency overseeing animal welfare. Always call ahead, especially after hours.</p>
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

      <aside className="pitch pitch--mini" aria-label="Vet info correction">
        <div className="pitch-mini-body">
          <svg className="pitch-mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>
          <span>
            <b>Spotted something out of date?</b>{" "}
            Vet clinics change hours, move, or close. If anything here looks wrong, drop us a line and we&rsquo;ll update it.
          </span>
        </div>
        <a className="pitch-button pitch-button--sm" href="mailto:vets@homeward.sg?subject=Vet directory — update">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>
          Send an update
        </a>
      </aside>

      <section className="vets-grid">
        {list.map((v) => <VetCard key={v.id} vet={v} />)}
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Dog runs view                                                       */
/* ------------------------------------------------------------------ */
function runGalleryUrls(run) {
  // First entry is the existing thumbnail. The rest are derived placedog ids
  // so each run gets a distinct, stable set of photos.
  const base = 300 + run.id;
  const offsets = [0, 13, 27, 41, 55];
  return offsets.map((o) => `https://placedog.net/1200/800?id=${base + o}`);
}

function DogRunCard({ run, onOpenGallery }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <article className="run-card">
      <button
        type="button"
        className="run-photo"
        onClick={() => onOpenGallery(run)}
        aria-label={`Open photo gallery for ${run.name}`}
      >
        {imgOk ? (
          <img src={run.image} alt={run.name} loading="lazy" onError={() => setImgOk(false)} />
        ) : (
          <div className="run-placeholder"><Icon.Paw/></div>
        )}
        <span className="run-size">{run.size}</span>
        <span className="run-gallery-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="14" height="14" rx="2"/><path d="M7 21h12a2 2 0 0 0 2-2V9"/><path d="m7 13 3-3 4 4"/></svg>
          <span>5</span>
        </span>
      </button>
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

function DogRunGallery({ run, onClose }) {
  const images = useMemo(() => (run ? runGalleryUrls(run) : []), [run?.id]);
  const [idx, setIdx] = useState(0);
  const total = images.length;

  useEffect(() => { setIdx(0); }, [run?.id]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % total);
      else if (e.key === 'ArrowLeft')  setIdx((i) => (i - 1 + total) % total);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, total]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  if (!run) return null;

  return (
    <div className="gallery-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${run.name} photo gallery`}>
      <button className="gallery-close" onClick={onClose} aria-label="Close gallery">
        <Icon.Close/>
      </button>
      <div className="gallery-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="gallery-stage">
          <button
            className="gallery-nav prev"
            onClick={() => setIdx((i) => (i - 1 + total) % total)}
            aria-label="Previous photo"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <img className="gallery-main" src={images[idx]} alt={`${run.name} — photo ${idx + 1} of ${total}`} />
          <button
            className="gallery-nav next"
            onClick={() => setIdx((i) => (i + 1) % total)}
            aria-label="Next photo"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6"/></svg>
          </button>
        </div>
        <div className="gallery-foot">
          <div className="gallery-caption">
            <b>{run.name}</b>
            <span>{run.address} · {idx + 1} / {total}</span>
          </div>
          <div className="gallery-thumbs" role="tablist">
            {images.map((src, i) => (
              <button
                key={i}
                className={`gallery-thumb${i === idx ? ' is-active' : ''}`}
                onClick={() => setIdx(i)}
                role="tab"
                aria-selected={i === idx}
                aria-label={`Show photo ${i + 1}`}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const RUN_AREAS = ["Central", "East", "North", "North-East", "West"];

function DogRunsView() {
  const [q, setQ] = useState("");
  const [area, setArea] = useState("all");
  const [galleryRun, setGalleryRun] = useState(null);
  const filtered = window.DOGRUNS.filter((r) => {
    if (area !== "all" && r.area !== area) return false;
    if (!q.trim()) return true;
    const qq = q.toLowerCase();
    return r.name.toLowerCase().includes(qq) || r.address.toLowerCase().includes(qq) || (r.area || "").toLowerCase().includes(qq);
  });
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

      <div className="svc-cats" role="tablist" aria-label="Filter dog runs by area">
        <button
          role="tab"
          aria-selected={area === "all"}
          className={"svc-cat-chip" + (area === "all" ? " active" : "")}
          onClick={() => setArea("all")}
        >All</button>
        {RUN_AREAS.map((a) => (
          <button
            key={a}
            role="tab"
            aria-selected={area === a}
            className={"svc-cat-chip" + (area === a ? " active" : "")}
            onClick={() => setArea(a)}
          >{a}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty" style={{padding: "48px 20px"}}>
          <h3 style={{fontFamily:'var(--serif)', fontWeight:500, fontSize:22, margin:'0 0 6px'}}>No dog runs here yet</h3>
          <p>Nothing in {area === "all" ? "this search" : area} matches — try another area.</p>
        </div>
      ) : (
        <section className="runs-grid">
          {filtered.map((r) => <DogRunCard key={r.id} run={r} onOpenGallery={setGalleryRun} />)}
        </section>
      )}

      {galleryRun && <DogRunGallery run={galleryRun} onClose={() => setGalleryRun(null)} />}
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

      <aside className="pitch" aria-labelledby="evt-pitch-title">
        <div className="pitch-body">
          <span className="pitch-eyebrow">For organisers &amp; community groups</span>
          <h2 id="evt-pitch-title">Have a dog event? <em>Tell us.</em></h2>
          <p>
            Running an adoption drive, a pack walk, a foster mixer, a vet talk, or a small fair?
            We&rsquo;ll happily share it here so our adopters, fosters and volunteers know to come along.
          </p>
          <ul className="pitch-list">
            <li>Free to list. Non-commercial events get priority.</li>
            <li>Singapore-based, dog-related, and open to the public.</li>
            <li>Send us the date, location, a short blurb, and a photo if you have one.</li>
          </ul>
        </div>
        <div className="pitch-cta">
          <a className="pitch-button" href="mailto:events@homeward.sg?subject=Event listing — Homeward">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>
            Submit an event
          </a>
          <span className="pitch-note">Email <b>events@homeward.sg</b> at least two weeks ahead. We list events as space allows.</span>
        </div>
      </aside>

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
  const [groupFilter, setGroupFilter] = useState(null); // group id or null

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
  const [showLogin, setShowLogin] = useState(false);

  const ordered = useMemo(() => seededShuffle(DOGS, seed), [seed]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return ordered.filter((d) => {
      if (ql && !d.name.toLowerCase().includes(ql) && !d.breed.toLowerCase().includes(ql)) return false;
      if (hdb && !d.hdb) return false;
      if (gender !== "all" && d.gender !== gender) return false;
      if (groupFilter != null && effectiveGroupId(d) !== groupFilter) return false;
      return true;
    });
  }, [ordered, q, hdb, gender, groupFilter]);

  const clearFilters = () => { setQ(""); setHdb(false); setGender("all"); setGroupFilter(null); };

  const activeGroup = groupFilter != null
    ? (window.GROUPS || []).find((g) => g.id === groupFilter)
    : null;

  const pickGroup = (group) => {
    setGroupFilter(group.id);
    setView("dogs");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Nav view={view} setView={setView} />

      {view === "dogs" && (
        <main className="page">
        <header className="header">
          <div>
            <h1>
              {activeGroup ? <>Dogs from <em>{activeGroup.name.split(" — ")[0]}.</em></> : <>Meet the dogs <em>looking for home.</em></>}
            </h1>
            <p>
              {activeGroup
                ? <>You&rsquo;re viewing dogs in the care of <b>{activeGroup.name}</b>. Clear the filter to see every dog across all welfare groups.</>
                : <>Every dog here is fully vaccinated, sterilised and waiting for someone patient. Browse below, save your favourites, and we&rsquo;ll arrange a meet at our Sembawang shelter or with a foster carer.</>}
            </p>
          </div>
          <div className="stat">
            <b>{activeGroup ? filtered.length : DOGS.length}</b>
            {activeGroup ? `dogs from this group` : `dogs currently in our care`}
          </div>
        </header>

        {activeGroup && (
          <div className="group-filter-banner">
            <span className="gfb-label">Filtered by welfare group:</span>
            <span className="gfb-pill">{activeGroup.name}</span>
            <button className="gfb-clear" onClick={() => setGroupFilter(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
              Clear filter
            </button>
          </div>
        )}

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

      {view === "services" && <ServicesView />}

      {view === "vets" && <VetsView />}

      {view === "blog" && <BlogView />}

      {view === "groups" && <GroupsView onPickGroup={pickGroup} />}

      <footer className="foot">
        <span>&copy; 2026 Homeward Dog Rescue &middot; Sembawang, Singapore</span>
        <span>
          hello@homeward.sg &middot; +65 6555 0142 &middot;{" "}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setShowLogin(true); }}
            style={{color:'var(--muted)', textDecoration:'underline', textUnderlineOffset:'3px'}}
          >Log in</a>
          {" "}&middot;{" "}
          <a href="admin.html" style={{color:'var(--muted)', textDecoration:'underline', textUnderlineOffset:'3px'}}>Admin</a>
        </span>
      </footer>

      {selectedDog && (
        <DogDetail dog={selectedDog} onClose={() => setSelectedDog(null)} showPhoto={t.showPhotos} />
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

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
