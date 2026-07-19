import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { BlogPost } from "~/utils/markdownPost";
import { Markdown } from "~/components/Markdown";

export type Post = BlogPost;

export function PawIcon() {
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

export function ArrowLeftIcon() {
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

export function ArrowRightIcon() {
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

export function BlogCard({
  post,
  featured,
}: {
  post: Post;
  featured: boolean;
}) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <Link
      to="/blog/$postSlug"
      params={{ postSlug: post.slug }}
      className={"post-card" + (featured ? " featured" : "")}
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
          {post.author && <span className="post-author">by {post.author}</span>}
          <span className="post-cta">
            Read more <ArrowRightIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function BlogArticle({
  post,
  allPosts,
}: {
  post: Post;
  allPosts: Post[];
}) {
  const [imgOk, setImgOk] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [post]);

  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return (
    <main className="page article-page">
      {/* <Link to="/blog" className="article-back">
        <ArrowLeftIcon /> All posts
      </Link> */}

      <article className="article">
        <header className="article-head">
          <span className="article-category">{post.category}</span>
          <h1 className="article-title">{post.title}</h1>
          <div className="article-meta">
            {post.author && (
              <>
                <span className="article-author">{post.author}</span>
                <span className="dot" aria-hidden="true">
                  ·
                </span>
              </>
            )}
            <span>{post.date}</span>
            <span className="dot" aria-hidden="true">
              ·
            </span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <div className="article-cover">
          {imgOk && post.cover ? (
            <img
              src={post.cover}
              alt={post.title}
              onError={() => setImgOk(false)}
            />
          ) : (
            <div className="post-placeholder">
              <PawIcon />
            </div>
          )}
        </div>

        <Markdown className="article-body" content={post.body ?? ""} />

        <footer className="article-foot">
          <Link to="/blog" className="article-back">
            <ArrowLeftIcon /> Back to all posts
          </Link>
        </footer>
      </article>

      {related.length > 0 && (
        <section className="article-related">
          <h2 className="article-related-title">More in {post.category}</h2>
          <div className="article-related-grid">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} featured={false} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
