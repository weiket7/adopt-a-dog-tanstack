import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("events").collect();
  },
});

export const get = query({
  args: { id: v.id("events") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    image: v.optional(v.string()),
    dateTime: v.string(),
    link: v.optional(v.string()),
    kind: v.optional(v.string()),
    short: v.optional(v.string()),
    cta: v.optional(v.string()),
    tag: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("events"),
    name: v.string(),
    location: v.string(),
    image: v.optional(v.string()),
    dateTime: v.string(),
    link: v.optional(v.string()),
    kind: v.optional(v.string()),
    short: v.optional(v.string()),
    cta: v.optional(v.string()),
    tag: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
