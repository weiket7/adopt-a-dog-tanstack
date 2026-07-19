import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SocialLink } from "~/components/SocialLink";
import { Icon } from "~/components/Icon";

export const Route = createFileRoute("/welfare-groups/")({
  component: WelfareGroupsPage,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(convexQuery(api.welfareGroups.list, {}));
  },
  head: () => ({
    meta: [
      { title: "Welfare Groups — Adopt A Dog Singapore" },
      {
        name: "description",
        content:
          "Browse dog welfare groups and rescues in Singapore and the dogs they care for.",
      },
      { property: "og:title", content: "Welfare Groups — Adopt A Dog Singapore" },
      {
        property: "og:description",
        content:
          "Browse dog welfare groups and rescues in Singapore and the dogs they care for.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

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
              <Icon.Paw />
            </div>
          )}
        </div>
        <div className="group-id">
          <h3 className="group-name">{group.name}</h3>
          {group.blurb && <p className="group-blurb">{group.blurb}</p>}
          {group.dogsAvailable != null && (
            <Link
              to="/welfare-groups/$welfareSlug"
              params={{ welfareSlug: group.slug }}
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
          <Icon.Globe />
        </SocialLink>
        <SocialLink href={group.facebook} label="Facebook">
          {" "}
          <Icon.FB />
        </SocialLink>
        <SocialLink href={group.instagram} label="Instagram">
          <Icon.IG />
        </SocialLink>
        <SocialLink href={group.tiktok} label="TikTok">
          {" "}
          <Icon.TT />
        </SocialLink>
        <SocialLink href={group.youtube} label="YouTube">
          {" "}
          <Icon.YT />
        </SocialLink>
        <SocialLink
          href={group.email ? `mailto:${group.email}` : undefined}
          label="Email"
        >
          <Icon.Email />
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
      <header className="header">
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

      <div className="page-controls">
        <div className="search" style={{ maxWidth: 320 }}>
          <Icon.Search />
          <input
            type="text"
            placeholder="Search by name"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <span className="page-count">
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
