import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useMemo, useEffect, useRef } from "react";
import adminCss from "~/styles/admin.css?url";
import { Icon } from "~/components/Icon";
import { uploadDogRunImage } from "~/server/upload";

export const Route = createFileRoute("/admin/dog-runs/")({
  head: () => ({
    links: [{ rel: "stylesheet", href: adminCss }],
  }),
  component: DogRunsAdminPage,
});

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
  map: "",
  website: "",
};

const AREAS = ["Central", "East", "North", "North-East", "West"];

/* ---------- DogRunForm modal ---------- */
function DogRunForm({
  initial,
  initialImageUrl,
  onSave,
  onClose,
}: {
  initial: FormState & { id?: Id<"dogRuns"> };
  initialImageUrl: string | null;
  onSave: (form: FormState, file: File | null) => Promise<void>;
  onClose: () => void;
}) {
  const [d, setD] = useState<FormState>(initial);
  const [errs, setErrs] = useState<Partial<Record<keyof FormState, string>>>({});
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
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
      await onSave(d, file);
    } finally {
      setSaving(false);
    }
  };

  const previewUrl = file ? URL.createObjectURL(file) : initialImageUrl;

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
            <Icon.Close />
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
              <label>Image</label>
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
              <Icon.Check />{" "}
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
            <Icon.Close />
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
    (FormState & { id?: Id<"dogRuns">; imageUrl: string | null }) | null
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
    setEditing({ ...EMPTY_FORM, imageUrl: null });
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
      map: run.map ?? "",
      website: run.website ?? "",
      imageUrl: run.image ?? null,
    });
  };

  const handleSave = async (form: FormState, file: File | null) => {
    if (!editing) return;

    let image: string | undefined;
    if (file) {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("name", form.name.trim());
      const result = await uploadDogRunImage({ data: formData });
      image = result.url;
    }

    const fields = {
      sortOrder: Number(form.sortOrder),
      name: form.name,
      area: form.area,
      size: form.size,
      address: form.address,
      waterPoint: form.waterPoint,
      description: form.description || undefined,
      openingHours: form.openingHours || undefined,
      map: form.map || undefined,
      website: form.website || undefined,
    };

    if (!editing.id) {
      await addDogRun({ ...fields, ...(image ? { image } : {}) });
      flash(`Added ${form.name}`);
    } else {
      await updateDogRun({
        id: editing.id,
        ...fields,
        ...(image ? { image } : {}),
      });
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
            <Icon.Plus /> Add a dog run
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <Icon.Search />
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
                        <Icon.Edit />
                      </button>
                      <button
                        className="icon-btn danger"
                        onClick={() => handleDelete(run)}
                        aria-label={`Delete ${run.name}`}
                        title="Delete"
                      >
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

      {editing && (
        <DogRunForm
          initial={editing}
          initialImageUrl={editing.imageUrl}
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
          <Icon.Check /> {toast}
        </div>
      )}
    </main>
  );
}
