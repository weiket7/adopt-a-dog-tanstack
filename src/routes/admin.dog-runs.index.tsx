import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useMemo, useEffect } from "react";
import adminCss from "~/styles/admin.css?url";

export const Route = createFileRoute("/admin/dog-runs/")({
  head: () => ({
    links: [{ rel: "stylesheet", href: adminCss }],
  }),
  component: DogRunsAdminPage,
});

/* ---------- icons ---------- */
const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const EditIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
  </svg>
);
const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M6 6l12 12M18 6 6 18" />
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
  >
    <polyline points="4 12 10 18 20 6" />
  </svg>
);

/* ---------- types ---------- */
type DogRunRow = {
  _id: Id<"dogRuns">;
  sortOrder: number;
  name: string;
  area: string;
  size: string;
  address: string;
  waterPoint: boolean;
  description?: string;
  openingHours?: string;
  image?: string;
  map?: string;
  website?: string;
};

type FormState = {
  sortOrder: string;
  name: string;
  area: string;
  size: string;
  address: string;
  waterPoint: boolean;
  description: string;
  openingHours: string;
  image: string;
  map: string;
  website: string;
};

const EMPTY_FORM: FormState = {
  sortOrder: "0",
  name: "",
  area: "",
  size: "",
  address: "",
  waterPoint: false,
  description: "",
  openingHours: "",
  image: "",
  map: "",
  website: "",
};

const AREAS = ["Central", "East", "North", "North-East", "West"];

/* ---------- DogRunForm modal ---------- */
function DogRunForm({
  initial,
  onSave,
  onClose,
}: {
  initial: FormState & { id?: Id<"dogRuns"> };
  onSave: (form: FormState) => Promise<void>;
  onClose: () => void;
}) {
  const [d, setD] = useState<FormState>(initial);
  const [errs, setErrs] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);
  const isNew = !initial.id;

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

  const set =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setD((p) => ({ ...p, [k]: e.target.value }));
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrs: typeof errs = {};
    if (!d.name.trim()) nextErrs.name = "Required";
    if (!d.area.trim()) nextErrs.area = "Required";
    if (!d.size.trim()) nextErrs.size = "Required";
    if (!d.address.trim()) nextErrs.address = "Required";
    setErrs(nextErrs);
    if (Object.keys(nextErrs).length) return;
    setSaving(true);
    try {
      await onSave(d);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="backdrop" onClick={onClose}>
      <form
        className="dialog"
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog-head">
          <h2>{isNew ? "Add a dog run" : `Edit ${initial.name}`}</h2>
          <button
            type="button"
            className="dialog-close"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="dialog-body">
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="f-name">Name *</label>
              <input
                id="f-name"
                type="text"
                value={d.name}
                onChange={set("name")}
                placeholder="e.g. Bishan-Ang Mo Kio Dog Run"
              />
              {errs.name && <small className="field-err">{errs.name}</small>}
            </div>

            <div className="field">
              <label htmlFor="f-area">Area *</label>
              <select id="f-area" value={d.area} onChange={set("area")}>
                <option value="">— Select —</option>
                {AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              {errs.area && <small className="field-err">{errs.area}</small>}
            </div>

            <div className="field">
              <label htmlFor="f-size">Size *</label>
              <input
                id="f-size"
                type="text"
                value={d.size}
                onChange={set("size")}
                placeholder="e.g. Large"
              />
              {errs.size && <small className="field-err">{errs.size}</small>}
            </div>

            <div className="field full">
              <label htmlFor="f-address">Address *</label>
              <input
                id="f-address"
                type="text"
                value={d.address}
                onChange={set("address")}
                placeholder="e.g. 1382 Ang Mo Kio Ave 1"
              />
              {errs.address && <small className="field-err">{errs.address}</small>}
            </div>

            <div className="field">
              <label htmlFor="f-opening-hours">Opening Hours</label>
              <input
                id="f-opening-hours"
                type="text"
                value={d.openingHours}
                onChange={set("openingHours")}
                placeholder="e.g. 24 hours"
              />
            </div>

            <div className="field">
              <label htmlFor="f-sort-order">Sort Order</label>
              <input
                id="f-sort-order"
                type="number"
                value={d.sortOrder}
                onChange={set("sortOrder")}
              />
            </div>

            <div className="field">
              <label>Water Point</label>
              <div
                className="seg-input cols-2"
                role="radiogroup"
                aria-label="Water Point"
              >
                <button
                  type="button"
                  aria-pressed={d.waterPoint === true}
                  onClick={() => setD((p) => ({ ...p, waterPoint: true }))}
                >
                  Yes
                </button>
                <button
                  type="button"
                  aria-pressed={d.waterPoint === false}
                  onClick={() => setD((p) => ({ ...p, waterPoint: false }))}
                >
                  No
                </button>
              </div>
            </div>

            <div className="field full">
              <label htmlFor="f-image">Image URL</label>
              <input
                id="f-image"
                type="text"
                value={d.image}
                onChange={set("image")}
                placeholder="https://…"
              />
            </div>

            <div className="field full">
              <label htmlFor="f-map">Map URL</label>
              <input
                id="f-map"
                type="text"
                value={d.map}
                onChange={set("map")}
                placeholder="https://maps.google.com/…"
              />
            </div>

            <div className="field full">
              <label htmlFor="f-website">Website</label>
              <input
                id="f-website"
                type="text"
                value={d.website}
                onChange={set("website")}
                placeholder="https://…"
              />
            </div>

            <div className="field full">
              <label htmlFor="f-description">Description</label>
              <textarea
                id="f-description"
                value={d.description}
                onChange={set("description")}
                placeholder="Details about the dog run…"
              />
            </div>
          </div>
        </div>

        <div className="dialog-foot">
          <span
            style={{ alignSelf: "center", fontSize: 12, color: "var(--muted)" }}
          >
            * required
          </span>
          <div className="right">
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={saving}>
              <CheckIcon />{" "}
              {saving ? "Saving…" : isNew ? "Add dog run" : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ---------- confirm dialog ---------- */
function Confirm({
  title,
  body,
  confirmLabel,
  danger,
  onConfirm,
  onClose,
}: {
  title: string;
  body: React.ReactNode;
  confirmLabel: string;
  danger: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="backdrop" onClick={onClose}>
      <div
        className="dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 460 }}
      >
        <div className="dialog-head">
          <h2>{title}</h2>
          <button
            type="button"
            className="dialog-close"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="dialog-body">
          <p className="confirm-text">{body}</p>
        </div>
        <div className="dialog-foot" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={`btn ${danger ? "danger" : "primary"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- page ---------- */
function DogRunsAdminPage() {
  const dogRuns = useQuery(api.dogRuns.listAll) as DogRunRow[] | undefined;
  const addDogRun = useMutation(api.dogRuns.add);
  const updateDogRun = useMutation(api.dogRuns.update);
  const removeDogRun = useMutation(api.dogRuns.remove);

  const [q, setQ] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [editing, setEditing] = useState<
    (FormState & { id?: Id<"dogRuns"> }) | null
  >(null);
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
    if (!dogRuns) return [];
    const ql = q.trim().toLowerCase();
    return dogRuns.filter((r) => {
      if (ql && !r.name.toLowerCase().includes(ql)) return false;
      if (areaFilter !== "all" && r.area !== areaFilter) return false;
      return true;
    });
  }, [dogRuns, q, areaFilter]);

  const handleAdd = () => {
    setEditing({ ...EMPTY_FORM });
  };

  const handleEdit = (run: DogRunRow) => {
    setEditing({
      id: run._id,
      sortOrder: String(run.sortOrder),
      name: run.name,
      area: run.area,
      size: run.size,
      address: run.address,
      waterPoint: run.waterPoint,
      description: run.description ?? "",
      openingHours: run.openingHours ?? "",
      image: run.image ?? "",
      map: run.map ?? "",
      website: run.website ?? "",
    });
  };

  const handleSave = async (form: FormState) => {
    if (!editing) return;

    const fields = {
      sortOrder: Number(form.sortOrder),
      name: form.name,
      area: form.area,
      size: form.size,
      address: form.address,
      waterPoint: form.waterPoint,
      description: form.description || undefined,
      openingHours: form.openingHours || undefined,
      image: form.image || undefined,
      map: form.map || undefined,
      website: form.website || undefined,
    };

    if (!editing.id) {
      await addDogRun(fields);
      flash(`Added ${form.name}`);
    } else {
      await updateDogRun({ id: editing.id, ...fields });
      flash(`Updated ${form.name}`);
    }
    setEditing(null);
  };

  const handleDelete = (run: DogRunRow) => {
    setConfirm({
      title: "Delete this dog run?",
      body: (
        <>
          <b>{run.name}</b> will be removed from the directory. This can&rsquo;t
          be undone.
        </>
      ),
      confirmLabel: "Delete",
      danger: true,
      onConfirm: async () => {
        await removeDogRun({ id: run._id });
        flash(`Deleted ${run.name}`);
        setConfirm(null);
      },
    });
  };

  if (dogRuns === undefined) {
    return (
      <div className="page" style={{ color: "var(--muted)" }}>
        Loading…
      </div>
    );
  }

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <h1>
            Manage <em>dog runs.</em>
          </h1>
          <p>Create, edit, and remove dog runs in the directory.</p>
        </div>
        <div className="actions-row">
          <button className="btn primary" onClick={handleAdd}>
            <PlusIcon /> Add a dog run
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by name…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <label className="filter-select" aria-label="Filter by area">
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
          >
            <option value="all">All areas</option>
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <span className="stat-chip">
          {dogRuns.length} total · {filtered.length} shown
        </span>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty">
            <h3>
              {dogRuns.length === 0
                ? "No dog runs in the directory"
                : "No matches"}
            </h3>
            <p>
              {dogRuns.length === 0
                ? "Add your first dog run to get started."
                : "Try a different search."}
            </p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Area</th>
                <th>Size</th>
                <th>Address</th>
                <th>Water</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((run) => (
                <tr key={run._id}>
                  <td style={{ color: "var(--muted)", width: 40 }}>
                    {run.sortOrder}
                  </td>
                  <td>
                    <div className="row-name">{run.name}</div>
                    {run.description && (
                      <div
                        className="row-sub"
                        style={{
                          maxWidth: 320,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {run.description}
                      </div>
                    )}
                  </td>
                  <td>{run.area}</td>
                  <td>{run.size}</td>
                  <td style={{ color: "var(--muted)" }}>{run.address}</td>
                  <td>
                    {run.waterPoint ? (
                      <span className="pill hdb-yes">Yes</span>
                    ) : (
                      <span className="pill hdb-no">No</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="icon-btn"
                        onClick={() => handleEdit(run)}
                        aria-label={`Edit ${run.name}`}
                        title="Edit"
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="icon-btn danger"
                        onClick={() => handleDelete(run)}
                        aria-label={`Delete ${run.name}`}
                        title="Delete"
                      >
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

      {editing && (
        <DogRunForm
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
          <CheckIcon /> {toast}
        </div>
      )}
    </main>
  );
}
