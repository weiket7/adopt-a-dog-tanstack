/* global React, ReactDOM, EVENTS */
const { useState, useEffect, useMemo } = React;

/* ---------- icons ---------- */
const Icon = {
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  Plus:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  Edit:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>,
  Trash:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/></svg>,
  Close:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>,
  Check:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 12 10 18 20 6"/></svg>,
  Reset:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>,
};

/* ---------- storage layer ---------- */
const LS_KEY = "homeward.events.v1";

function loadEvents() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return EVENTS.map((e) => ({ ...e }));
}

function saveEvents(list) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {}
}

/* ---------- helpers ---------- */
const KINDS = ["Adoption", "Pet Fair", "Clinic", "Community", "Training", "Other"];

function nextId(list) {
  return list.reduce((m, e) => Math.max(m, e.id || 0), 0) + 1;
}
function nextBannerId(list) {
  // events use banners in steps of 10 starting at 200
  const used = new Set(list.map((e) => {
    const m = (e.banner || "").match(/id=(\d+)/);
    return m ? Number(m[1]) : null;
  }).filter(Boolean));
  let n = 200;
  while (used.has(n)) n += 10;
  return n;
}
function bannerForId(n) {
  return `https://placedog.net/1200/600?id=${n}`;
}
function thumbForBanner(url) {
  // re-use placedog URL with smaller dims
  if (!url) return null;
  const m = url.match(/id=(\d+)/);
  if (!m) return url;
  return `https://placedog.net/160/100?id=${m[1]}`;
}
function kindClass(kind) {
  if (!kind) return "";
  return "kind-" + kind.toLowerCase().replace(/[^a-z]/g, "");
}
function decodeText(s) {
  // EVENTS seed uses &amp; literally — render it cleanly in inputs
  return (s || "").replace(/&amp;/g, "&");
}
function encodeText(s) {
  return (s || "").replace(/&/g, "&amp;");
}

const EMPTY_EVENT = {
  id: null,
  title: "",
  kind: "Adoption",
  banner: "",
  location: "",
  dateLine: "",
  short: "",
  cta: "Reserve a slot",
  tag: "",
};

/* ---------- form modal ---------- */
function EventForm({ initial, onSave, onClose }) {
  const [d, setD] = useState({
    ...initial,
    title: decodeText(initial.title),
    short: decodeText(initial.short),
  });
  const [errs, setErrs] = useState({});
  const isNew = !initial.id;

  const setField = (k) => (e) => {
    const v = e.target ? e.target.value : e;
    setD((p) => ({ ...p, [k]: v }));
  };

  const submit = (e) => {
    e.preventDefault();
    const nextErrs = {};
    if (!d.title.trim())    nextErrs.title = "Required";
    if (!d.location.trim()) nextErrs.location = "Required";
    if (!d.dateLine.trim()) nextErrs.dateLine = "Required";
    if (!d.short.trim())    nextErrs.short = "Required";
    setErrs(nextErrs);
    if (Object.keys(nextErrs).length) return;
    onSave({
      ...d,
      title: encodeText(d.title.trim()),
      short: encodeText(d.short.trim()),
      location: d.location.trim(),
      dateLine: d.dateLine.trim(),
      cta: (d.cta || "").trim() || "Learn more",
      tag: (d.tag || "").trim(),
    });
  };

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

  return (
    <div className="backdrop" onClick={onClose}>
      <form className="dialog" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <div className="dialog-head">
          <h2>{isNew ? "Add a new event" : `Edit ${decodeText(initial.title)}`}</h2>
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Close">
            <Icon.Close/>
          </button>
        </div>

        <div className="dialog-body">
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="f-title">Title *</label>
              <input id="f-title" type="text" value={d.title} onChange={setField('title')} placeholder="e.g. Spring Adoption Drive"/>
              {errs.title && <small style={{color:'var(--bad)', fontSize:12}}>{errs.title}</small>}
            </div>

            <div className="field">
              <label htmlFor="f-kind">Kind</label>
              <select id="f-kind" value={d.kind} onChange={setField('kind')}>
                {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <div className="field">
              <label htmlFor="f-tag">Tag (optional)</label>
              <input id="f-tag" type="text" value={d.tag || ""} onChange={setField('tag')} placeholder="e.g. Featured"/>
            </div>

            <div className="field full">
              <label htmlFor="f-location">Location *</label>
              <input id="f-location" type="text" value={d.location} onChange={setField('location')} placeholder="e.g. Bishan Park Pavilion, Hall A"/>
              {errs.location && <small style={{color:'var(--bad)', fontSize:12}}>{errs.location}</small>}
            </div>

            <div className="field full">
              <label htmlFor="f-dateline">Date &amp; time *</label>
              <input id="f-dateline" type="text" value={d.dateLine} onChange={setField('dateLine')} placeholder="e.g. 5 Apr 2026 to 6 Apr 2026, 8am to 9pm daily"/>
              {errs.dateLine && <small style={{color:'var(--bad)', fontSize:12}}>{errs.dateLine}</small>}
            </div>

            <div className="field full">
              <label htmlFor="f-banner">Banner image URL</label>
              <input id="f-banner" type="text" value={d.banner} onChange={setField('banner')} placeholder="https://…"/>
              <div className="banner-preview">
                {d.banner
                  ? <img src={d.banner} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }}/>
                  : <span>Preview will appear here</span>}
              </div>
            </div>

            <div className="field">
              <label htmlFor="f-cta">CTA button label</label>
              <input id="f-cta" type="text" value={d.cta || ""} onChange={setField('cta')} placeholder="e.g. Reserve a slot"/>
            </div>

            <div className="field"></div>

            <div className="field full">
              <label htmlFor="f-short">Description *</label>
              <textarea
                id="f-short"
                value={d.short}
                onChange={setField('short')}
                placeholder="A short, warm summary of the event…"
              />
              {errs.short && <small style={{color:'var(--bad)', fontSize:12}}>{errs.short}</small>}
            </div>
          </div>
        </div>

        <div className="dialog-foot">
          <span style={{alignSelf:'center', fontSize:12, color:'var(--muted)'}}>
            * required
          </span>
          <div className="right">
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">
              <Icon.Check/> {isNew ? "Add event" : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ---------- confirm dialog ---------- */
function Confirm({ title, body, confirmLabel, danger, onConfirm, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()} style={{maxWidth: 460}}>
        <div className="dialog-head">
          <h2>{title}</h2>
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Close"><Icon.Close/></button>
        </div>
        <div className="dialog-body">
          <p className="confirm-text">{body}</p>
        </div>
        <div className="dialog-foot" style={{justifyContent:'flex-end'}}>
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button type="button" className={"btn " + (danger ? "danger" : "primary")} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- app ---------- */
function App() {
  const [list, setList] = useState(() => loadEvents());
  const [q, setQ] = useState("");
  const [kindFilter, setKindFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { saveEvents(list); }, [list]);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return list.filter((e) => {
      if (ql) {
        const hay = (decodeText(e.title) + " " + e.location + " " + e.kind).toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      if (kindFilter !== "all" && e.kind !== kindFilter) return false;
      return true;
    });
  }, [list, q, kindFilter]);

  const handleAdd = () => {
    const bid = nextBannerId(list);
    setEditing({ ...EMPTY_EVENT, banner: bannerForId(bid) });
  };
  const handleEdit = (ev) => setEditing({ ...ev });

  const handleSave = (ev) => {
    setList((prev) => {
      if (ev.id == null) {
        const created = { ...ev, id: nextId(prev) };
        flash("Added " + decodeText(created.title));
        return [created, ...prev];
      }
      flash("Updated " + decodeText(ev.title));
      return prev.map((e) => (e.id === ev.id ? ev : e));
    });
    setEditing(null);
  };

  const handleDelete = (ev) => {
    setConfirm({
      title: "Delete this event?",
      body: (
        <>
          <b>{decodeText(ev.title)}</b> will be removed. This can&rsquo;t be undone — but you can reset to the seed list at any time.
        </>
      ),
      confirmLabel: "Delete",
      danger: true,
      onConfirm: () => {
        setList((prev) => prev.filter((e) => e.id !== ev.id));
        flash("Deleted " + decodeText(ev.title));
        setConfirm(null);
      },
    });
  };

  const handleReset = () => {
    setConfirm({
      title: "Reset to seed data?",
      body: <>This replaces the current list with the original seed events. Any added or edited entries will be lost.</>,
      confirmLabel: "Reset list",
      danger: false,
      onConfirm: () => {
        setList(EVENTS.map((e) => ({ ...e })));
        flash("Reset to seed list");
        setConfirm(null);
      },
    });
  };

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <h1>Manage <em>events.</em></h1>
          <p>Create, edit, and remove events shown on the public site. Changes save instantly to your browser&rsquo;s local storage — no sign-in required.</p>
        </div>
        <div className="actions-row">
          <button className="btn ghost" onClick={handleReset} title="Restore seed data">
            <Icon.Reset/> Reset
          </button>
          <button className="btn primary" onClick={handleAdd}>
            <Icon.Plus/> Add an event
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <Icon.Search/>
          <input
            type="text"
            placeholder="Search by title, location, or kind…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <label className="filter-select" aria-label="Filter by kind">
          <select value={kindFilter} onChange={(e) => setKindFilter(e.target.value)}>
            <option value="all">All kinds</option>
            {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </label>
        <span className="stat-chip">{list.length} total · {filtered.length} shown</span>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty">
            <h3>{list.length === 0 ? "No events" : "No matches"}</h3>
            <p>{list.length === 0 ? "Add your first event to get started." : "Try a different search."}</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th className="col-banner"></th>
                <th>Event</th>
                <th className="col-kind">Kind</th>
                <th className="col-location">Location</th>
                <th>When</th>
                <th style={{textAlign:'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td className="col-banner">
                    <span className="row-banner">
                      {e.banner
                        ? <img src={thumbForBanner(e.banner)} alt="" loading="lazy" onError={(ev) => { ev.currentTarget.style.opacity = 0; }}/>
                        : null}
                    </span>
                  </td>
                  <td>
                    <div className="row-title">{decodeText(e.title)}</div>
                    {e.tag && <div className="row-sub"><span className="pill featured">{e.tag}</span></div>}
                  </td>
                  <td className="col-kind">
                    <span className={"pill " + kindClass(e.kind)}>{e.kind}</span>
                  </td>
                  <td className="col-location" style={{color:'var(--ink-2)'}}>{e.location}</td>
                  <td style={{color:'var(--muted)', fontSize:13}}>{e.dateLine}</td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" onClick={() => handleEdit(e)} aria-label={`Edit ${decodeText(e.title)}`} title="Edit"><Icon.Edit/></button>
                      <button className="icon-btn danger" onClick={() => handleDelete(e)} aria-label={`Delete ${decodeText(e.title)}`} title="Delete"><Icon.Trash/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <EventForm
          initial={editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      {confirm && (
        <Confirm
          title={confirm.title}
          body={confirm.body}
          confirmLabel={confirm.confirmLabel}
          danger={confirm.danger}
          onConfirm={confirm.onConfirm}
          onClose={() => setConfirm(null)}
        />
      )}

      {toast && (
        <div className="toast">
          <Icon.Check/> {toast}
        </div>
      )}
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
