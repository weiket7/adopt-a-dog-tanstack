import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  dogs: defineTable({
    name: v.string(),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    gender: v.union(v.literal("Male"), v.literal("Female")),
    hdbApproved: v.union(v.literal("Yes"), v.literal("No")),
    birthday: v.optional(v.string()),
    welfareGroupId: v.optional(v.id("welfareGroups")),
    description: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")), // The reference to the file
  }),
  welfareGroups: defineTable({
    name: v.string(),
    slug: v.string(),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    image: v.optional(v.string()),
    facebook: v.string(),
    website: v.optional(v.string()),
    email: v.optional(v.string()),
    volunteerUrl: v.optional(v.string()),
    instagram: v.optional(v.string()),
  }),
  //}).index("by_slug", ["slug"]),
});
