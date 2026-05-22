import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
});

const posts = [
  {
    id: 1,
    category: "Adoption Story",
    title: "Mochi finds a quiet flat in Tiong Bahru",
    date: "12 May 2026",
    author: "Aishah, foster carer",
    cover: "https://placedog.net/800/500?id=401",
    excerpt: "After three months in foster, our shy little Shih Tzu mix finally has a corner of her own. We visited her new family last weekend — and yes, she still squeaks when you scratch her chin.",
    readTime: "4 min read",
  },
  {
    id: 2,
    category: "Guidelines",
    title: "What HDB approval actually means for your dog",
    date: "06 May 2026",
    author: "Homeward Team",
    cover: "https://placedog.net/800/500?id=402",
    excerpt: "A plain-English guide to Project ADORE, the Mixed Breed Scheme, and the height and weight rules that decide which dogs can call an HDB flat home. With examples and what to do if you're unsure.",
    readTime: "7 min read",
  },
  {
    id: 3,
    category: "Adoption Story",
    title: "Biscuit's first year on a sofa",
    date: "28 Apr 2026",
    author: "Marcus, adopter",
    cover: "https://placedog.net/800/500?id=403",
    excerpt: "A Singapore Special who spent four years in a back lane is now hogging the air-con and judging the neighbours. We catch up with Biscuit and his adopter, twelve months on.",
    readTime: "6 min read",
  },
  {
    id: 4,
    category: "Guidelines",
    title: "Your first 30 days with a rescue dog",
    date: "19 Apr 2026",
    author: "Dr. Lim, partner vet",
    cover: "https://placedog.net/800/500?id=404",
    excerpt: "The 3-3-3 rule, decompression, the vet visit timeline, and what to actually do (and not do) in the first month. Required reading for new adopters.",
    readTime: "9 min read",
  },
  {
    id: 5,
    category: "Tips",
    title: "Walking your dog in Singapore's heat",
    date: "11 Apr 2026",
    author: "Homeward Team",
    cover: "https://placedog.net/800/500?id=405",
    excerpt: "Pavement temperature, hydration, the seven-second tarmac test, and the best times to go out without melting your dog. A short, hot-weather field guide.",
    readTime: "5 min read",
  },
  {
    id: 6,
    category: "Adoption Story",
    title: "Pepper, the senior schnauzer, picks her person",
    date: "02 Apr 2026",
    author: "Aishah, foster carer",
    cover: "https://placedog.net/800/500?id=406",
    excerpt: "Some dogs choose their family. Pepper walked past six prospective adopters at our open day and sat on the seventh's foot. The rest, as they say, is history.",
    readTime: "5 min read",
  },
  {
    id: 7,
    category: "Guidelines",
    title: "Fostering 101: what we're actually asking",
    date: "24 Mar 2026",
    author: "Homeward Team",
    cover: "https://placedog.net/800/500?id=407",
    excerpt: "Fostering isn't permanent adoption — but it's also not babysitting. A clear breakdown of the time, money and emotional commitment of being a foster carer, and why we need more of them.",
    readTime: "8 min read",
  },
  {
    id: 8,
    category: "Tips",
    title: "Introducing your rescue to a resident pet",
    date: "15 Mar 2026",
    author: "Dr. Lim, partner vet",
    cover: "https://placedog.net/800/500?id=408",
    excerpt: "Slow, neutral, no eye contact. A step-by-step plan for the first week of dog-to-dog and dog-to-cat introductions, with the warning signs to watch for.",
    readTime: "6 min read",
  },
];

function PawIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="6"  cy="10" rx="2"  ry="2.6"/>
      <ellipse cx="10" cy="6.5" rx="2" ry="2.6"/>
      <ellipse cx="14" cy="6.5" rx="2" ry="2.6"/>
      <ellipse cx="18" cy="10" rx="2"  ry="2.6"/>
      <path d="M12 12c-3 0-5.5 2.4-5.5 5 0 1.8 1.3 3 3 3 1 0 1.7-.5 2.5-.5s1.5.5 2.5.5c1.7 0 3-1.2 3-3 0-2.6-2.5-5-5.5-5z"/>
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7"/>
    </svg>
  );
}

type Post = typeof posts[number];

function BlogCard({ post, featured }: { post: Post; featured: boolean }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <article className={"post-card" + (featured ? " featured" : "")}>
      <div className="post-cover">
        {imgOk ? (
          <img src={post.cover} alt={post.title} loading="lazy" onError={() => setImgOk(false)} />
        ) : (
          <div className="post-placeholder"><PawIcon /></div>
        )}
        <span className="post-category">{post.category}</span>
      </div>
      <div className="post-body">
        <div className="post-meta">
          <span>{post.date}</span>
          <span className="dot" aria-hidden="true">·</span>
          <span>{post.readTime}</span>
        </div>
        <h3 className="post-title">{post.title}</h3>
        <p className="post-excerpt">{post.excerpt}</p>
        <div className="post-foot">
          <span className="post-author">by {post.author}</span>
          <button className="post-cta">Read more <ArrowRightIcon /></button>
        </div>
      </div>
    </article>
  );
}

function BlogPage() {
  const [filter, setFilter] = useState("all");
  const cats = ["all", ...Array.from(new Set(posts.map((p) => p.category)))];
  const filtered = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>From the <em>shelter.</em></h1>
          <p>
            Adoption stories, guidance for new adopters, and the things we wish
            someone had told us before we brought our first dog home.
          </p>
        </div>
        <div className="stat">
          <b>{posts.length}</b>
          posts &amp; counting
        </div>
      </header>

      <div className="runs-toolbar">
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
        <span className="runs-count">
          {filtered.length} {filtered.length === 1 ? "post" : "posts"}
        </span>
      </div>

      <section className="blog-grid">
        {filtered.map((p, i) => (
          <BlogCard key={p.id} post={p} featured={filter === "all" && i === 0} />
        ))}
      </section>
    </main>
  );
}
