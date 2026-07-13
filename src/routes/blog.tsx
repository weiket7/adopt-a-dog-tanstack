import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ALL_BLOG_POSTS } from "~/utils/blogPosts";
import { BlogCard } from "~/components/blog-ui";

const POSTS = ALL_BLOG_POSTS;

export const Route = createFileRoute("/blog")({
  component: BlogPage,
});

function BlogPage() {
  const [filter, setFilter] = useState("all");
  const cats = ["all", ...Array.from(new Set(POSTS.map((p) => p.category)))];
  const filtered =
    filter === "all" ? POSTS : POSTS.filter((p) => p.category === filter);

  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>
            From the <em>shelter.</em>
          </h1>
          <p>
            Adoption stories, guidance for new adopters, and the things we wish
            someone had told us before we brought our first dog home.
          </p>
        </div>
        <div className="stat">
          <b>{POSTS.length}</b>
          posts &amp; counting
        </div>
      </header>

      <div className="page-controls">
        <div className="blog-tabs" role="tablist">
          {cats.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={filter === c}
              className={filter === c ? "on" : ""}
              onClick={() => setFilter(c)}
            >
              {c === "all" ? "All posts" : c}
            </button>
          ))}
        </div>
        <span className="page-count">
          {filtered.length} {filtered.length === 1 ? "post" : "posts"}
        </span>
      </div>

      <section className="blog-grid">
        {filtered.map((p, i) => (
          <BlogCard
            key={p.slug}
            post={p}
            featured={filter === "all" && i === 0}
          />
        ))}
      </section>
    </main>
  );
}
