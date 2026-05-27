/* global React, ReactDOM, DOGS, GROUPS, EVENTS */
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
  Dog:    () => <svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="6" cy="10" rx="2" ry="2.6"/><ellipse cx="10" cy="6.5" rx="2" ry="2.6"/><ellipse cx="14" cy="6.5" rx="2" ry="2.6"/><ellipse cx="18" cy="10" rx="2" ry="2.6"/><path d="M12 12c-3 0-5.5 2.4-5.5 5 0 1.8 1.3 3 3 3 1 0 1.7-.5 2.5-.5s1.5.5 2.5.5c1.7 0 3-1.2 3-3 0-2.6-2.5-5-5.5-5z"/></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>,
};

/* ---------- shared confirm dialog ---------- */
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

/* ============================================================ */
/* DOGS SECTION                                                  */
/* ============================================================ */
const DOGS_LS_KEY = "homeward.dogs.v1";
function loadDogs() {
  try {
    const raw = localStorage.getItem(DOGS_LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DOGS.map((d) => ({ ...d }));
}
function saveDogs(list) {
  try { localStorage.setItem(DOGS_LS_KEY, JSON.stringify(list)); } catch {}
}

function rowPhotoUrl(n) { return `https://placedog.net/120/120?id=${n}`; }
function nextDogId(list) {
  return list.reduce((m, d) => Math.max(m, d.id || 0), 0) + 1;
}
function nextDogPhoto(list) {
  const used = new Set(list.map((d) => d.photo));
  for (let i = 1; i < 999; i++) if (!used.has(i)) return i;
  return Math.floor(Math.random() * 200) + 1;
}

const EMPTY_DOG = {
  id: null,
  name: "",
  breed: "",
  age: "",
  birthday: "",
  gender: "F",
  hdb: true,
  photo: 1,
  about: "",
  welfareGroupId: (typeof GROUPS !== 'undefined' && GROUPS[0]) ? GROUPS[0].id : null,
  status: "Active",
};

const dogStatusOf = (dog) => dog.status || "Active";
const groupById = (id) => GROUPS.find((g) => g.id === id);
const groupNameFor = (dog) => {
  if (dog.welfareGroupId != null) {
    const g = groupById(dog.welfareGroupId);
    if (g) return g.name;
  }
  return null;
};

function DogForm({ initial, onSave, onClose }) {
  const [d, setD] = useState(initial);
  const [errs, setErrs] = useState({});
  const isNew = !initial.id;

  const setField = (k) => (e) => {
    const v = e.target ? e.target.value : e;
    setD((p) => ({ ...p, [k]: v }));
  };

  const submit = (e) => {
    e.preventDefault();
    const nextErrs = {};
    if (!d.name.trim())     nextErrs.name = "Required";
    if (!d.breed.trim())    nextErrs.breed = "Required";
    if (!d.age.trim())      nextErrs.age = "Required";
    if (!d.about.trim())    nextErrs.about = "Required";
    setErrs(nextErrs);
    if (Object.keys(nextErrs).length) return;
    onSave({ ...d, photo: Number(d.photo) || 1 });
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
          <h2>{isNew ? "Add a new dog" : `Edit ${initial.name}`}</h2>
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Close"><Icon.Close/></button>
        </div>
        <div className="dialog-body">
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="f-name">Name *</label>
              <input id="f-name" type="text" value={d.name} onChange={setField('name')} placeholder="e.g. Mochi"/>
              {errs.name && <small style={{color:'var(--bad)', fontSize:12}}>{errs.name}</small>}
            </div>
            <div className="field">
              <label htmlFor="f-breed">Breed *</label>
              <input id="f-breed" type="text" value={d.breed} onChange={setField('breed')} placeholder="e.g. Singapore Special"/>
              {errs.breed && <small style={{color:'var(--bad)', fontSize:12}}>{errs.breed}</small>}
            </div>
            <div className="field">
              <label htmlFor="f-age">Age *</label>
              <input id="f-age" type="text" value={d.age} onChange={setField('age')} placeholder="e.g. 3 yrs"/>
              {errs.age && <small style={{color:'var(--bad)', fontSize:12}}>{errs.age}</small>}
            </div>
            <div className="field">
              <label htmlFor="f-birthday">Birthday</label>
              <input id="f-birthday" type="text" value={d.birthday || ""} onChange={setField('birthday')} placeholder="e.g. 12 Mar 2023"/>
            </div>
            <div className="field">
              <label htmlFor="f-photo">Photo ID</label>
              <input id="f-photo" type="number" min="1" value={d.photo} onChange={setField('photo')}/>
            </div>
            <div className="field full">
              <label htmlFor="f-group">Welfare group</label>
              <select id="f-group"
                value={d.welfareGroupId ?? ""}
                onChange={(e) => setD((p) => ({ ...p, welfareGroupId: e.target.value === "" ? null : Number(e.target.value) }))}
              >
                <option value="">— Unassigned —</option>
                {GROUPS.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Gender</label>
              <div className="seg-input cols-2" role="radiogroup" aria-label="Gender">
                <button type="button" aria-pressed={d.gender === "F"} onClick={() => setD((p) => ({ ...p, gender: "F" }))}>Female</button>
                <button type="button" aria-pressed={d.gender === "M"} onClick={() => setD((p) => ({ ...p, gender: "M" }))}>Male</button>
              </div>
            </div>
            <div className="field">
              <label>HDB approved</label>
              <div className="seg-input cols-2" role="radiogroup" aria-label="HDB approved">
                <button type="button" aria-pressed={d.hdb === true}  onClick={() => setD((p) => ({ ...p, hdb: true }))}>Yes</button>
                <button type="button" aria-pressed={d.hdb === false} onClick={() => setD((p) => ({ ...p, hdb: false }))}>No</button>
              </div>
            </div>
            <div className="field">
              <label>Status</label>
              <div className="seg-input cols-2" role="radiogroup" aria-label="Status">
                <button type="button" aria-pressed={dogStatusOf(d) === "Active"}   onClick={() => setD((p) => ({ ...p, status: "Active" }))}>Active</button>
                <button type="button" aria-pressed={dogStatusOf(d) === "Inactive"} onClick={() => setD((p) => ({ ...p, status: "Inactive" }))}>Inactive</button>
              </div>
            </div>
            <div className="field full">
              <label htmlFor="f-about">About *</label>
              <textarea id="f-about" value={d.about || ""} onChange={setField('about')}
                placeholder="A short description of the dog's personality, history, and what kind of home they'd love…"/>
              {errs.about && <small style={{color:'var(--bad)', fontSize:12}}>{errs.about}</small>}
            </div>
          </div>
        </div>
        <div className="dialog-foot">
          <span style={{alignSelf:'center', fontSize:12, color:'var(--muted)'}}>* required</span>
          <div className="right">
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary"><Icon.Check/> {isNew ? "Add dog" : "Save changes"}</button>
          </div>
        </div>
      </form>
    </div>
  );
}

function DogsAdmin({ flash, openConfirm }) {
  const [list, setList] = useState(() => loadDogs());
  const [q, setQ] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState(null);

  useEffect(() => { saveDogs(list); }, [list]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return list.filter((d) => {
      if (ql) {
        const hit = (d.name || "").toLowerCase().includes(ql) ||
                    (d.breed || "").toLowerCase().includes(ql);
        if (!hit) return false;
      }
      if (groupFilter === "none") {
        if (d.welfareGroupId != null) return false;
      } else if (groupFilter !== "all") {
        if (d.welfareGroupId !== Number(groupFilter)) return false;
      }
      if (statusFilter !== "all" && dogStatusOf(d) !== statusFilter) return false;
      return true;
    });
  }, [list, q, groupFilter, statusFilter]);

  const handleAdd = () => setEditing({ ...EMPTY_DOG, photo: nextDogPhoto(list) });
  const handleEdit = (dog) => setEditing({ ...dog });

  const handleSave = (dog) => {
    setList((prev) => {
      if (dog.id == null) {
        const created = { ...dog, id: nextDogId(prev) };
        flash("Added " + created.name);
        return [created, ...prev];
      }
      flash("Updated " + dog.name);
      return prev.map((d) => (d.id === dog.id ? dog : d));
    });
    setEditing(null);
  };

  const handleDelete = (dog) => {
    openConfirm({
      title: "Delete this dog?",
      body: <><b>{dog.name}</b> will be removed from the directory. This can&rsquo;t be undone — but you can reset to the seed list at any time.</>,
      confirmLabel: "Delete",
      danger: true,
      onConfirm: () => {
        setList((prev) => prev.filter((d) => d.id !== dog.id));
        flash("Deleted " + dog.name);
      },
    });
  };

  const handleReset = () => {
    openConfirm({
      title: "Reset to seed dogs?",
      body: <>This replaces the current list with the original seed dogs. Any added or edited entries will be lost.</>,
      confirmLabel: "Reset list",
      danger: false,
      onConfirm: () => {
        setList(DOGS.map((d) => ({ ...d })));
        flash("Reset to seed list");
      },
    });
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Manage <em>dogs.</em></h1>
          <p>Create, edit, and remove dogs in the adoption directory. Changes save instantly to your browser&rsquo;s local storage — no sign-in required.</p>
        </div>
        <div className="actions-row">
          <button className="btn ghost" onClick={handleReset} title="Restore seed data"><Icon.Reset/> Reset</button>
          <button className="btn primary" onClick={handleAdd}><Icon.Plus/> Add a dog</button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <Icon.Search/>
          <input type="text" placeholder="Search by name or breed…" value={q} onChange={(e) => setQ(e.target.value)}/>
        </div>
        <label className="filter-select" aria-label="Filter by welfare group">
          <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
            <option value="all">All welfare groups</option>
            <option value="none">— Unassigned —</option>
            {GROUPS.map((g) => <option key={g.id} value={String(g.id)}>{g.name}</option>)}
          </select>
        </label>
        <label className="filter-select narrow" aria-label="Filter by status">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="Active">Active only</option>
            <option value="Inactive">Inactive only</option>
          </select>
        </label>
        <span className="stat-chip">{list.length} total · {filtered.length} shown</span>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty">
            <h3>{list.length === 0 ? "No dogs in the directory" : "No matches"}</h3>
            <p>{list.length === 0 ? "Add your first dog to get started." : "Try a different search."}</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th className="col-photo"></th>
                <th>Name</th>
                <th className="col-meta">Gender</th>
                <th className="col-meta">Age</th>
                <th className="col-birthday">Birthday</th>
                <th className="col-group">Welfare group</th>
                <th>HDB</th>
                <th>Status</th>
                <th style={{textAlign:'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td className="col-photo">
                    <span className="row-photo">
                      <img src={rowPhotoUrl(d.photo)} alt={d.name} loading="lazy"/>
                    </span>
                  </td>
                  <td>
                    <div className="row-name">{d.name}</div>
                    <div className="row-sub">{d.breed}</div>
                  </td>
                  <td className="col-meta">{d.gender === "M" ? "Male" : "Female"}</td>
                  <td className="col-meta">{d.age}</td>
                  <td className="col-birthday" style={{color:'var(--muted)'}}>{d.birthday || "—"}</td>
                  <td className="col-group">
                    {groupNameFor(d)
                      ? <span className="group-tag">{groupNameFor(d)}</span>
                      : <span style={{color:'var(--muted)'}}>—</span>}
                  </td>
                  <td>
                    {d.hdb
                      ? <span className="pill hdb-yes">HDB ✓</span>
                      : <span className="pill hdb-no">Landed</span>}
                  </td>
                  <td>
                    <span className={"pill status-" + dogStatusOf(d).toLowerCase()}>
                      <span className="status-dot"></span>
                      {dogStatusOf(d)}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" onClick={() => handleEdit(d)} aria-label={`Edit ${d.name}`} title="Edit"><Icon.Edit/></button>
                      <button className="icon-btn danger" onClick={() => handleDelete(d)} aria-label={`Delete ${d.name}`} title="Delete"><Icon.Trash/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <DogForm initial={editing} onSave={handleSave} onClose={() => setEditing(null)}/>
      )}
    </>
  );
}

/* ============================================================ */
/* EVENTS SECTION                                                */
/* ============================================================ */
const EVENTS_LS_KEY = "homeward.events.v1";
function loadEvents() {
  try {
    const raw = localStorage.getItem(EVENTS_LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return EVENTS.map((e) => ({ ...e }));
}
function saveEvents(list) {
  try { localStorage.setItem(EVENTS_LS_KEY, JSON.stringify(list)); } catch {}
}

const KINDS = ["Adoption", "Pet Fair", "Clinic", "Community", "Training", "Other"];

function nextEventId(list) {
  return list.reduce((m, e) => Math.max(m, e.id || 0), 0) + 1;
}
function nextBannerId(list) {
  const used = new Set(list.map((e) => {
    const m = (e.banner || "").match(/id=(\d+)/);
    return m ? Number(m[1]) : null;
  }).filter(Boolean));
  let n = 200;
  while (used.has(n)) n += 10;
  return n;
}
function bannerForId(n) { return `https://placedog.net/1200/600?id=${n}`; }
function thumbForBanner(url) {
  if (!url) return null;
  const m = url.match(/id=(\d+)/);
  if (!m) return url;
  return `https://placedog.net/160/100?id=${m[1]}`;
}
function kindClass(kind) {
  if (!kind) return "";
  return "kind-" + kind.toLowerCase().replace(/[^a-z]/g, "");
}
function decodeText(s) { return (s || "").replace(/&amp;/g, "&"); }
function encodeText(s) { return (s || "").replace(/&/g, "&amp;"); }

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
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Close"><Icon.Close/></button>
        </div>
        <div className="dialog-body">
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="f-e-title">Title *</label>
              <input id="f-e-title" type="text" value={d.title} onChange={setField('title')} placeholder="e.g. Spring Adoption Drive"/>
              {errs.title && <small style={{color:'var(--bad)', fontSize:12}}>{errs.title}</small>}
            </div>
            <div className="field">
              <label htmlFor="f-e-kind">Kind</label>
              <select id="f-e-kind" value={d.kind} onChange={setField('kind')}>
                {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-e-tag">Tag (optional)</label>
              <input id="f-e-tag" type="text" value={d.tag || ""} onChange={setField('tag')} placeholder="e.g. Featured"/>
            </div>
            <div className="field full">
              <label htmlFor="f-e-location">Location *</label>
              <input id="f-e-location" type="text" value={d.location} onChange={setField('location')} placeholder="e.g. Bishan Park Pavilion, Hall A"/>
              {errs.location && <small style={{color:'var(--bad)', fontSize:12}}>{errs.location}</small>}
            </div>
            <div className="field full">
              <label htmlFor="f-e-dateline">Date &amp; time *</label>
              <input id="f-e-dateline" type="text" value={d.dateLine} onChange={setField('dateLine')} placeholder="e.g. 5 Apr 2026 to 6 Apr 2026, 8am to 9pm daily"/>
              {errs.dateLine && <small style={{color:'var(--bad)', fontSize:12}}>{errs.dateLine}</small>}
            </div>
            <div className="field full">
              <label htmlFor="f-e-banner">Banner image URL</label>
              <input id="f-e-banner" type="text" value={d.banner} onChange={setField('banner')} placeholder="https://…"/>
              <div className="banner-preview">
                {d.banner
                  ? <img src={d.banner} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }}/>
                  : <span>Preview will appear here</span>}
              </div>
            </div>
            <div className="field">
              <label htmlFor="f-e-cta">CTA button label</label>
              <input id="f-e-cta" type="text" value={d.cta || ""} onChange={setField('cta')} placeholder="e.g. Reserve a slot"/>
            </div>
            <div className="field"></div>
            <div className="field full">
              <label htmlFor="f-e-short">Description *</label>
              <textarea id="f-e-short" value={d.short} onChange={setField('short')}
                placeholder="A short, warm summary of the event…"/>
              {errs.short && <small style={{color:'var(--bad)', fontSize:12}}>{errs.short}</small>}
            </div>
          </div>
        </div>
        <div className="dialog-foot">
          <span style={{alignSelf:'center', fontSize:12, color:'var(--muted)'}}>* required</span>
          <div className="right">
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary"><Icon.Check/> {isNew ? "Add event" : "Save changes"}</button>
          </div>
        </div>
      </form>
    </div>
  );
}

function EventsAdmin({ flash, openConfirm }) {
  const [list, setList] = useState(() => loadEvents());
  const [q, setQ] = useState("");
  const [kindFilter, setKindFilter] = useState("all");
  const [editing, setEditing] = useState(null);

  useEffect(() => { saveEvents(list); }, [list]);

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
        const created = { ...ev, id: nextEventId(prev) };
        flash("Added " + decodeText(created.title));
        return [created, ...prev];
      }
      flash("Updated " + decodeText(ev.title));
      return prev.map((e) => (e.id === ev.id ? ev : e));
    });
    setEditing(null);
  };

  const handleDelete = (ev) => {
    openConfirm({
      title: "Delete this event?",
      body: <><b>{decodeText(ev.title)}</b> will be removed. This can&rsquo;t be undone — but you can reset to the seed list at any time.</>,
      confirmLabel: "Delete",
      danger: true,
      onConfirm: () => {
        setList((prev) => prev.filter((e) => e.id !== ev.id));
        flash("Deleted " + decodeText(ev.title));
      },
    });
  };

  const handleReset = () => {
    openConfirm({
      title: "Reset to seed events?",
      body: <>This replaces the current list with the original seed events. Any added or edited entries will be lost.</>,
      confirmLabel: "Reset list",
      danger: false,
      onConfirm: () => {
        setList(EVENTS.map((e) => ({ ...e })));
        flash("Reset to seed list");
      },
    });
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Manage <em>events.</em></h1>
          <p>Create, edit, and remove events shown on the public site. Changes save instantly to your browser&rsquo;s local storage — no sign-in required.</p>
        </div>
        <div className="actions-row">
          <button className="btn ghost" onClick={handleReset} title="Restore seed data"><Icon.Reset/> Reset</button>
          <button className="btn primary" onClick={handleAdd}><Icon.Plus/> Add an event</button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <Icon.Search/>
          <input type="text" placeholder="Search by title, location, or kind…" value={q} onChange={(e) => setQ(e.target.value)}/>
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
        <EventForm initial={editing} onSave={handleSave} onClose={() => setEditing(null)}/>
      )}
    </>
  );
}

/* ============================================================ */
/* SHELL                                                         */
/* ============================================================ */
function App() {
  const initialTab = () => {
    const h = (typeof window !== 'undefined' && window.location.hash) || "";
    return h === "#events" ? "events" : "dogs";
  };
  const [tab, setTab] = useState(initialTab);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try { history.replaceState(null, "", "#" + tab); } catch {}
  }, [tab]);

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash || "";
      setTab(h === "#events" ? "events" : "dogs");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const openConfirm = (opts) => {
    setConfirm({
      ...opts,
      onConfirm: () => {
        opts.onConfirm && opts.onConfirm();
        setConfirm(null);
      },
    });
  };

  return (
    <main className="page">
      <nav className="admin-tabs" aria-label="Admin sections">
        <button
          className={"admin-tab" + (tab === "dogs" ? " active" : "")}
          onClick={() => setTab("dogs")}
          aria-current={tab === "dogs" ? "page" : undefined}
        >
          <Icon.Dog/> Dogs
        </button>
        <button
          className={"admin-tab" + (tab === "events" ? " active" : "")}
          onClick={() => setTab("events")}
          aria-current={tab === "events" ? "page" : undefined}
        >
          <Icon.Calendar/> Events
        </button>
      </nav>

      {tab === "dogs"
        ? <DogsAdmin flash={flash} openConfirm={openConfirm}/>
        : <EventsAdmin flash={flash} openConfirm={openConfirm}/>}

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
