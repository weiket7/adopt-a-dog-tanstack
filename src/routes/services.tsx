import { createFileRoute } from "@tanstack/react-router";
import { CONTACT_EMAIL } from "~/constants/settings";
import { api } from "convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SERVICE_CATEGORIES } from "~/constants/serviceCategories";
import { SocialLink } from "~/components/SocialLink";
import { Icon } from "~/components/Icon";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(convexQuery(api.services.listAll, {}));
  },
});

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s7-7 7-13a7 7 0 1 0-14 0c0 6 7 13 7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function PawIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="6" cy="10" rx="2" ry="2.6" />
      <ellipse cx="10" cy="6.5" rx="2" ry="2.6" />
      <ellipse cx="14" cy="6.5" rx="2" ry="2.6" />
      <ellipse cx="18" cy="10" rx="2" ry="2.6" />
      <path d="M12 12c-3 0-5.5 2.4-5.5 5 0 1.8 1.3 3 3 3 1 0 1.7-.5 2.5-.5s1.5.5 2.5.5c1.7 0 3-1.2 3-3 0-2.6-2.5-5-5.5-5z" />
    </svg>
  );
}

function CloseIcon() {
  return (
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
}

/* ------------------------------------------------------------------ */
/* Photo gallery lightbox                                              */
/* ------------------------------------------------------------------ */

function PhotoGallery({
  title,
  subtitle,
  images,
  onClose,
}: {
  title: string;
  subtitle?: string;
  images: string[];
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const total = images.length;

  useEffect(() => {
    setIdx(0);
  }, [title]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") setIdx((i) => (i + 1) % total);
      else if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, total]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!images.length) return null;

  return (
    <div
      className="gallery-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photo gallery`}
    >
      <button
        className="gallery-close"
        onClick={onClose}
        aria-label="Close gallery"
      >
        <CloseIcon />
      </button>
      <div className="gallery-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="gallery-stage">
          {total > 1 && (
            <button
              className="gallery-nav prev"
              onClick={() => setIdx((i) => (i - 1 + total) % total)}
              aria-label="Previous photo"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          )}
          <img
            className="gallery-main"
            src={images[idx]}
            alt={`${title} — photo ${idx + 1} of ${total}`}
          />
          {total > 1 && (
            <button
              className="gallery-nav next"
              onClick={() => setIdx((i) => (i + 1) % total)}
              aria-label="Next photo"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 6 6 6-6 6" />
              </svg>
            </button>
          )}
        </div>
        <div className="gallery-foot">
          <div className="gallery-caption">
            <b>{title}</b>
            <span>
              {subtitle ? `${subtitle} · ` : ""}
              {idx + 1} / {total}
            </span>
          </div>
          {total > 1 && (
            <div className="gallery-thumbs" role="tablist">
              {images.map((src, i) => (
                <button
                  key={i}
                  className={`gallery-thumb${i === idx ? " is-active" : ""}`}
                  onClick={() => setIdx(i)}
                  role="tab"
                  aria-selected={i === idx}
                  aria-label={`Show photo ${i + 1}`}
                >
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Service card                                                        */
/* ------------------------------------------------------------------ */

function ServiceCard({
  service,
  onOpenGallery,
}: {
  service: any;
  onOpenGallery: (service: any) => void;
}) {
  const [imgOk, setImgOk] = useState(true);
  const featured = service.featured;

  return (
    <article className={"svc-card" + (featured ? " svc-card--featured" : "")}>
      {featured && (
        <span className="svc-featured-flag" aria-label="Featured listing">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l2.39 6.95H22l-5.94 4.32L18.45 22 12 17.77 5.55 22l2.39-8.73L2 8.95h7.61z" />
          </svg>
          Featured
        </span>
      )}
      {service.imageUrl && (
        <button
          type="button"
          className="svc-photo"
          onClick={() => onOpenGallery(service)}
          aria-label={`Open photo for ${service.name}`}
        >
          {imgOk ? (
            <img
              src={service.imageUrl}
              alt={service.name}
              loading="lazy"
              onError={() => setImgOk(false)}
            />
          ) : (
            <div className="svc-photo-placeholder">
              <PawIcon />
            </div>
          )}
          <span className="svc-photo-badge" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="14" height="14" rx="2" />
              <path d="M7 21h12a2 2 0 0 0 2-2V9" />
              <path d="m7 13 3-3 4 4" />
            </svg>
            <span>View</span>
          </span>
        </button>
      )}
      <div className="svc-head">
        <span
          className={
            "svc-cat svc-cat--" +
            service.category.toLowerCase().replace(/[^a-z]/g, "")
          }
        >
          {service.category}
        </span>
        {service.priceFrom && service.priceFrom !== "—" && (
          <span className="svc-price">from {service.priceFrom}</span>
        )}
      </div>
      <h3 className="svc-name">{service.name}</h3>
      <p className="svc-blurb">{service.blurb}</p>
      <div className="svc-meta">
        {service.address && (
          <span>
            <PinIcon /> {service.address}
          </span>
        )}
        {service.phone && (
          <span>
            <PhoneIcon /> {service.phone}
          </span>
        )}
      </div>
      {(service.website ||
        service.facebook ||
        service.instagram ||
        service.email ||
        service.phone) && (
        <div className="group-socials svc-socials">
          <SocialLink href={service.website} label="Website">
            {" "}
            <Icon.Globe />
          </SocialLink>
          <SocialLink href={service.facebook} label="Facebook">
            {" "}
            <Icon.FB />
          </SocialLink>
          <SocialLink href={service.instagram} label="Instagram">
            <Icon.IG />
          </SocialLink>
          {service.email && (
            <a
              className="group-social"
              href={`mailto:${service.email}`}
              aria-label="Email"
              title={service.email}
            >
              <Icon.Send />
            </a>
          )}
          {service.phone && (
            <a
              className="group-social"
              href={`tel:${service.phone.replace(/\s/g, "")}`}
              aria-label="Call"
              title={service.phone}
            >
              <Icon.Phone />
            </a>
          )}
        </div>
      )}
    </article>
  );
}

function ServicesPage() {
  const { data: allServices } = useSuspenseQuery(
    convexQuery(api.services.listAll, {}),
  );
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [galleryService, setGalleryService] = useState<any>(null);

  const list = allServices.filter((s) => {
    if (cat !== "all" && s.category !== cat) return false;
    if (q.trim()) {
      const qq = q.toLowerCase();
      if (
        !s.name.toLowerCase().includes(qq) &&
        !(s.blurb ?? "").toLowerCase().includes(qq) &&
        !(s.area ?? "").toLowerCase().includes(qq) &&
        !s.category.toLowerCase().includes(qq)
      )
        return false;
    }
    return true;
  });

  const sorted = list.slice().sort((a, b) => {
    const af = a.featured ? 0 : 1;
    const bf = b.featured ? 0 : 1;
    return af - bf;
  });

  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>
            Services <em>for the good life.</em>
          </h1>
          <p>
            A small, hand-picked directory of dog-friendly businesses our
            adopters and fosters quietly recommend — from fresh-meal kitchens to
            memorial potters. No paid listings.
          </p>
        </div>
        <div className="stat">
          <b>{allServices.length}</b>
          businesses across {SERVICE_CATEGORIES.length} categories
        </div>
      </header>

      <aside className="pitch" aria-labelledby="pitch-title">
        <div className="pitch-body">
          <span className="pitch-eyebrow">For small businesses</span>
          <h2 id="pitch-title">
            List your dog-loving business with <em>adoptadog.</em>
          </h2>
          <p>
            We&rsquo;re a volunteer-run directory of trusted, dog-friendly small
            businesses in Singapore. If you make beautiful things for dogs, care
            for them, feed them, photograph them, or send them off with dignity
            &mdash; we&rsquo;d love to share what you do with our adopters and
            fosters.
          </p>
          <ul className="pitch-list">
            <li>Free to list. No paid placements, ever.</li>
            <li>
              Independent Singapore businesses preferred &mdash; sole traders
              welcome.
            </li>
            <li>
              Listings stay so long as our community continues to recommend you.
            </li>
          </ul>
        </div>
        <div className="pitch-cta">
          <a
            className="pitch-button"
            href={`mailto:${CONTACT_EMAIL}?subject=Services - Application`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16v12H4z" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            Apply to be listed
          </a>
          <span className="pitch-note">
            Drop us a line at <b>{CONTACT_EMAIL}</b> with a short intro, your
            website, and where you&rsquo;re based.
          </span>
        </div>
      </aside>

      <div className="page-controls">
        <div className="search page-search" style={{ maxWidth: 320 }}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search services…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <span className="page-count">
          {list.length} {list.length === 1 ? "result" : "results"}
        </span>
      </div>

      <div className="svc-cats" role="tablist" aria-label="Service categories">
        <button
          role="tab"
          aria-selected={cat === "all"}
          className={"svc-cat-chip" + (cat === "all" ? " active" : "")}
          onClick={() => setCat("all")}
        >
          All
        </button>
        {SERVICE_CATEGORIES.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            className={"svc-cat-chip" + (cat === c ? " active" : "")}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="empty" style={{ padding: "48px 20px" }}>
          <h3
            style={{
              fontFamily: "var(--serif)",
              fontWeight: 500,
              fontSize: 22,
              margin: "0 0 6px",
            }}
          >
            Nothing yet
          </h3>
          <p>Try a different search or category.</p>
        </div>
      ) : (
        <section className="svc-grid">
          {sorted.map((s) => (
            <ServiceCard
              key={s._id}
              service={s}
              onOpenGallery={setGalleryService}
            />
          ))}
        </section>
      )}

      {galleryService && (
        <PhotoGallery
          title={galleryService.name}
          subtitle={`${galleryService.category}${galleryService.area ? ` · ${galleryService.area}` : ""}`}
          images={[galleryService.imageUrl]}
          onClose={() => setGalleryService(null)}
        />
      )}
    </main>
  );
}
