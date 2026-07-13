import type { Doc } from "convex/_generated/dataModel";

export type BlogPost = Doc<"blogPosts"> & { slug: string; body: string };

function parseFrontmatter(raw: string): {
  data: Record<string, string>;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const [, frontmatter, content] = match;
  const data: Record<string, string> = {};
  for (const line of frontmatter.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    data[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { data, content };
}

export function markdownPost(raw: string, id: string): BlogPost {
  const { data, content } = parseFrontmatter(raw);
  return {
    _id: id,
    _creationTime: 0,
    ...data,
    body: content.replace(/\{\{URL::to\('\/'\)\}\}/g, "").trim(),
  } as unknown as BlogPost;
}
