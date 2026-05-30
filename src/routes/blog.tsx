import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { Doc } from "convex/_generated/dataModel";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(convexQuery(api.blogPosts.listAll, {}));
  },
});


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

function ArrowLeftIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5M11 5l-7 7 7 7" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

type Post = Doc<"blogPosts">;

function BlogCard({
  post,
  featured,
  onOpen,
}: {
  post: Post;
  featured: boolean;
  onOpen?: (post: Post) => void;
}) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <article
      className={"post-card" + (featured ? " featured" : "")}
      onClick={() => onOpen?.(post)}
      style={onOpen ? { cursor: "pointer" } : undefined}
    >
      <div className="post-cover">
        {imgOk ? (
          <img
            src={post.cover}
            alt={post.title}
            loading="lazy"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="post-placeholder">
            <PawIcon />
          </div>
        )}
        <span className="post-category">{post.category}</span>
      </div>
      <div className="post-body">
        <div className="post-meta">
          <span>{post.date}</span>
          <span className="dot" aria-hidden="true">
            ·
          </span>
          <span>{post.readTime}</span>
        </div>
        <h3 className="post-title">{post.title}</h3>
        <p className="post-excerpt">{post.excerpt}</p>
        <div className="post-foot">
          <span className="post-author">by {post.author}</span>
          <button className="post-cta" onClick={(e) => { e.stopPropagation(); onOpen?.(post); }}>
            Read more <ArrowRightIcon />
          </button>
        </div>
      </div>
    </article>
  );
}

function BlogPost({
  post,
  allPosts,
  onBack,
}: {
  post: Post;
  allPosts: Post[];
  onBack: (p?: Post) => void;
}) {
  const [imgOk, setImgOk] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onBack(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [post, onBack]);

  const related = allPosts
    .filter((p) => p._id !== post._id && p.category === post.category)
    .slice(0, 3);

  return (
    <main className="page article-page">
      <button className="article-back" onClick={() => onBack()}>
        <ArrowLeftIcon /> All posts
      </button>

      <article className="article">
        <header className="article-head">
          <span className="article-category">{post.category}</span>
          <h1 className="article-title">{post.title}</h1>
          <div className="article-meta">
            <span className="article-author">{post.author}</span>
            <span className="dot" aria-hidden="true">·</span>
            <span>{post.date}</span>
            <span className="dot" aria-hidden="true">·</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <div className="article-cover">
          {imgOk && post.cover ? (
            <img src={post.cover} alt={post.title} onError={() => setImgOk(false)} />
          ) : (
            <div className="post-placeholder"><PawIcon /></div>
          )}
        </div>

        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.body ?? `<p>${post.excerpt}</p>` }}
        />

        <footer className="article-foot">
          <button className="article-back" onClick={() => onBack()}>
            <ArrowLeftIcon /> Back to all posts
          </button>
        </footer>
      </article>

      {related.length > 0 && (
        <section className="article-related">
          <h2 className="article-related-title">More in {post.category}</h2>
          <div className="article-related-grid">
            {related.map((p) => (
              <BlogCard key={p._id} post={p} featured={false} onOpen={onBack} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function BlogPage() {
  const { data: allPosts } = useSuspenseQuery(convexQuery(api.blogPosts.listAll, {}));
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Post | null>(null);
  const cats = ["all", ...Array.from(new Set(allPosts.map((p) => p.category)))];
  const filtered =
    filter === "all" ? allPosts : allPosts.filter((p) => p.category === filter);

  if (selected) {
    return (
      <BlogPost
        post={selected}
        allPosts={allPosts}
        onBack={(p) => setSelected(p ?? null)}
      />
    );
  }

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
          <b>{allPosts.length}</b>
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
            key={p._id}
            post={p}
            featured={filter === "all" && i === 0}
            onOpen={setSelected}
          />
        ))}
      </section>
    </main>
  );
}
