import { markdownPost, type BlogPost } from "./markdownPost";

const modules = import.meta.glob("../routes/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const ALL_BLOG_POSTS: BlogPost[] = Object.entries(modules)
  .map(([path, raw]) => {
    const id = path.split("/").pop()!.replace(/\.md$/, "");
    return markdownPost(raw, id);
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
