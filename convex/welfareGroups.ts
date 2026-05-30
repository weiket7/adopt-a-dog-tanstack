import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx, args) => {
    return await ctx.db
      .query("welfareGroups")
      .filter((q) => q.eq(q.field("status"), "Active"))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("welfareGroups") },
  handler: async (ctx, args) => {
    const group = await ctx.db.get(args.id);
    return group;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("welfareGroups")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});
