import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  sections: defineTable({
    name: v.string(),
    description: v.string(),
    order: v.number(),
    coverImageId: v.optional(v.id("_storage")),
  }).index("by_order", ["order"]),
  
  photos: defineTable({
    title: v.string(),
    description: v.string(),
    sectionId: v.id("sections"),
    imageId: v.id("_storage"),
    thumbnailId: v.optional(v.id("_storage")),
    mediumId: v.optional(v.id("_storage")),
    date: v.string(),
    order: v.number(),
  }).index("by_section", ["sectionId", "order"]),
  
  settings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
