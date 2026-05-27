import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

export const Route = createFileRoute("/welfare-groups/")({
  component: WelfareGroupsPage,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(convexQuery(api.welfareGroups.list, {}));
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
function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}
function FBIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H8v-3h2.4V9.4c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12h2.6l-.4 3h-2.2v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}
function IGIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
function TTIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.4 6.5a5.2 5.2 0 0 1-3.4-2A5.2 5.2 0 0 1 14.7 2H11v13.4a2.5 2.5 0 1 1-2.5-2.5c.3 0 .5 0 .8.1V9.3a6.4 6.4 0 1 0 5.4 6.3V8.7a8.8 8.8 0 0 0 4.7 1.3V6.5z" />
    </svg>
  );
}
function YTIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 12s0-3.6-.5-5.3a2.8 2.8 0 0 0-2-2C18.8 4.3 12 4.3 12 4.3s-6.8 0-8.5.4a2.8 2.8 0 0 0-2 2C1 8.4 1 12 1 12s0 3.6.5 5.3a2.8 2.8 0 0 0 2 2c1.7.4 8.5.4 8.5.4s6.8 0 8.5-.4a2.8 2.8 0 0 0 2-2C23 15.6 23 12 23 12zM10 15.3V8.7l5.7 3.3-5.7 3.3z" />
    </svg>
  );
}
function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </svg>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: React.ReactNode;
}) {
  if (!href) return null;
  return (
    <a
      className="group-social"
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      title={label}
    >
      {children}
    </a>
  );
}

function GroupCard({ group }: { group: any }) {
  const [imgSrc, setImgSrc] = useState(
    group.slug ? `/welfare-groups/${group.slug}.jpg` : null,
  );
  return (
    <article className="group-card">
      <div className="group-top">
        <div className="group-logo">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={group.name}
              loading="lazy"
              onError={() =>
                imgSrc.endsWith(".jpg")
                  ? setImgSrc(`/welfare-groups/${group.slug}.png`)
                  : setImgSrc(null)
              }
            />
          ) : (
            <div className="group-logo-fallback">
              <PawIcon />
            </div>
          )}
        </div>
        <div className="group-id">
          <h3 className="group-name">{group.name}</h3>
          {group.blurb && <p className="group-blurb">{group.blurb}</p>}
          {group.dogsAvailable != null && (
            <Link
              to="/welfare-groups/$welfareGroupId"
              params={{ welfareGroupId: group._id }}
              className="group-count"
            >
              View
              <b>{group.dogsAvailable}</b>
              <span>dogs for adoption</span>
            </Link>
          )}
        </div>
      </div>

      <div className="group-socials">
        <SocialLink href={group.website} label="Website">
          {" "}
          <GlobeIcon />
        </SocialLink>
        <SocialLink href={group.facebook} label="Facebook">
          {" "}
          <FBIcon />
        </SocialLink>
        <SocialLink href={group.instagram} label="Instagram">
          <IGIcon />
        </SocialLink>
        <SocialLink href={group.tiktok} label="TikTok">
          {" "}
          <TTIcon />
        </SocialLink>
        <SocialLink href={group.youtube} label="YouTube">
          {" "}
          <YTIcon />
        </SocialLink>
        <SocialLink
          href={group.email ? `mailto:${group.email}` : undefined}
          label="Email"
        >
          <EmailIcon />
        </SocialLink>
      </div>
    </article>
  );
}

function WelfareGroupsPage() {
  const { data: groups } = useSuspenseQuery(
    convexQuery(api.welfareGroups.list, {}),
  );
  const [q, setQ] = useState("");

  const totalDogs = groups.reduce(
    (n: number, g: any) => n + (g.dogsAvailable ?? 0),
    0,
  );
  const list = groups.filter(
    (g: any) => !q.trim() || g.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>
            Welfare groups <em>doing the work.</em>
          </h1>
          <p>
            The non-profits, shelters and small collectives rehoming
            Singapore&rsquo;s street and surrendered dogs. Follow them, foster
            with them, or just send a few dollars their way.
          </p>
        </div>
        <div className="stat">
          <b>{totalDogs}</b>
          dogs across {groups.length} groups
        </div>
      </header>

      <div className="runs-toolbar">
        <div className="search" style={{ maxWidth: 320 }}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search welfare groups…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <span className="runs-count">
          {list.length} {list.length === 1 ? "group" : "groups"}
        </span>
      </div>

      <section className="groups-grid">
        {list.map((g: any) => (
          <GroupCard key={g._id} group={g} />
        ))}
      </section>
    </main>
  );
}
