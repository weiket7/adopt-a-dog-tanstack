import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useMemo, useEffect, useRef } from "react";
import adminCss from "~/styles/admin.css?url";
import { Icon } from "~/components/Icon";
import { uploadEventImage } from "~/server/upload";

export const Route = createFileRoute("/admin/events/")({
  head: () => ({
    links: [{ rel: "stylesheet", href: adminCss }],
  }),
  component: EventsAdminPage,
});

const KINDS = ["Adoption", "Pet Fair", "Clinic", "Community", "Training", "Other"];

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
  link: string;
  short: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  kind: "Adoption",
  tag: "",
  location: "",
  dateTime: "",
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
  initialImageUrl,
  isNew,
  onSave,
  onClose,
}: {
  initial: FormState;
  initialImageUrl: string | null;
  isNew: boolean;
  onSave: (form: FormState, file: File | null) => Promise<void>;
  onClose: () => void;
}) {
  const [d, setD] = useState<FormState>(initial);
  const [errs, setErrs] = useState<Partial<Record<keyof FormState, string>>>({});
  const [serverErr, setServerErr] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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
      await onSave(
        {
          ...d,
          name: d.name.trim(),
          location: d.location.trim(),
          dateTime: d.dateTime.trim(),
          short: d.short.trim(),
          tag: d.tag.trim(),
        },
        file,
      );
    } catch (err) {
      setServerErr(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const previewUrl = file ? URL.createObjectURL(file) : initialImageUrl;

  return (
    <div className="backdrop" onClick={onClose}>
      <form className="dialog" onSubmit={submit} onClick={e => e.stopPropagation()}>
        <div className="dialog-head">
          <h2>{isNew ? "Add a new event" : `Edit ${d.name}`}</h2>
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Close">
            <Icon.Close />
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
              <label>Banner image</label>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {previewUrl && (
                  <span
                    className="row-photo"
                    style={{ width: 56, height: 56, flexShrink: 0 }}
                  >
                    <img src={previewUrl} alt="preview" />
                  </span>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ flex: 1 }}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
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
              <Icon.Check /> {saving ? (isNew ? "Adding…" : "Saving…") : (isNew ? "Add event" : "Save changes")}
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
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Close"><Icon.Close /></button>
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
  const [editing, setEditing] = useState<{
    form: FormState;
    id: Id<"events"> | null;
    imageUrl: string | null;
  } | null>(null);
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

  const handleAdd = () => setEditing({ form: EMPTY_FORM, id: null, imageUrl: null });

  const handleEdit = (ev: EventDoc) =>
    setEditing({
      form: {
        name: ev.name,
        kind: ev.kind ?? "Adoption",
        tag: ev.tag ?? "",
        location: ev.location,
        dateTime: ev.dateTime,
        link: ev.link ?? "",
        short: ev.short ?? "",
      },
      id: ev._id,
      imageUrl: ev.image ?? null,
    });

  const handleSave = async (form: FormState, file: File | null) => {
    if (!editing) return;

    let image: string | undefined;
    if (file) {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("name", form.name);
      const result = await uploadEventImage({ data: formData });
      image = result.url;
    }

    const payload = {
      name: form.name,
      location: form.location,
      dateTime: form.dateTime,
      link: form.link || undefined,
      kind: form.kind,
      short: form.short,
      tag: form.tag || undefined,
    };

    if (editing.id === null) {
      await createEvent({
        ...payload,
        ...(image ? { image } : {}),
      });
      flash(`Added ${form.name}`);
    } else {
      await updateEvent({
        id: editing.id,
        ...payload,
        ...(image ? { image } : {}),
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
            <Icon.Plus /> Add an event
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <Icon.Search />
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
                        <Icon.Edit />
                      </button>
                      <button className="icon-btn danger" onClick={() => handleDelete(ev as EventDoc)} title="Delete" aria-label={`Delete ${ev.name}`}>
                        <Icon.Trash />
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
          initialImageUrl={editing.imageUrl}
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
          <Icon.Check /> {toast}
        </div>
      )}
    </main>
  );
}
