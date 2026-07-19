import { query, mutation, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";

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
    website: v.optional(v.string()),
    facebook: v.optional(v.string()),
    instagram: v.optional(v.string()),
    email: v.optional(v.string()),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
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
    website: v.optional(v.string()),
    facebook: v.optional(v.string()),
    instagram: v.optional(v.string()),
    email: v.optional(v.string()),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
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

export const listMissingCoordinates = internalQuery({
  handler: async (ctx): Promise<Doc<"vets">[]> => {
    const vets = await ctx.db.query("vets").collect();
    return vets.filter((v) => v.lat == null || v.lng == null);
  },
});

export const setCoordinates = internalMutation({
  args: { id: v.id("vets"), lat: v.number(), lng: v.number() },
  handler: async (ctx, { id, lat, lng }): Promise<void> => {
    await ctx.db.patch(id, { lat, lng });
  },
});
