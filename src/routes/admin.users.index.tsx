import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useMemo, useEffect } from "react";
import adminCss from "~/styles/admin.css?url";

export const Route = createFileRoute("/admin/users/")({
  head: () => ({
    links: [{ rel: "stylesheet", href: adminCss }],
  }),
  component: UsersAdminPage,
});

/* ---------- icons ---------- */
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

/* ---------- types ---------- */
type WelfareGroupOption = { _id: Id<"welfareGroups">; name: string };

type CreateFormState = {
  email: string;
  password: string;
  welfareGroupId: Id<"welfareGroups"> | "";
};

const EMPTY_FORM: CreateFormState = {
  email: "",
  password: "",
  welfareGroupId: "",
};

/* ---------- CreateUserForm modal ---------- */
function CreateUserForm({
  welfareGroups,
  onSave,
  onClose,
}: {
  welfareGroups: WelfareGroupOption[];
  onSave: (form: CreateFormState) => Promise<void>;
  onClose: () => void;
}) {
  const [d, setD] = useState<CreateFormState>(EMPTY_FORM);
  const [errs, setErrs] = useState<Partial<Record<keyof CreateFormState, string>>>({});
  const [serverErr, setServerErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
    (k: keyof CreateFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setD((p) => ({ ...p, [k]: e.target.value }));
      setErrs((p) => ({ ...p, [k]: undefined }));
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrs: typeof errs = {};
    if (!d.email.trim()) nextErrs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
      nextErrs.email = "Invalid email";
    if (!d.password) nextErrs.password = "Required";
    else if (d.password.length < 8)
      nextErrs.password = "Must be at least 8 characters";
    setErrs(nextErrs);
    if (Object.keys(nextErrs).length) return;
    setServerErr(null);
    setSaving(true);
    try {
      await onSave(d);
    } catch (err) {
      setServerErr(err instanceof Error ? err.message : "Failed to create user");
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
          <h2>Create a new user</h2>
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
              <label htmlFor="f-email">Email *</label>
              <input
                id="f-email"
                type="email"
                value={d.email}
                onChange={set("email")}
                placeholder="user@example.com"
                autoComplete="off"
              />
              {errs.email && <small className="field-err">{errs.email}</small>}
            </div>

            <div className="field full">
              <label htmlFor="f-password">Password *</label>
              <input
                id="f-password"
                type="password"
                value={d.password}
                onChange={set("password")}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
              />
              {errs.password && (
                <small className="field-err">{errs.password}</small>
              )}
            </div>

            <div className="field full">
              <label htmlFor="f-welfare-group">Welfare group</label>
              <select
                id="f-welfare-group"
                value={d.welfareGroupId}
                onChange={set("welfareGroupId")}
              >
                <option value="">— None —</option>
                {welfareGroups.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>
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
              <CheckIcon /> {saving ? "Creating…" : "Create user"}
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
function UsersAdminPage() {
  const users = useQuery(api.users.list);
  const welfareGroups = (useQuery(api.welfareGroups.list, {}) ??
    []) as WelfareGroupOption[];
  const createUser = useAction(api.users.createUser);
  const removeUser = useMutation(api.users.remove);

  const [q, setQ] = useState("");
  const [showCreate, setShowCreate] = useState(false);
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
    if (!users) return [];
    const ql = q.trim().toLowerCase();
    if (!ql) return users;
    return users.filter((u) =>
      (u.email ?? "").toLowerCase().includes(ql) ||
      (u.name ?? "").toLowerCase().includes(ql),
    );
  }, [users, q]);

  const handleCreate = async (form: CreateFormState) => {
    await createUser({
      email: form.email,
      password: form.password,
      welfareGroupId: form.welfareGroupId || undefined,
    });
    flash(`Created ${form.email}`);
    setShowCreate(false);
  };

  const handleDelete = (user: { _id: Id<"users">; email?: string }) => {
    setConfirm({
      title: "Delete this user?",
      body: (
        <>
          <b>{user.email ?? "This user"}</b> will be permanently removed. This
          can&rsquo;t be undone.
        </>
      ),
      confirmLabel: "Delete",
      danger: true,
      onConfirm: async () => {
        await removeUser({ id: user._id });
        flash(`Deleted ${user.email ?? "user"}`);
        setConfirm(null);
      },
    });
  };

  if (users === undefined) {
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
            Manage <em>users.</em>
          </h1>
          <p>Create and remove user accounts.</p>
        </div>
        <div className="actions-row">
          <button
            className="btn primary"
            onClick={() => setShowCreate(true)}
          >
            <PlusIcon /> Create user
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by email…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <span className="stat-chip">
          {users.length} total · {filtered.length} shown
        </span>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty">
            <h3>{users.length === 0 ? "No users yet" : "No matches"}</h3>
            <p>
              {users.length === 0
                ? "Create the first user to get started."
                : "Try a different search."}
            </p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Welfare group</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="row-name">{user.email ?? "—"}</div>
                  </td>
                  <td>{user.name ?? "—"}</td>
                  <td>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background:
                          user.role === "Admin"
                            ? "var(--accent)"
                            : "var(--surface)",
                        color:
                          user.role === "Admin" ? "#fff" : "var(--muted)",
                        border:
                          user.role === "Admin"
                            ? "none"
                            : "1px solid var(--border)",
                      }}
                    >
                      {user.role ?? "Member"}
                    </span>
                  </td>
                  <td>
                    {user.welfareGroupId
                      ? (groupMap.get(user.welfareGroupId) ?? "—")
                      : "—"}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="icon-btn danger"
                      title="Delete user"
                      onClick={() => handleDelete(user)}
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showCreate && (
        <CreateUserForm
          welfareGroups={welfareGroups}
          onSave={handleCreate}
          onClose={() => setShowCreate(false)}
        />
      )}

      {confirm && (
        <Confirm
          {...confirm}
          onClose={() => setConfirm(null)}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
