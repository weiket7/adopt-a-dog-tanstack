import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = action(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const listAll = query({
  handler: async (ctx) => {
    const services = await ctx.db.query("services").collect();
    return await Promise.all(
      services.map(async (service) => ({
        ...service,
        imageUrl: service.imageStorageId
          ? await ctx.storage.getUrl(service.imageStorageId)
          : null,
      })),
    );
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    blurb: v.optional(v.string()),
    area: v.optional(v.string()),
    address: v.optional(v.string()),
    website: v.optional(v.string()),
    instagram: v.optional(v.string()),
    facebook: v.optional(v.string()),
    tiktok: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("services", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("services"),
    name: v.string(),
    category: v.string(),
    blurb: v.optional(v.string()),
    area: v.optional(v.string()),
    address: v.optional(v.string()),
    website: v.optional(v.string()),
    instagram: v.optional(v.string()),
    facebook: v.optional(v.string()),
    tiktok: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, { id }) => {
    const service = await ctx.db.get(id);
    if (!service) return;
    if (service.imageStorageId) {
      await ctx.storage.delete(service.imageStorageId);
    }
    await ctx.db.delete(id);
  },
});
