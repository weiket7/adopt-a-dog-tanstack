import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

export const all = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const user = await ctx.db.get(userId);
    if (!user) return [];

    let dogsQuery = ctx.db.query("dogs");

    if (user.role !== "Admin") {
      if (!user.welfareGroupId) return [];
      dogsQuery = dogsQuery.filter((q) =>
        q.eq(q.field("welfareGroupId"), user.welfareGroupId),
      ) as typeof dogsQuery;
    }

    const dogs = await dogsQuery.collect();
    return dogs.map((dog) => ({ ...dog, imageUrl: dog.image ?? null }));
  },
});

export const listAll = query({
  handler: async (ctx) => {
    const dogs = await ctx.db
      .query("dogs")
      .filter((q) => q.eq(q.field("status"), "Active"))
      .collect();
    return dogs.map((dog) => ({ ...dog, imageUrl: dog.image ?? null }));
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
    let q = ctx.db
      .query("dogs")
      .filter((q) => q.neq(q.field("status"), "Inactive"));
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

    const pageWithUrls = results.page.map((dog) => ({
      ...dog,
      imageUrl: dog.image ?? "/img/products/product-grey-4.jpg",
    }));

    return { ...results, page: pageWithUrls };
  },
});

export const listByWelfareGroup = query({
  args: { welfareGroupId: v.id("welfareGroups") },
  handler: async (ctx, { welfareGroupId }) => {
    const dogs = await ctx.db
      .query("dogs")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "Active"),
          q.eq(q.field("welfareGroupId"), welfareGroupId),
        ),
      )
      .collect();
    return dogs.map((dog) => ({ ...dog, imageUrl: dog.image ?? null }));
  },
});

export const get = query({
  args: { id: v.id("dogs") }, // Use v.id("dogs") for better typing
  handler: async (ctx, { id }) => {
    const dog = await ctx.db.get(id);
    if (!dog) return null;

    return { ...dog, imageUrl: dog.image ?? null };
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    gender: v.union(v.literal("Male"), v.literal("Female")),
    hdbApproved: v.union(v.literal("Yes"), v.literal("No")),
    birthday: v.optional(v.string()),
    description: v.optional(v.string()),
    welfareGroupId: v.optional(v.id("welfareGroups")),
    image: v.optional(v.string()),
    status: v.optional(v.union(v.literal("Active"), v.literal("Inactive"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const user = userId ? await ctx.db.get(userId) : null;
    const welfareGroupId =
      user?.role !== "Admin"
        ? (user?.welfareGroupId ?? args.welfareGroupId)
        : args.welfareGroupId;
    return await ctx.db.insert("dogs", {
      ...args,
      welfareGroupId,
      status: args.status ?? "Active",
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("dogs"),
    name: v.string(),
    gender: v.union(v.literal("Male"), v.literal("Female")),
    hdbApproved: v.union(v.literal("Yes"), v.literal("No")),
    birthday: v.optional(v.string()),
    description: v.optional(v.string()),
    welfareGroupId: v.optional(v.id("welfareGroups")),
    image: v.optional(v.string()),
    status: v.union(v.literal("Active"), v.literal("Inactive")),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;

    const userId = await getAuthUserId(ctx);
    const user = userId ? await ctx.db.get(userId) : null;
    if (user?.role !== "Admin" && user?.welfareGroupId) {
      data.welfareGroupId = user.welfareGroupId;
    }

    const oldDog = await ctx.db.get(id);
    await ctx.db.patch(id, data);

    const groupsToUpdate = new Set<Id<"welfareGroups">>();
    if (oldDog?.welfareGroupId) groupsToUpdate.add(oldDog.welfareGroupId);
    if (data.welfareGroupId) groupsToUpdate.add(data.welfareGroupId);

    for (const groupId of groupsToUpdate) {
      const activeDogs = await ctx.db
        .query("dogs")
        .filter((q) =>
          q.and(
            q.eq(q.field("welfareGroupId"), groupId),
            q.eq(q.field("status"), "Active"),
          ),
        )
        .collect();
      await ctx.db.patch(groupId, { dogsAvailable: activeDogs.length });
    }

    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("dogs") },
  handler: async (ctx, args) => {
    const dog = await ctx.db.get(args.id);
    if (!dog) return;

    await ctx.db.delete(args.id);

    if (dog.welfareGroupId) {
      const activeDogs = await ctx.db
        .query("dogs")
        .filter((q) =>
          q.and(
            q.eq(q.field("welfareGroupId"), dog.welfareGroupId),
            q.eq(q.field("status"), "Active"),
          ),
        )
        .collect();
      await ctx.db.patch(dog.welfareGroupId, {
        dogsAvailable: activeDogs.length,
      });
    }
  },
});
