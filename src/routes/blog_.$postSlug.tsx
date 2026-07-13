import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlogArticle } from "~/components/blog-ui";
import { ALL_BLOG_POSTS } from "~/utils/blogPosts";

export const Route = createFileRoute("/blog_/$postSlug")({
  component: BlogPostPage,
  loader: ({ params }) => {
    const post = ALL_BLOG_POSTS.find((p) => p.slug === params.postSlug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return {};
    return {
      meta: [
        { title: `${post.title} — Adoptadog` },
        { name: "description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        ...(post.cover
          ? [{ property: "og:image", content: post.cover }]
          : []),
      ],
    };
  },
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  return <BlogArticle post={post} allPosts={ALL_BLOG_POSTS} />;
}
