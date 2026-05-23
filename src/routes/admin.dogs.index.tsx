import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useMemo, useEffect, useRef } from "react";
import adminCss from "~/styles/admin.css?url";

export const Route = createFileRoute("/admin/dogs/")({
  head: () => ({
    links: [{ rel: "stylesheet", href: adminCss }],
  }),
  component: DogsAdminPage,
});

/* ---------- icons ---------- */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/>
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 6l12 12M18 6 6 18"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 12 10 18 20 6"/>
  </svg>
);

/* ---------- types ---------- */
type DogRow = {
  _id: Id<"dogs">;
  name: string;
  gender: "Male" | "Female";
  hdbApproved: "Yes" | "No";
  birthday?: string;
  description?: string;
  imageStorageId?: Id<"_storage">;
  imageUrl: string | null;
  status?: "active" | "inactive";
};

type FormState = {
  name: string;
  gender: "Male" | "Female";
  hdbApproved: "Yes" | "No";
  birthday: string;
  description: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  gender: "Female",
  hdbApproved: "Yes",
  birthday: "",
  description: "",
};

/* ---------- DogForm modal ---------- */
function DogForm({
  initial,
  initialImageUrl,
  onSave,
  onClose,
}: {
  initial: FormState & { id?: Id<"dogs"> };
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
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setD((p) => ({ ...p, [k]: e.target.value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrs: typeof errs = {};
    if (!d.name.trim()) nextErrs.name = "Required";
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
      <form className="dialog" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <div className="dialog-head">
          <h2>{isNew ? "Add a new dog" : `Edit ${initial.name}`}</h2>
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="dialog-body">
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="f-name">Name *</label>
              <input id="f-name" type="text" value={d.name} onChange={set("name")} placeholder="e.g. Mochi" />
              {errs.name && <small className="field-err">{errs.name}</small>}
            </div>

            <div className="field">
              <label htmlFor="f-birthday">Birthday</label>
              <input id="f-birthday" type="text" value={d.birthday} onChange={set("birthday")} placeholder="e.g. 12 Mar 2023" />
            </div>

            <div className="field">
              <label>Gender</label>
              <div className="seg-input cols-2" role="radiogroup" aria-label="Gender">
                <button type="button" aria-pressed={d.gender === "Female"} onClick={() => setD((p) => ({ ...p, gender: "Female" }))}>Female</button>
                <button type="button" aria-pressed={d.gender === "Male"} onClick={() => setD((p) => ({ ...p, gender: "Male" }))}>Male</button>
              </div>
            </div>

            <div className="field">
              <label>HDB approved</label>
              <div className="seg-input cols-2" role="radiogroup" aria-label="HDB approved">
                <button type="button" aria-pressed={d.hdbApproved === "Yes"} onClick={() => setD((p) => ({ ...p, hdbApproved: "Yes" }))}>Yes</button>
                <button type="button" aria-pressed={d.hdbApproved === "No"} onClick={() => setD((p) => ({ ...p, hdbApproved: "No" }))}>No</button>
              </div>
            </div>

            <div className="field full">
              <label>Photo</label>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {previewUrl && (
                  <span className="row-photo" style={{ width: 56, height: 56, flexShrink: 0 }}>
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
              <label htmlFor="f-description">About</label>
              <textarea
                id="f-description"
                value={d.description}
                onChange={set("description")}
                placeholder="A short description of the dog's personality, history, and what kind of home they'd love…"
              />
            </div>
          </div>
        </div>

        <div className="dialog-foot">
          <span style={{ alignSelf: "center", fontSize: 12, color: "var(--muted)" }}>* required</span>
          <div className="right">
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary" disabled={saving}>
              <CheckIcon /> {saving ? "Saving…" : isNew ? "Add dog" : "Save changes"}
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
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
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
function DogsAdminPage() {
  const dogs = useQuery(api.dogs.all) as DogRow[] | undefined;
  const addDog = useMutation(api.dogs.add);
  const updateDog = useMutation(api.dogs.update);
  const removeDog = useMutation(api.dogs.remove);
  const generateUploadUrl = useAction(api.dogs.generateUploadUrl);

  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<(FormState & { id?: Id<"dogs"> }) | null>(null);
  const [editingImageUrl, setEditingImageUrl] = useState<string | null>(null);
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
    if (!dogs) return [];
    const ql = q.trim().toLowerCase();
    if (!ql) return dogs;
    return dogs.filter((d) => d.name.toLowerCase().includes(ql));
  }, [dogs, q]);

  const handleAdd = () => {
    setEditing({ ...EMPTY_FORM });
    setEditingImageUrl(null);
  };

  const handleEdit = (dog: DogRow) => {
    setEditing({
      id: dog._id,
      name: dog.name,
      gender: dog.gender,
      hdbApproved: dog.hdbApproved,
      birthday: dog.birthday ?? "",
      description: dog.description ?? "",
    });
    setEditingImageUrl(dog.imageUrl);
  };

  const handleSave = async (form: FormState, file: File | null) => {
    let imageStorageId: Id<"_storage"> | undefined;

    if (file) {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await res.json();
      imageStorageId = storageId;
    }

    if (!editing) return;

    if (!editing.id) {
      await addDog({
        name: form.name,
        gender: form.gender,
        hdbApproved: form.hdbApproved,
        birthday: form.birthday || undefined,
        description: form.description || undefined,
        imageStorageId,
      });
      flash(`Added ${form.name}`);
    } else {
      await updateDog({
        id: editing.id,
        name: form.name,
        gender: form.gender,
        hdbApproved: form.hdbApproved,
        birthday: form.birthday || undefined,
        description: form.description || undefined,
        ...(imageStorageId ? { imageStorageId } : {}),
      });
      flash(`Updated ${form.name}`);
    }
    setEditing(null);
  };

  const handleDelete = (dog: DogRow) => {
    setConfirm({
      title: "Delete this dog?",
      body: (
        <>
          <b>{dog.name}</b> will be removed from the directory. This can&rsquo;t be undone.
        </>
      ),
      confirmLabel: "Delete",
      danger: true,
      onConfirm: async () => {
        await removeDog({ id: dog._id });
        flash(`Deleted ${dog.name}`);
        setConfirm(null);
      },
    });
  };

  if (dogs === undefined) {
    return <div className="page" style={{ color: "var(--muted)" }}>Loading…</div>;
  }

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <h1>Manage <em>dogs.</em></h1>
          <p>Create, edit, and remove dogs in the adoption directory.</p>
        </div>
        <div className="actions-row">
          <button className="btn primary" onClick={handleAdd}>
            <PlusIcon /> Add a dog
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
        <span className="stat-chip">{dogs.length} total · {filtered.length} shown</span>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty">
            <h3>{dogs.length === 0 ? "No dogs in the directory" : "No matches"}</h3>
            <p>{dogs.length === 0 ? "Add your first dog to get started." : "Try a different search."}</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th className="col-photo"></th>
                <th>Name</th>
                <th className="col-meta">Gender</th>
                <th className="col-birthday">Birthday</th>
                <th>HDB</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dog) => (
                <tr key={dog._id}>
                  <td className="col-photo">
                    <span className="row-photo">
                      {dog.imageUrl && <img src={dog.imageUrl} alt={dog.name} loading="lazy" />}
                    </span>
                  </td>
                  <td>
                    <div className="row-name">{dog.name}</div>
                    {dog.description && (
                      <div className="row-sub" style={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {dog.description}
                      </div>
                    )}
                  </td>
                  <td className="col-meta">{dog.gender}</td>
                  <td className="col-birthday" style={{ color: "var(--muted)" }}>{dog.birthday || "—"}</td>
                  <td>
                    {dog.hdbApproved === "Yes"
                      ? <span className="pill hdb-yes">HDB ✓</span>
                      : <span className="pill hdb-no">Landed</span>}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" onClick={() => handleEdit(dog)} aria-label={`Edit ${dog.name}`} title="Edit">
                        <EditIcon />
                      </button>
                      <button className="icon-btn danger" onClick={() => handleDelete(dog)} aria-label={`Delete ${dog.name}`} title="Delete">
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
        <DogForm
          initial={editing}
          initialImageUrl={editingImageUrl}
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
