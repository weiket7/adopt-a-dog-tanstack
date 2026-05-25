/* global React, ReactDOM, DOGS, GROUPS */
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
const LS_KEY = "homeward.dogs.v1";

function loadDogs() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // first run — clone built-in seed
  return DOGS.map((d) => ({ ...d }));
}

function saveDogs(list) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {}
}

/* ---------- helpers ---------- */
function photoUrl(n) { return `https://placedog.net/640/480?id=${n}`; }
function rowPhotoUrl(n) { return `https://placedog.net/120/120?id=${n}`; }
function nextId(list) {
  return list.reduce((m, d) => Math.max(m, d.id || 0), 0) + 1;
}
function nextPhoto(list) {
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

const statusOf = (dog) => dog.status || "Active";

const groupById = (id) => GROUPS.find((g) => g.id === id);
const groupNameFor = (dog) => {
  // graceful fallback for legacy seed entries: deterministic by dog.id
  if (dog.welfareGroupId != null) {
    const g = groupById(dog.welfareGroupId);
    if (g) return g.name;
  }
  return null;
};

/* ---------- form modal ---------- */
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

  return (
    <div className="backdrop" onClick={onClose}>
      <form className="dialog" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <div className="dialog-head">
          <h2>{isNew ? "Add a new dog" : `Edit ${initial.name}`}</h2>
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Close">
            <Icon.Close/>
          </button>
        </div>

        <div className="dialog-body">
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="f-name">Name *</label>
              <input id="f-name" type="text" value={d.name} onChange={setField('name')} placeholder="e.g. Mochi" />
              {errs.name && <small style={{color:'var(--bad)', fontSize:12}}>{errs.name}</small>}
            </div>

            <div className="field">
              <label htmlFor="f-breed">Breed *</label>
              <input id="f-breed" type="text" value={d.breed} onChange={setField('breed')} placeholder="e.g. Singapore Special" />
              {errs.breed && <small style={{color:'var(--bad)', fontSize:12}}>{errs.breed}</small>}
            </div>

            <div className="field">
              <label htmlFor="f-age">Age *</label>
              <input id="f-age" type="text" value={d.age} onChange={setField('age')} placeholder="e.g. 3 yrs" />
              {errs.age && <small style={{color:'var(--bad)', fontSize:12}}>{errs.age}</small>}
            </div>

            <div className="field">
              <label htmlFor="f-birthday">Birthday</label>
              <input id="f-birthday" type="text" value={d.birthday || ""} onChange={setField('birthday')} placeholder="e.g. 12 Mar 2023" />
            </div>

            <div className="field">
              <label htmlFor="f-photo">Photo ID</label>
              <input id="f-photo" type="number" min="1" value={d.photo} onChange={setField('photo')} />
            </div>

            <div className="field full">
              <label htmlFor="f-group">Welfare group</label>
              <select
                id="f-group"
                value={d.welfareGroupId ?? ""}
                onChange={(e) => setD((p) => ({ ...p, welfareGroupId: e.target.value === "" ? null : Number(e.target.value) }))}
              >
                <option value="">— Unassigned —</option>
                {GROUPS.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
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
                <button type="button" aria-pressed={statusOf(d) === "Active"}   onClick={() => setD((p) => ({ ...p, status: "Active" }))}>Active</button>
                <button type="button" aria-pressed={statusOf(d) === "Inactive"} onClick={() => setD((p) => ({ ...p, status: "Inactive" }))}>Inactive</button>
              </div>
            </div>

            <div className="field full">
              <label htmlFor="f-about">About *</label>
              <textarea
                id="f-about"
                value={d.about || ""}
                onChange={setField('about')}
                placeholder="A short description of the dog's personality, history, and what kind of home they'd love…"
              />
              {errs.about && <small style={{color:'var(--bad)', fontSize:12}}>{errs.about}</small>}
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
              <Icon.Check/> {isNew ? "Add dog" : "Save changes"}
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
  const [list, setList] = useState(() => loadDogs());
  const [q, setQ] = useState("");
  const [groupFilter, setGroupFilter] = useState("all"); // "all" | "none" | numeric id as string
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "Active" | "Inactive"
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { saveDogs(list); }, [list]);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return list.filter((d) => {
      if (ql) {
        const hit = (d.name || "").toLowerCase().includes(ql) ||
                    (d.breed || "").toLowerCase().includes(ql);
        if (!hit) return false;
      }
      if (groupFilter === "all") {
        // pass
      } else if (groupFilter === "none") {
        if (d.welfareGroupId != null) return false;
      } else if (d.welfareGroupId !== Number(groupFilter)) {
        return false;
      }
      if (statusFilter !== "all" && statusOf(d) !== statusFilter) return false;
      return true;
    });
  }, [list, q, groupFilter, statusFilter]);

  const handleAdd = () => {
    setEditing({ ...EMPTY_DOG, photo: nextPhoto(list) });
  };
  const handleEdit = (dog) => setEditing({ ...dog });

  const handleSave = (dog) => {
    setList((prev) => {
      if (dog.id == null) {
        const created = { ...dog, id: nextId(prev) };
        flash("Added " + created.name);
        return [created, ...prev];
      } else {
        flash("Updated " + dog.name);
        return prev.map((d) => (d.id === dog.id ? dog : d));
      }
    });
    setEditing(null);
  };

  const handleDelete = (dog) => {
    setConfirm({
      title: "Delete this dog?",
      body: (
        <>
          <b>{dog.name}</b> will be removed from the directory. This can&rsquo;t be undone — but you can reset to the seed list at any time.
        </>
      ),
      confirmLabel: "Delete",
      danger: true,
      onConfirm: () => {
        setList((prev) => prev.filter((d) => d.id !== dog.id));
        flash("Deleted " + dog.name);
        setConfirm(null);
      },
    });
  };

  const handleReset = () => {
    setConfirm({
      title: "Reset to seed data?",
      body: <>This replaces the current list with the original 24 seed dogs. Any added or edited entries will be lost.</>,
      confirmLabel: "Reset list",
      danger: false,
      onConfirm: () => {
        setList(DOGS.map((d) => ({ ...d })));
        flash("Reset to seed list");
        setConfirm(null);
      },
    });
  };

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <h1>Manage <em>dogs.</em></h1>
          <p>Create, edit, and remove dogs in the adoption directory. Changes save instantly to your browser&rsquo;s local storage — no sign-in required.</p>
        </div>
        <div className="actions-row">
          <button className="btn ghost" onClick={handleReset} title="Restore seed data">
            <Icon.Reset/> Reset
          </button>
          <button className="btn primary" onClick={handleAdd}>
            <Icon.Plus/> Add a dog
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <Icon.Search/>
          <input
            type="text"
            placeholder="Search by name or breed…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <label className="filter-select" aria-label="Filter by welfare group">
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
          >
            <option value="all">All welfare groups</option>
            <option value="none">— Unassigned —</option>
            {GROUPS.map((g) => (
              <option key={g.id} value={String(g.id)}>{g.name}</option>
            ))}
          </select>
        </label>
        <label className="filter-select narrow" aria-label="Filter by status">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
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
                      <img src={rowPhotoUrl(d.photo)} alt={d.name} loading="lazy" />
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
                    <span className={"pill status-" + statusOf(d).toLowerCase()}>
                      <span className="status-dot"></span>
                      {statusOf(d)}
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
        <DogForm
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
