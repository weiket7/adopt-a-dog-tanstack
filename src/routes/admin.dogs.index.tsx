import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useMemo, useEffect, useRef } from "react";
import adminCss from "~/styles/admin.css?url";
import { Icon } from "~/components/Icon";
import { uploadDogImage } from "~/server/upload";

export const Route = createFileRoute("/admin/dogs/")({
  head: () => ({
    links: [{ rel: "stylesheet", href: adminCss }],
  }),
  component: DogsAdminPage,
});

/* ---------- MonthYearPicker ---------- */

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function MonthYearPicker({
  value,
  onChange,
}: {
  value: string; // YYYY-MM-01 or ""
  onChange: (v: string) => void;
}) {
  const year = value ? value.slice(0, 4) : "";
  const month = value ? value.slice(5, 7) : "";

  const update = (y: string, m: string) => {
    onChange(y && m ? `${y}-${m}-01` : "");
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <select
        value={month}
        onChange={(e) => update(year, e.target.value)}
        style={{ flex: 2 }}
      >
        <option value="">Month</option>
        {MONTHS.map((name, i) => {
          const val = String(i + 1).padStart(2, "0");
          return (
            <option key={val} value={val}>
              {name}
            </option>
          );
        })}
      </select>
      <select
        value={year}
        onChange={(e) => update(e.target.value, month)}
        style={{ flex: 1 }}
      >
        <option value="">Year</option>
        {YEARS.map((y) => (
          <option key={y} value={String(y)}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ---------- types ---------- */
type DogRow = {
  _id: Id<"dogs">;
  name: string;
  gender: "Male" | "Female";
  hdbApproved: "Yes" | "No";
  birthday?: string;
  description?: string;
  welfareGroupId?: Id<"welfareGroups">;
  imageUrl: string | null;
  status: "Active" | "Inactive";
};

type FormState = {
  name: string;
  gender: "Male" | "Female";
  hdbApproved: "Yes" | "No";
  birthday: string;
  description: string;
  welfareGroupId: Id<"welfareGroups"> | "";
  status: "Active" | "Inactive";
};

const EMPTY_FORM: FormState = {
  name: "",
  gender: "Female",
  hdbApproved: "Yes",
  birthday: "",
  description: "",
  welfareGroupId: "",
  status: "Active",
};

type WelfareGroupOption = { _id: Id<"welfareGroups">; name: string };

/* ---------- DogForm modal ---------- */
function DogForm({
  initial,
  initialImageUrl,
  welfareGroups,
  onSave,
  onClose,
}: {
  initial: FormState & { id?: Id<"dogs"> };
  initialImageUrl: string | null;
  welfareGroups: WelfareGroupOption[];
  onSave: (form: FormState, file: File | null) => Promise<void>;
  onClose: () => void;
}) {
  const [d, setD] = useState<FormState>(initial);
  const [errs, setErrs] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const isNew = !initial.id;
  const role = useQuery(api.users.role);

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
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      <form
        className="dialog"
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog-head">
          <h2>{isNew ? "Add a new dog" : `Edit ${initial.name}`}</h2>
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
                placeholder="e.g. Mochi"
              />
              {errs.name && <small className="field-err">{errs.name}</small>}
            </div>

            <div className="field">
              <label>Birthday</label>
              <MonthYearPicker
                value={d.birthday}
                onChange={(v) => setD((p) => ({ ...p, birthday: v }))}
              />
            </div>

            <div className="field">
              <label>Gender</label>
              <div
                className="seg-input cols-2"
                role="radiogroup"
                aria-label="Gender"
              >
                <button
                  id="gender-female"
                  type="button"
                  aria-pressed={d.gender === "Female"}
                  onClick={() => setD((p) => ({ ...p, gender: "Female" }))}
                >
                  Female
                </button>
                <button
                  id="gender-male"
                  type="button"
                  aria-pressed={d.gender === "Male"}
                  onClick={() => setD((p) => ({ ...p, gender: "Male" }))}
                >
                  Male
                </button>
              </div>
            </div>

            <div className="field">
              <label>HDB approved</label>
              <div
                className="seg-input cols-2"
                role="radiogroup"
                aria-label="HDB approved"
              >
                <button
                  id="hdb-yes"
                  type="button"
                  aria-pressed={d.hdbApproved === "Yes"}
                  onClick={() => setD((p) => ({ ...p, hdbApproved: "Yes" }))}
                >
                  Yes
                </button>
                <button
                  id="hdb-no"
                  type="button"
                  aria-pressed={d.hdbApproved === "No"}
                  onClick={() => setD((p) => ({ ...p, hdbApproved: "No" }))}
                >
                  No
                </button>
              </div>
            </div>

            <div className="field">
              <label>Status</label>
              <div
                className="seg-input cols-2"
                role="radiogroup"
                aria-label="Status"
              >
                <button
                  type="button"
                  aria-pressed={d.status === "Active"}
                  onClick={() => setD((p) => ({ ...p, status: "Active" }))}
                >
                  Active
                </button>
                <button
                  type="button"
                  aria-pressed={d.status === "Inactive"}
                  onClick={() => setD((p) => ({ ...p, status: "Inactive" }))}
                >
                  Inactive
                </button>
              </div>
            </div>

            {role === "Admin" && (
              <div className="field">
                <label htmlFor="f-welfare-group">Welfare Group</label>
                <select
                  id="f-welfare-group"
                  value={d.welfareGroupId}
                  onChange={(e) =>
                    setD((p) => ({
                      ...p,
                      welfareGroupId: e.target.value as
                        | Id<"welfareGroups">
                        | "",
                    }))
                  }
                >
                  <option value="">— None —</option>
                  {welfareGroups.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                  id="image"
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
              {saving ? "Saving…" : isNew ? "Add dog" : "Save changes"}
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
function DogsAdminPage() {
  const dogs = useQuery(api.dogs.all) as DogRow[] | undefined;
  const welfareGroups = (useQuery(api.welfareGroups.list, {}) ??
    []) as WelfareGroupOption[];
  const addDog = useMutation(api.dogs.add);
  const updateDog = useMutation(api.dogs.update);
  const removeDog = useMutation(api.dogs.remove);

  const [q, setQ] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState<
    (FormState & { id?: Id<"dogs"> }) | null
  >(null);
  const [editingImageUrl, setEditingImageUrl] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{
    title: string;
    body: React.ReactNode;
    confirmLabel: string;
    danger: boolean;
    onConfirm: () => void;
  } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const groupMap = useMemo(
    () => new Map(welfareGroups.map((g) => [g._id, g.name])),
    [welfareGroups],
  );

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const filtered = useMemo(() => {
    if (!dogs) return [];
    const ql = q.trim().toLowerCase();
    return dogs.filter((d) => {
      if (ql && !d.name.toLowerCase().includes(ql)) return false;
      if (groupFilter === "none") {
        if (d.welfareGroupId != null) return false;
      } else if (groupFilter !== "all") {
        if (d.welfareGroupId !== groupFilter) return false;
      }
      if (statusFilter !== "all") {
        const dogStatus = d.status ?? "Active";
        if (dogStatus !== statusFilter) return false;
      }
      return true;
    });
  }, [dogs, q, groupFilter, statusFilter]);

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
      welfareGroupId: (dog.welfareGroupId ?? "") as Id<"welfareGroups"> | "",
      status: dog.status ?? "Active",
    });
    setEditingImageUrl(dog.imageUrl);
  };

  const handleSave = async (form: FormState, file: File | null) => {
    let image: string | undefined;

    if (file) {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadDogImage({ data: formData });
      image = result.url;
    }

    if (!editing) return;

    const welfareGroupId = form.welfareGroupId || undefined;

    if (!editing.id) {
      await addDog({
        name: form.name,
        gender: form.gender,
        hdbApproved: form.hdbApproved,
        birthday: form.birthday || undefined,
        description: form.description || undefined,
        welfareGroupId,
        image,
        status: form.status,
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
        welfareGroupId,
        ...(image ? { image } : {}),
        status: form.status,
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
          <b>{dog.name}</b> will be removed from the directory. This can&rsquo;t
          be undone.
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
            Manage <em>dogs.</em>
          </h1>
          <p>Create, edit, and remove dogs in the adoption directory.</p>
        </div>
        <div className="actions-row">
          <button
            id="btn-add-a-dog"
            className="btn primary"
            onClick={handleAdd}
          >
            <Icon.Plus /> Add a dog
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
        <label className="filter-select" aria-label="Filter by welfare group">
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
          >
            <option value="all">All welfare groups</option>
            <option value="none">— Unassigned —</option>
            {welfareGroups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
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
        <span className="stat-chip">
          {dogs.length} total · {filtered.length} shown
        </span>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty">
            <h3>
              {dogs.length === 0 ? "No dogs in the directory" : "No matches"}
            </h3>
            <p>
              {dogs.length === 0
                ? "Add your first dog to get started."
                : "Try a different search."}
            </p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th className="col-meta">Gender</th>
                <th className="col-birthday">Birthday</th>
                <th className="col-group">Welfare group</th>
                <th>HDB</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dog) => (
                <tr key={dog._id}>
                  <td>
                    <div className="row-name">{dog.name}</div>
                    {dog.description && (
                      <div
                        className="row-sub"
                        style={{
                          maxWidth: 320,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {dog.description}
                      </div>
                    )}
                  </td>
                  <td className="col-meta">{dog.gender}</td>
                  <td
                    className="col-birthday"
                    style={{ color: "var(--muted)" }}
                  >
                    {dog.birthday || "—"}
                  </td>
                  <td className="col-group">
                    {dog.welfareGroupId && groupMap.get(dog.welfareGroupId) ? (
                      <span className="group-tag">
                        {groupMap.get(dog.welfareGroupId)}
                      </span>
                    ) : (
                      <span style={{ color: "var(--muted)" }}>—</span>
                    )}
                  </td>
                  <td>
                    {dog.hdbApproved === "Yes" ? (
                      <span className="pill hdb-yes">HDB ✓</span>
                    ) : (
                      <span className="pill hdb-no">Landed</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`pill status-${(dog.status ?? "Active").toLowerCase()}`}
                    >
                      <span className="status-dot"></span>
                      {dog.status === "Inactive" ? "Inactive" : "Active"}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="icon-btn"
                        onClick={() => handleEdit(dog)}
                        aria-label={`Edit ${dog.name}`}
                        title="Edit"
                      >
                        <Icon.Edit />
                      </button>
                      <button
                        className="icon-btn danger"
                        onClick={() => handleDelete(dog)}
                        aria-label={`Delete ${dog.name}`}
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
        <DogForm
          initial={editing}
          initialImageUrl={editingImageUrl}
          welfareGroups={welfareGroups}
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
