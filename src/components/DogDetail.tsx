import { useEffect, useRef, useState } from "react";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { toAge } from "~/utils/extensions";
import { emailWelfareGroup } from "~/server/email";
import { Icon } from "~/components/Icon";
import { SocialLink } from "~/components/SocialLink";

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="11"
    height="11"
  >
    <polyline points="4 12 10 18 20 6" />
  </svg>
);
const MarsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="10" cy="14" r="5" />
    <path d="m14.5 9.5 5-5" />
    <path d="M15 4h5v5" />
  </svg>
);
const VenusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="9" r="5" />
    <path d="M12 14v8" />
    <path d="M9 19h6" />
  </svg>
);
const CloseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
const SendIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4z" />
  </svg>
);

export function DogDetail({ dog, onClose }: { dog: any; onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  const sheetRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (sheetRef.current) sheetRef.current.scrollTop = 0;
    setImgOk(true);
  }, [dog?._id]);

  const { data: group } = useQuery({
    ...convexQuery(api.welfareGroups.getById, { id: dog.welfareGroupId }),
    enabled: !!dog.welfareGroupId,
  });

  if (!dog) return null;

  const update =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSending(true);
    await emailWelfareGroup({
      data: {
        dogId: dog._id,
        name: form.name,
        email: form.email,
        mobile: form.phone,
        message: form.message,
      },
    });
    setSending(false);
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-sheet"
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${dog.name}'s profile`}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        <div className="modal-body">
          <div>
            <div className="detail-head">
              <div className="detail-eyebrow">Available for adoption</div>
              <h2 className="detail-name">
                Meet <em>{dog.name}</em>
              </h2>
              {dog.breed && <div className="detail-tag">{dog.breed}</div>}
            </div>

            <div className="modal-portrait">
              {dog.imageUrl && imgOk ? (
                <img
                  src={dog.imageUrl}
                  alt={dog.name}
                  onError={() => setImgOk(false)}
                />
              ) : (
                <div className="placeholder">{dog.name[0]}</div>
              )}
            </div>

            <div className="detail-grid">
              <div className="detail-cell">
                <div className="k">Gender</div>
                <div className="v">
                  {dog.gender === "Male" ? <MarsIcon /> : <VenusIcon />}
                  {dog.gender}
                </div>
              </div>
              <div className="detail-cell">
                <div className="k">Age</div>
                <div className="v">
                  {dog.birthday ? toAge(dog.birthday) : "—"}
                </div>
              </div>
              <div className="detail-cell">
                <div className="k">HDB approved</div>
                <div className="v">
                  {dog.hdbApproved === "Yes" ? "Yes" : "Landed only"}
                </div>
              </div>
            </div>

            {dog.description && (
              <>
                <div className="detail-about-label">About {dog.name}</div>
                <p className="detail-about">{dog.description}</p>
              </>
            )}
          </div>

          <aside>
            <div className="adopt-panel">
              {group && (
                <div className="adopt-group">
                  <div className="adopt-group-eyebrow">Cared for by</div>
                  <div className="adopt-group-name">{group.name}</div>
                  {group.blurb && (
                    <p
                      className="adopt-group-blurb"
                      dangerouslySetInnerHTML={{ __html: group.blurb }}
                    />
                  )}
                  <div className="group-socials adopt-group-socials">
                    <SocialLink href={group.website} label="Website">
                      <Icon.Globe />
                    </SocialLink>
                    <SocialLink href={group.facebook} label="Facebook">
                      <Icon.FB />
                    </SocialLink>
                    <SocialLink href={group.instagram} label="Instagram">
                      <Icon.IG />
                    </SocialLink>
                  </div>
                </div>
              )}

              <div className="adopt-form">
                {submitted ? (
                  <div className="form-success">
                    <span className="check-ring">
                      <CheckIcon />
                    </span>
                    <h4>Thanks, {form.name.split(" ")[0] || "friend"}.</h4>
                    <p>
                      We&rsquo;ve received your interest in {dog.name}. Our
                      adoption team will be in touch within 2 working days.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3>Interested in {dog.name}?</h3>
                    <p className="form-sub">
                      Your note goes straight to <b>{group?.name}</b>, the group
                      caring for {dog.name}. They'll arrange a meet.
                    </p>
                    <form onSubmit={submit}>
                      <div className="form-field">
                        <label htmlFor="adopter-name">Your name</label>
                        <input
                          id="adopter-name"
                          type="text"
                          placeholder="Full name"
                          value={form.name}
                          onChange={update("name")}
                          required
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-field">
                          <label htmlFor="adopter-email">Email</label>
                          <input
                            id="adopter-email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={update("email")}
                            required
                          />
                        </div>
                        <div className="form-field">
                          <label htmlFor="adopter-phone">Phone</label>
                          <input
                            id="adopter-phone"
                            type="tel"
                            placeholder="+65 9123 4567"
                            value={form.phone}
                            onChange={update("phone")}
                          />
                        </div>
                      </div>
                      <div className="form-field">
                        <label htmlFor="adopter-message">
                          Tell us about your home
                        </label>
                        <textarea
                          id="adopter-message"
                          placeholder={`Where do you live, who else is at home, and what made ${dog.name} catch your eye?`}
                          value={form.message}
                          onChange={update("message")}
                        />
                      </div>
                      <button
                        type="submit"
                        className="form-submit"
                        disabled={sending}
                      >
                        <SendIcon />{" "}
                        {sending ? "Sending…" : `Email ${group?.name}`}
                      </button>
                      <div className="form-disclaimer">
                        Adoption is subject to home visit &amp; suitability
                        check.
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
