import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("vets").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    block: v.string(),
    street: v.string(),
    floor: v.optional(v.string()),
    unit: v.optional(v.string()),
    building: v.optional(v.string()),
    postalCode: v.string(),
    openingHours: v.string(),
    phone: v.string(),
    area: v.string(),
    emergency: v.boolean(),
    publicHolidays: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("vets", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("vets"),
    name: v.string(),
    block: v.string(),
    street: v.string(),
    floor: v.optional(v.string()),
    unit: v.optional(v.string()),
    building: v.optional(v.string()),
    postalCode: v.string(),
    openingHours: v.string(),
    phone: v.string(),
    area: v.string(),
    emergency: v.boolean(),
    publicHolidays: v.boolean(),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("vets") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
