import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useMemo, useEffect } from "react";
import adminCss from "~/styles/admin.css?url";

export const Route = createFileRoute("/admin/events/")({
  head: () => ({
    links: [{ rel: "stylesheet", href: adminCss }],
  }),
  component: EventsAdminPage,
});

const KINDS = ["Adoption", "Pet Fair", "Clinic", "Community", "Training", "Other"];

/* ---------- icons ---------- */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 12 10 18 20 6" />
  </svg>
);

/* ---------- types ---------- */
type EventDoc = {
  _id: Id<"events">;
  name: string;
  location: string;
  dateTime: string;
  image?: string;
  link?: string;
  kind?: string;
  short?: string;
  tag?: string;
};

type FormState = {
  name: string;
  kind: string;
  tag: string;
  location: string;
  dateTime: string;
  image: string;
  link: string;
  short: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  kind: "Adoption",
  tag: "",
  location: "",
  dateTime: "",
  image: "",
  link: "",
  short: "",
};

function kindClass(kind?: string) {
  if (!kind) return "";
  return "kind-" + kind.toLowerCase().replace(/[^a-z]/g, "");
}

/* ---------- EventForm ---------- */
function EventForm({
  initial,
  isNew,
  onSave,
  onClose,
}: {
  initial: FormState;
  isNew: boolean;
  onSave: (form: FormState) => Promise<void>;
  onClose: () => void;
}) {
  const [d, setD] = useState<FormState>(initial);
  const [errs, setErrs] = useState<Partial<Record<keyof FormState, string>>>({});
  const [serverErr, setServerErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setD(p => ({ ...p, [k]: e.target.value }));
      setErrs(p => ({ ...p, [k]: undefined }));
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrs: typeof errs = {};
    if (!d.name.trim()) nextErrs.name = "Required";
    if (!d.location.trim()) nextErrs.location = "Required";
    if (!d.dateTime.trim()) nextErrs.dateTime = "Required";
    if (!d.short.trim()) nextErrs.short = "Required";
    setErrs(nextErrs);
    if (Object.keys(nextErrs).length) return;
    setServerErr(null);
    setSaving(true);
    try {
      await onSave({
        ...d,
        name: d.name.trim(),
        location: d.location.trim(),
        dateTime: d.dateTime.trim(),
        short: d.short.trim(),
        tag: d.tag.trim(),
      });
    } catch (err) {
      setServerErr(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="backdrop" onClick={onClose}>
      <form className="dialog" onSubmit={submit} onClick={e => e.stopPropagation()}>
        <div className="dialog-head">
          <h2>{isNew ? "Add a new event" : `Edit ${d.name}`}</h2>
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="dialog-body">
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="f-name">Title *</label>
              <input id="f-name" type="text" value={d.name} onChange={set("name")} placeholder="e.g. Spring Adoption Drive" />
              {errs.name && <small className="field-err">{errs.name}</small>}
            </div>

            <div className="field">
              <label htmlFor="f-kind">Kind</label>
              <select id="f-kind" value={d.kind} onChange={set("kind")}>
                {KINDS.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <div className="field">
              <label htmlFor="f-tag">Tag (optional)</label>
              <input id="f-tag" type="text" value={d.tag} onChange={set("tag")} placeholder="e.g. Featured" />
            </div>

            <div className="field full">
              <label htmlFor="f-location">Location *</label>
              <input id="f-location" type="text" value={d.location} onChange={set("location")} placeholder="e.g. Bishan Park Pavilion, Hall A" />
              {errs.location && <small className="field-err">{errs.location}</small>}
            </div>

            <div className="field full">
              <label htmlFor="f-datetime">Date &amp; time *</label>
              <input id="f-datetime" type="text" value={d.dateTime} onChange={set("dateTime")} placeholder="e.g. 5 Apr 2026 to 6 Apr 2026, 8am to 9pm daily" />
              {errs.dateTime && <small className="field-err">{errs.dateTime}</small>}
            </div>

            <div className="field full">
              <label htmlFor="f-image">Banner image URL</label>
              <input id="f-image" type="text" value={d.image} onChange={set("image")} placeholder="https://…" />
              <div className="banner-preview">
                {d.image
                  ? <img src={d.image} alt="" onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                  : <span>Preview will appear here</span>}
              </div>
            </div>

            <div className="field full">
              <label htmlFor="f-link">Link</label>
              <input id="f-link" type="text" value={d.link} onChange={set("link")} placeholder="https://…" />
            </div>

            <div className="field full">
              <label htmlFor="f-short">Description *</label>
              <textarea id="f-short" value={d.short} onChange={set("short")} placeholder="A short, warm summary of the event…" />
              {errs.short && <small className="field-err">{errs.short}</small>}
            </div>
          </div>
          {serverErr && <p style={{ color: "var(--bad)", fontSize: 13, marginTop: 8 }}>{serverErr}</p>}
        </div>

        <div className="dialog-foot">
          <span style={{ alignSelf: "center", fontSize: 12, color: "var(--muted)" }}>* required</span>
          <div className="right">
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary" disabled={saving}>
              <CheckIcon /> {saving ? (isNew ? "Adding…" : "Saving…") : (isNew ? "Add event" : "Save changes")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ---------- Confirm ---------- */
function Confirm({
  title, body, confirmLabel, danger, onConfirm, onClose,
}: {
  title: string;
  body: React.ReactNode;
  confirmLabel: string;
  danger: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
        <div className="dialog-head">
          <h2>{title}</h2>
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>
        <div className="dialog-body">
          <p className="confirm-text">{body}</p>
        </div>
        <div className="dialog-foot" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button type="button" className={`btn ${danger ? "danger" : "primary"}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- page ---------- */
function EventsAdminPage() {
  const events = useQuery(api.events.list);
  const createEvent = useMutation(api.events.create);
  const updateEvent = useMutation(api.events.update);
  const removeEvent = useMutation(api.events.remove);

  const [q, setQ] = useState("");
  const [kindFilter, setKindFilter] = useState("all");
  const [editing, setEditing] = useState<{ form: FormState; id: Id<"events"> | null } | null>(null);
  const [confirm, setConfirm] = useState<{
    title: string;
    body: React.ReactNode;
    confirmLabel: string;
    danger: boolean;
    onConfirm: () => void;
  } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const filtered = useMemo(() => {
    if (!events) return [];
    const ql = q.trim().toLowerCase();
    return events.filter(e => {
      if (ql) {
        const hay = ((e.name ?? "") + " " + (e.location ?? "") + " " + (e.kind ?? "")).toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      if (kindFilter !== "all" && e.kind !== kindFilter) return false;
      return true;
    });
  }, [events, q, kindFilter]);

  const handleAdd = () => setEditing({ form: EMPTY_FORM, id: null });

  const handleEdit = (ev: EventDoc) =>
    setEditing({
      form: {
        name: ev.name,
        kind: ev.kind ?? "Adoption",
        tag: ev.tag ?? "",
        location: ev.location,
        dateTime: ev.dateTime,
        image: ev.image ?? "",
        link: ev.link ?? "",
        short: ev.short ?? "",
      },
      id: ev._id,
    });

  const handleSave = async (form: FormState) => {
    if (!editing) return;
    if (editing.id === null) {
      await createEvent({
        name: form.name,
        location: form.location,
        dateTime: form.dateTime,
        image: form.image || undefined,
        link: form.link || undefined,
        kind: form.kind,
        short: form.short,
        tag: form.tag || undefined,
      });
      flash(`Added ${form.name}`);
    } else {
      await updateEvent({
        id: editing.id,
        name: form.name,
        location: form.location,
        dateTime: form.dateTime,
        image: form.image || undefined,
        link: form.link || undefined,
        kind: form.kind,
        short: form.short,
        tag: form.tag || undefined,
      });
      flash(`Updated ${form.name}`);
    }
    setEditing(null);
  };

  const handleDelete = (ev: EventDoc) => {
    setConfirm({
      title: "Delete this event?",
      body: <><b>{ev.name}</b> will be permanently removed. This can&rsquo;t be undone.</>,
      confirmLabel: "Delete",
      danger: true,
      onConfirm: async () => {
        await removeEvent({ id: ev._id });
        flash(`Deleted ${ev.name}`);
        setConfirm(null);
      },
    });
  };

  if (events === undefined) {
    return <div className="page" style={{ color: "var(--muted)" }}>Loading…</div>;
  }

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <h1>Manage <em>events.</em></h1>
          <p>Create, edit, and remove events shown on the public site.</p>
        </div>
        <div className="actions-row">
          <button className="btn primary" onClick={handleAdd}>
            <PlusIcon /> Add an event
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by title, location, or kind…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
        <label className="filter-select narrow" aria-label="Filter by kind">
          <select value={kindFilter} onChange={e => setKindFilter(e.target.value)}>
            <option value="all">All kinds</option>
            {KINDS.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </label>
        <span className="stat-chip">{events.length} total · {filtered.length} shown</span>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty">
            <h3>{events.length === 0 ? "No events yet" : "No matches"}</h3>
            <p>{events.length === 0 ? "Add your first event to get started." : "Try a different search."}</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th className="col-banner" />
                <th>Event</th>
                <th className="col-kind">Kind</th>
                <th className="col-location">Location</th>
                <th>When</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ev => (
                <tr key={ev._id}>
                  <td className="col-banner">
                    <span className="row-banner">
                      {ev.image
                        ? <img src={ev.image} alt="" loading="lazy" onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }} />
                        : null}
                    </span>
                  </td>
                  <td>
                    <div className="row-title">{ev.name}</div>
                    {ev.tag && <div className="row-sub"><span className="pill featured">{ev.tag}</span></div>}
                  </td>
                  <td className="col-kind">
                    {ev.kind && <span className={`pill ${kindClass(ev.kind)}`}>{ev.kind}</span>}
                  </td>
                  <td className="col-location" style={{ color: "var(--ink-2)" }}>{ev.location}</td>
                  <td style={{ color: "var(--muted)", fontSize: 13 }}>{ev.dateTime}</td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" onClick={() => handleEdit(ev as EventDoc)} title="Edit" aria-label={`Edit ${ev.name}`}>
                        <EditIcon />
                      </button>
                      <button className="icon-btn danger" onClick={() => handleDelete(ev as EventDoc)} title="Delete" aria-label={`Delete ${ev.name}`}>
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing !== null && (
        <EventForm
          initial={editing.form}
          isNew={editing.id === null}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      {confirm && (
        <Confirm
          {...confirm}
          onClose={() => setConfirm(null)}
        />
      )}

      {toast && (
        <div className="toast">
          <CheckIcon /> {toast}
        </div>
      )}
    </main>
  );
}
