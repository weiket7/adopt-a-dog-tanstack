import { v } from "convex/values";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { createAccount } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const createUser = action({
  args: {
    email: v.string(),
    password: v.string(),
    welfareGroupId: v.optional(v.id("welfareGroups")),
  },
  handler: async (ctx, { email, password, welfareGroupId }) => {
    await createAccount(ctx, {
      provider: "password",
      account: { id: email, secret: password },
      profile: { email },
    });
    if (welfareGroupId) {
      await ctx.runMutation(internal.users.patchWelfareGroupByEmail, {
        email,
        welfareGroupId,
      });
    }
  },
});

export const patchWelfareGroupByEmail = internalMutation({
  args: {
    email: v.string(),
    welfareGroupId: v.id("welfareGroups"),
  },
  handler: async (ctx, { email, welfareGroupId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .unique();
    if (user) {
      await ctx.db.patch(user._id, { welfareGroupId });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
