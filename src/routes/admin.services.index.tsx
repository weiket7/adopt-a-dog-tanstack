import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useMemo, useEffect, useRef } from "react";
import adminCss from "~/styles/admin.css?url";
import { SERVICE_CATEGORIES as CATEGORIES } from "~/constants/serviceCategories";

export const Route = createFileRoute("/admin/services/")({
  head: () => ({
    links: [{ rel: "stylesheet", href: adminCss }],
  }),
  component: ServicesAdminPage,
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
type ServiceRow = {
  _id: Id<"services">;
  name: string;
  category: string;
  blurb: string;
  area: string;
  address?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  imageStorageId?: Id<"_storage">;
  imageUrl: string | null;
  featured: boolean | false;
};

type FormState = {
  name: string;
  category: string;
  blurb: string;
  area: string;
  address: string;
  website: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  featured: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  category: CATEGORIES[0],
  blurb: "",
  area: "",
  address: "",
  website: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  featured: false,
};

/* ---------- ServiceForm ---------- */
function ServiceForm({
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
  const [errs, setErrs] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [serverErr, setServerErr] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      setD((p) => ({ ...p, [k]: e.target.value }));
      setErrs((p) => ({ ...p, [k]: undefined }));
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrs: typeof errs = {};
    if (!d.name.trim()) nextErrs.name = "Required";
    setErrs(nextErrs);
    if (Object.keys(nextErrs).length) return;
    setServerErr(null);
    setSaving(true);
    try {
      await onSave(d, file);
    } catch (err) {
      setServerErr(err instanceof Error ? err.message : "Failed to save");
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
          <h2>{isNew ? "Add a new service" : `Edit ${d.name}`}</h2>
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
                placeholder="e.g. Pawsome Grooming"
              />
              {errs.name && <small className="field-err">{errs.name}</small>}
            </div>

            <div className="field">
              <label htmlFor="f-category">Category *</label>
              <select
                id="f-category"
                value={d.category}
                onChange={set("category")}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="f-area">Area</label>
              <input
                id="f-area"
                type="text"
                value={d.area}
                onChange={set("area")}
                placeholder="e.g. Tampines"
              />
            </div>

            <div className="field full">
              <label htmlFor="f-address">Address</label>
              <input
                id="f-address"
                type="text"
                value={d.address}
                onChange={set("address")}
                placeholder="e.g. 123 Main Street"
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
              <label htmlFor="f-instagram">Instagram</label>
              <input
                id="f-instagram"
                type="text"
                value={d.instagram}
                onChange={set("instagram")}
                placeholder="https://…"
              />
            </div>

            <div className="field full">
              <label htmlFor="f-facebook">Facebook</label>
              <input
                id="f-facebook"
                type="text"
                value={d.facebook}
                onChange={set("facebook")}
                placeholder="https://…"
              />
            </div>

            <div className="field full">
              <label htmlFor="f-tiktok">TikTok</label>
              <input
                id="f-tiktok"
                type="text"
                value={d.tiktok}
                onChange={set("tiktok")}
                placeholder="https://…"
              />
            </div>

            <div className="field">
              <label>Featured</label>
              <div
                className="seg-input cols-2"
                role="radiogroup"
                aria-label="Featured"
              >
                <button
                  type="button"
                  aria-pressed={d.featured === true}
                  onClick={() => setD((p) => ({ ...p, featured: true }))}
                >
                  Yes
                </button>
                <button
                  type="button"
                  aria-pressed={d.featured === false}
                  onClick={() => setD((p) => ({ ...p, featured: false }))}
                >
                  No
                </button>
              </div>
            </div>

            <div className="field full">
              <label>Photo</label>
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
              <label htmlFor="f-blurb">Description</label>
              <textarea
                id="f-blurb"
                value={d.blurb}
                onChange={set("blurb")}
                placeholder="A short description of the service…"
              />
            </div>
          </div>
          {serverErr && (
            <p style={{ color: "var(--bad)", fontSize: 13, marginTop: 8 }}>
              {serverErr}
            </p>
          )}
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
              {saving
                ? isNew
                  ? "Adding…"
                  : "Saving…"
                : isNew
                  ? "Add service"
                  : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ---------- Confirm ---------- */
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
function ServicesAdminPage() {
  const services = useQuery(api.services.listAll) as ServiceRow[] | undefined;
  const createService = useMutation(api.services.create);
  const updateService = useMutation(api.services.update);
  const removeService = useMutation(api.services.remove);
  const generateUploadUrl = useAction(api.services.generateUploadUrl);

  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [editing, setEditing] = useState<{
    form: FormState;
    id: Id<"services"> | null;
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
    if (!services) return [];
    const ql = q.trim().toLowerCase();
    return services.filter((s) => {
      if (ql) {
        const hay = (s.name + " " + s.blurb + " " + s.area).toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      if (catFilter !== "all" && s.category !== catFilter) return false;
      return true;
    });
  }, [services, q, catFilter]);

  const handleAdd = () =>
    setEditing({ form: EMPTY_FORM, id: null, imageUrl: null });

  const handleEdit = (s: ServiceRow) =>
    setEditing({
      form: {
        name: s.name,
        category: s.category,
        blurb: s.blurb,
        area: s.area,
        address: s.address ?? "",
        website: s.website ?? "",
        instagram: s.instagram ?? "",
        facebook: s.facebook ?? "",
        tiktok: s.tiktok ?? "",
        featured: s.featured,
      },
      id: s._id,
      imageUrl: s.imageUrl,
    });

  const handleSave = async (form: FormState, file: File | null) => {
    if (!editing) return;

    let imageStorageId: Id<"_storage"> | undefined;
    if (file) {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = (await res.json()) as { storageId: Id<"_storage"> };
      imageStorageId = storageId;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category,
      blurb: form.blurb ? form.blurb.trim() : undefined,
      area: form.area ? form.area.trim() : undefined,
      address: form.address ? form.address.trim() : undefined,
      website: form.website ? form.website.trim() : undefined,
      instagram: form.instagram ? form.instagram.trim() : undefined,
      facebook: form.facebook ? form.facebook.trim() : undefined,
      tiktok: form.tiktok ? form.tiktok.trim() : undefined,
      featured: form.featured,
    };

    if (editing.id === null) {
      await createService({
        ...payload,
        ...(imageStorageId ? { imageStorageId } : {}),
      });
      flash(`Added ${form.name}`);
    } else {
      await updateService({
        id: editing.id,
        ...payload,
        ...(imageStorageId ? { imageStorageId } : {}),
      });
      flash(`Updated ${form.name}`);
    }
    setEditing(null);
  };

  const handleDelete = (s: ServiceRow) => {
    setConfirm({
      title: "Delete this service?",
      body: (
        <>
          <b>{s.name}</b> will be permanently removed. This can&rsquo;t be
          undone.
        </>
      ),
      confirmLabel: "Delete",
      danger: true,
      onConfirm: async () => {
        await removeService({ id: s._id });
        flash(`Deleted ${s.name}`);
        setConfirm(null);
      },
    });
  };

  if (services === undefined) {
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
            Manage <em>services.</em>
          </h1>
          <p>Create, edit, and remove pet services shown on the public site.</p>
        </div>
        <div className="actions-row">
          <button className="btn primary" onClick={handleAdd}>
            <PlusIcon /> Add a service
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by name, description, or area…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <label className="filter-select narrow" aria-label="Filter by category">
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <span className="stat-chip">
          {services.length} total · {filtered.length} shown
        </span>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty">
            <h3>{services.length === 0 ? "No services yet" : "No matches"}</h3>
            <p>
              {services.length === 0
                ? "Add your first service to get started."
                : "Try a different search."}
            </p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th className="col-photo" />
                <th>Name</th>
                <th className="col-kind">Category</th>
                <th className="col-location">Area</th>
                <th>Featured</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id}>
                  <td className="col-photo">
                    <span className="row-photo">
                      {s.imageUrl && (
                        <img src={s.imageUrl} alt={s.name} loading="lazy" />
                      )}
                    </span>
                  </td>
                  <td>
                    <div className="row-title">{s.name}</div>
                    {s.blurb && (
                      <div
                        className="row-sub"
                        style={{
                          maxWidth: 320,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.blurb}
                      </div>
                    )}
                  </td>
                  <td className="col-kind">
                    <span
                      className={`pill kind-${s.category.toLowerCase().replace(/[^a-z]/g, "")}`}
                    >
                      {s.category}
                    </span>
                  </td>
                  <td
                    className="col-location"
                    style={{ color: "var(--ink-2)" }}
                  >
                    {s.area}
                  </td>
                  <td style={{ color: "var(--muted)", fontSize: 13 }}>
                    {s.featured && (
                      <span
                        className={`pill status-${(s.featured ? "Active" : "Inactive").toLowerCase()}`}
                      >
                        <span className="status-dot"></span>
                        Featured
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="icon-btn"
                        onClick={() => handleEdit(s)}
                        title="Edit"
                        aria-label={`Edit ${s.name}`}
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="icon-btn danger"
                        onClick={() => handleDelete(s)}
                        title="Delete"
                        aria-label={`Delete ${s.name}`}
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

      {editing !== null && (
        <ServiceForm
          initial={editing.form}
          initialImageUrl={editing.imageUrl}
          isNew={editing.id === null}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      {confirm && <Confirm {...confirm} onClose={() => setConfirm(null)} />}

      {toast && (
        <div className="toast">
          <CheckIcon /> {toast}
        </div>
      )}
    </main>
  );
}
