import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const generateUploadUrl = action(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const all = query({
  handler: async (ctx, args) => {
    return await ctx.db.collect(); // Apply your filters here
  },
});

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    name: v.optional(v.string()),
    hdbApproved: v.optional(v.string()),
    gender: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("dogs");
    if (args.name) {
      q = q.filter((q) => q.eq(q.field("name"), args.name));
    }
    if (args.hdbApproved) {
      q = q.filter((q) => q.eq(q.field("hdbApproved"), args.hdbApproved));
    }
    if (args.gender) {
      q = q.filter((q) => q.eq(q.field("gender"), args.gender));
    }

    const results = await q.paginate(args.paginationOpts);

    const pageWithUrls = await Promise.all(
      results.page.map(async (dog) => ({
        ...dog,
        imageUrl: dog.imageStorageId 
          ? await ctx.storage.getUrl(dog.imageStorageId) 
          : "/img/products/product-grey-4.jpg",
      }))
    );

    return { ...results, page: pageWithUrls };
  },
});

export const get = query({
  args: { id: v.id("dogs") }, // Use v.id("dogs") for better typing
  handler: async (ctx, { id }) => {
    const dog = await ctx.db.get(id);
    if (!dog) return null;

    return {
      ...dog,
      imageUrl: dog.imageStorageId 
        ? await ctx.storage.getUrl(dog.imageStorageId) 
        : null,
    };
  },
});

export const add = mutation({
  args: { 
    name: v.string(), 
    gender: v.string(),
    hdbApproved: v.string(),
    birthday: v.string(),
    welfareGroupId: v.id("welfareGroups"),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("dogs", args);
  },
});

export const update = mutation({
  args: { 
    id: v.id("dogs"), 
    name: v.string(), 
    gender: v.string(),
    hdbApproved: v.string(),
    birthday: v.string(),
    welfareGroupId: v.id("welfareGroups"),
    imageStorageId: v.optional(v.id("_storage")), 
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data); 
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("dogs") },
  handler: async (ctx, args) => {
    const dog = await ctx.db.get(args.id);
    if (!dog) return;

    if (dog.imageStorageId) {
      // NOT await ctx.storage.delete({ storageId: dog.imageStorageId });
      await ctx.storage.delete(dog.imageStorageId);
    }

    await ctx.db.delete(args.id);
  },
});