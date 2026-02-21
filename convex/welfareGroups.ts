import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx, args) => {
    return await ctx.db.query("welfareGroups").collect();
  },
});
