import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useMemo, useEffect } from "react";
import adminCss from "~/styles/admin.css?url";
import { Icon } from "~/components/Icon";

export const Route = createFileRoute("/admin/vets/")({
  head: () => ({
    links: [{ rel: "stylesheet", href: adminCss }],
  }),
  component: VetsAdminPage,
});

/* ---------- types ---------- */
type VetRow = {
  _id: Id<"vets">;
  name: string;
  block: string;
  street: string;
  floor?: string;
  unit?: string;
  building?: string;
  postalCode: string;
  openingHours: string;
  phone: string;
  area: string;
  emergency: string;
  publicHolidays: boolean;
  website?: string;
  facebook?: string;
  instagram?: string;
  email?: string;
};

type FormState = {
  name: string;
  block: string;
  street: string;
  floor: string;
  unit: string;
  building: string;
  postalCode: string;
  openingHours: string;
  phone: string;
  area: string;
  emergency: string;
  publicHolidays: boolean;
  website: string;
  facebook: string;
  instagram: string;
  email: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  block: "",
  street: "",
  floor: "",
  unit: "",
  building: "",
  postalCode: "",
  openingHours: "",
  phone: "",
  area: "",
  emergency: "",
  publicHolidays: false,
  website: "",
  facebook: "",
  instagram: "",
  email: "",
};

const AREAS = ["Central", "East", "North", "North-East", "West"];

/* ---------- VetForm modal ---------- */
function VetForm({
  initial,
  onSave,
  onClose,
}: {
  initial: FormState & { id?: Id<"vets"> };
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
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setD((p) => ({ ...p, [k]: e.target.value }));
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrs: typeof errs = {};
    if (!d.name.trim()) nextErrs.name = "Required";
    if (!d.block.trim()) nextErrs.block = "Required";
    if (!d.street.trim()) nextErrs.street = "Required";
    if (!d.postalCode.trim()) nextErrs.postalCode = "Required";
    if (!d.openingHours.trim()) nextErrs.openingHours = "Required";
    if (!d.phone.trim()) nextErrs.phone = "Required";
    if (!d.area.trim()) nextErrs.area = "Required";
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
          <h2>{isNew ? "Add a vet" : `Edit ${initial.name}`}</h2>
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
                placeholder="e.g. Gentle Paws Veterinary Clinic"
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
              <label htmlFor="f-phone">Phone *</label>
              <input
                id="f-phone"
                type="text"
                value={d.phone}
                onChange={set("phone")}
                placeholder="e.g. 6123 4567"
              />
              {errs.phone && <small className="field-err">{errs.phone}</small>}
            </div>

            <div className="field">
              <label htmlFor="f-block">Block *</label>
              <input
                id="f-block"
                type="text"
                value={d.block}
                onChange={set("block")}
                placeholder="e.g. 123"
              />
              {errs.block && <small className="field-err">{errs.block}</small>}
            </div>

            <div className="field">
              <label htmlFor="f-street">Street *</label>
              <input
                id="f-street"
                type="text"
                value={d.street}
                onChange={set("street")}
                placeholder="e.g. Orchard Road"
              />
              {errs.street && <small className="field-err">{errs.street}</small>}
            </div>

            <div className="field">
              <label htmlFor="f-floor">Floor</label>
              <input
                id="f-floor"
                type="text"
                value={d.floor}
                onChange={set("floor")}
                placeholder="e.g. 02"
              />
            </div>

            <div className="field">
              <label htmlFor="f-unit">Unit</label>
              <input
                id="f-unit"
                type="text"
                value={d.unit}
                onChange={set("unit")}
                placeholder="e.g. 45"
              />
            </div>

            <div className="field full">
              <label htmlFor="f-building">Building</label>
              <input
                id="f-building"
                type="text"
                value={d.building}
                onChange={set("building")}
                placeholder="e.g. Orchard Shopping Centre"
              />
            </div>

            <div className="field">
              <label htmlFor="f-postal-code">Postal Code *</label>
              <input
                id="f-postal-code"
                type="text"
                value={d.postalCode}
                onChange={set("postalCode")}
                placeholder="e.g. 238823"
              />
              {errs.postalCode && (
                <small className="field-err">{errs.postalCode}</small>
              )}
            </div>

            <div className="field">
              <label htmlFor="f-opening-hours">Opening Hours *</label>
              <input
                id="f-opening-hours"
                type="text"
                value={d.openingHours}
                onChange={set("openingHours")}
                placeholder="e.g. Mon–Fri 9am–6pm"
              />
              {errs.openingHours && (
                <small className="field-err">{errs.openingHours}</small>
              )}
            </div>

            <div className="field">
              <label htmlFor="f-emergency">Emergency</label>
              <input
                id="f-emergency"
                type="text"
                value={d.emergency}
                onChange={set("emergency")}
                placeholder="e.g. 24 hours, or leave blank if none"
              />
            </div>

            <div className="field">
              <label>Open on Public Holidays</label>
              <div
                className="seg-input cols-2"
                role="radiogroup"
                aria-label="Public Holidays"
              >
                <button
                  type="button"
                  aria-pressed={d.publicHolidays === true}
                  onClick={() => setD((p) => ({ ...p, publicHolidays: true }))}
                >
                  Yes
                </button>
                <button
                  type="button"
                  aria-pressed={d.publicHolidays === false}
                  onClick={() =>
                    setD((p) => ({ ...p, publicHolidays: false }))
                  }
                >
                  No
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="f-website">Website</label>
              <input
                id="f-website"
                type="text"
                value={d.website}
                onChange={set("website")}
                placeholder="e.g. https://example.com"
              />
            </div>

            <div className="field">
              <label htmlFor="f-email">Email</label>
              <input
                id="f-email"
                type="text"
                value={d.email}
                onChange={set("email")}
                placeholder="e.g. hello@example.com"
              />
            </div>

            <div className="field">
              <label htmlFor="f-facebook">Facebook</label>
              <input
                id="f-facebook"
                type="text"
                value={d.facebook}
                onChange={set("facebook")}
                placeholder="e.g. https://facebook.com/example"
              />
            </div>

            <div className="field">
              <label htmlFor="f-instagram">Instagram</label>
              <input
                id="f-instagram"
                type="text"
                value={d.instagram}
                onChange={set("instagram")}
                placeholder="e.g. https://instagram.com/example"
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
              {saving ? "Saving…" : isNew ? "Add vet" : "Save changes"}
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
function VetsAdminPage() {
  const vets = useQuery(api.vets.listAll) as VetRow[] | undefined;
  const addVet = useMutation(api.vets.add);
  const updateVet = useMutation(api.vets.update);
  const removeVet = useMutation(api.vets.remove);

  const [q, setQ] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [editing, setEditing] = useState<
    (FormState & { id?: Id<"vets"> }) | null
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
    if (!vets) return [];
    const ql = q.trim().toLowerCase();
    return vets.filter((v) => {
      if (ql && !v.name.toLowerCase().includes(ql)) return false;
      if (areaFilter !== "all" && v.area !== areaFilter) return false;
      return true;
    });
  }, [vets, q, areaFilter]);

  const handleAdd = () => {
    setEditing({ ...EMPTY_FORM });
  };

  const handleEdit = (vet: VetRow) => {
    setEditing({
      id: vet._id,
      name: vet.name,
      block: vet.block,
      street: vet.street,
      floor: vet.floor ?? "",
      unit: vet.unit ?? "",
      building: vet.building ?? "",
      postalCode: vet.postalCode,
      openingHours: vet.openingHours,
      phone: vet.phone,
      area: vet.area,
      emergency: vet.emergency,
      publicHolidays: vet.publicHolidays,
      website: vet.website ?? "",
      facebook: vet.facebook ?? "",
      instagram: vet.instagram ?? "",
      email: vet.email ?? "",
    });
  };

  const handleSave = async (form: FormState) => {
    if (!editing) return;

    const fields = {
      name: form.name,
      block: form.block,
      street: form.street,
      floor: form.floor || undefined,
      unit: form.unit || undefined,
      building: form.building || undefined,
      postalCode: form.postalCode,
      openingHours: form.openingHours,
      phone: form.phone,
      area: form.area,
      emergency: form.emergency,
      publicHolidays: form.publicHolidays,
      website: form.website || undefined,
      facebook: form.facebook || undefined,
      instagram: form.instagram || undefined,
      email: form.email || undefined,
    };

    if (!editing.id) {
      await addVet(fields);
      flash(`Added ${form.name}`);
    } else {
      await updateVet({ id: editing.id, ...fields });
      flash(`Updated ${form.name}`);
    }
    setEditing(null);
  };

  const handleDelete = (vet: VetRow) => {
    setConfirm({
      title: "Delete this vet?",
      body: (
        <>
          <b>{vet.name}</b> will be removed from the directory. This can&rsquo;t
          be undone.
        </>
      ),
      confirmLabel: "Delete",
      danger: true,
      onConfirm: async () => {
        await removeVet({ id: vet._id });
        flash(`Deleted ${vet.name}`);
        setConfirm(null);
      },
    });
  };

  if (vets === undefined) {
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
            Manage <em>vets.</em>
          </h1>
          <p>Create, edit, and remove veterinary clinics in the directory.</p>
        </div>
        <div className="actions-row">
          <button className="btn primary" onClick={handleAdd}>
            <Icon.Plus /> Add a vet
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
          {vets.length} total · {filtered.length} shown
        </span>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty">
            <h3>
              {vets.length === 0 ? "No vets in the directory" : "No matches"}
            </h3>
            <p>
              {vets.length === 0
                ? "Add your first vet to get started."
                : "Try a different search."}
            </p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Area</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Emergency</th>
                <th>PH</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((vet) => (
                <tr key={vet._id}>
                  <td>
                    <div className="row-name">{vet.name}</div>
                    {vet.openingHours && (
                      <div className="row-sub">{vet.openingHours}</div>
                    )}
                  </td>
                  <td>{vet.area}</td>
                  <td style={{ color: "var(--muted)" }}>
                    {vet.block} {vet.street}
                    {vet.floor && vet.unit && `, #${vet.floor}-${vet.unit}`}
                    {vet.building && `, ${vet.building}`}
                    {`, S${vet.postalCode}`}
                  </td>
                  <td style={{ color: "var(--muted)" }}>{vet.phone}</td>
                  <td>
                    {vet.emergency ? (
                      <span className="pill hdb-yes" title={vet.emergency}>
                        {vet.emergency}
                      </span>
                    ) : (
                      <span className="pill hdb-no">No</span>
                    )}
                  </td>
                  <td>
                    {vet.publicHolidays ? (
                      <span className="pill hdb-yes">Yes</span>
                    ) : (
                      <span className="pill hdb-no">No</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="icon-btn"
                        onClick={() => handleEdit(vet)}
                        aria-label={`Edit ${vet.name}`}
                        title="Edit"
                      >
                        <Icon.Edit />
                      </button>
                      <button
                        className="icon-btn danger"
                        onClick={() => handleDelete(vet)}
                        aria-label={`Delete ${vet.name}`}
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
        <VetForm
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
          <Icon.Check /> {toast}
        </div>
      )}
    </main>
  );
}
