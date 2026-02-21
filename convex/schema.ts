import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  dogs: defineTable({
    name: v.string(),
    gender: v.union(v.literal("Male"), v.literal("Female")),
    hdbApproved: v.union(v.literal("Yes"), v.literal("No")),
    birthday: v.optional(v.string()),
    welfareGroupId: v.optional(v.id("welfareGroups")),
    // For Image Handling
    imageStorageId: v.optional(v.id("_storage")), // The reference to the file
  }),
  welfareGroups: defineTable({
    name: v.string(),
    slug: v.string(),
    image: v.string(),
    facebook: v.string(),
    website: v.optional(v.string()),
    email: v.optional(v.string()),
    volunteerUrl: v.optional(v.string()),
  }),
  //}).index("by_slug", ["slug"]),
});
