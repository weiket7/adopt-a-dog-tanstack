import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("dogRuns").order("asc").collect();
  },
});

export const add = mutation({
  args: {
    sortOrder: v.number(),
    name: v.string(),
    area: v.string(),
    size: v.string(),
    address: v.string(),
    waterPoint: v.optional(v.boolean()),
    description: v.optional(v.string()),
    openingHours: v.optional(v.string()),
    image: v.optional(v.string()),
    map: v.optional(v.string()),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("dogRuns", { waterPoint: false, ...args });
  },
});

export const update = mutation({
  args: {
    id: v.id("dogRuns"),
    sortOrder: v.number(),
    name: v.string(),
    area: v.string(),
    size: v.string(),
    address: v.string(),
    waterPoint: v.boolean(),
    description: v.optional(v.string()),
    openingHours: v.optional(v.string()),
    image: v.optional(v.string()),
    map: v.optional(v.string()),
    website: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("dogRuns") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
