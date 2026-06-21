import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.union(v.literal("Admin"), v.literal("Member"))),
    welfareGroupId: v.optional(v.id("welfareGroups")),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),
  dogs: defineTable({
    name: v.string(),
    status: v.optional(v.union(v.literal("Active"), v.literal("Inactive"))),
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
    status: v.optional(v.union(v.literal("Active"), v.literal("Inactive"))),
    blurb: v.optional(v.string()),
    dogsAvailable: v.optional(v.number()),
    facebook: v.optional(v.string()),
    website: v.optional(v.string()),
    email: v.optional(v.string()),
    volunteerUrl: v.optional(v.string()),
    instagram: v.optional(v.string()),
    tiktok: v.optional(v.string()),
    youtube: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  events: defineTable({
    name: v.string(),
    location: v.string(),
    image: v.optional(v.string()),
    dateTime: v.string(),
    link: v.optional(v.string()),
    kind: v.optional(v.string()),
    short: v.optional(v.string()),
    cta: v.optional(v.string()),
    tag: v.optional(v.string()),
  }),

  services: defineTable({
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
  }),

  vets: defineTable({
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
  }),

  dogRuns: defineTable({
    sortOrder: v.number(),
    name: v.string(),
    area: v.string(),
    size: v.string(),
    description: v.optional(v.string()),
    address: v.string(),
    openingHours: v.optional(v.string()),
    image: v.optional(v.string()),
    map: v.optional(v.string()),
    website: v.optional(v.string()),
    waterPoint: v.optional(v.boolean()),
  }),

  blogPosts: defineTable({
    category: v.string(),
    title: v.string(),
    date: v.string(),
    author: v.string(),
    cover: v.optional(v.string()),
    excerpt: v.string(),
    readTime: v.string(),
    body: v.optional(v.string()),
  }),
});
