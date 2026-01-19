import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const sections = await ctx.db
      .query("sections")
      .withIndex("by_order")
      .collect();
    
    return Promise.all(
      sections.map(async (section) => {
        // Get the FIRST photo from this section as preview
        const firstPhoto = await ctx.db
          .query("photos")
          .withIndex("by_section", (q) => q.eq("sectionId", section._id))
          .order("asc")
          .first();
        
        return {
          ...section,
          coverImageUrl: section.coverImageId 
            ? await ctx.storage.getUrl(section.coverImageId)
            : firstPhoto 
            ? await ctx.storage.getUrl(firstPhoto.imageId)
            : null,
        };
      })
    );
  },
});

export const get = query({
  args: { id: v.id("sections") },
  handler: async (ctx, args) => {
    const section = await ctx.db.get(args.id);
    if (!section) return null;
    
    return {
      ...section,
      coverImageUrl: section.coverImageId 
        ? await ctx.storage.getUrl(section.coverImageId)
        : null,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    order: v.number(),
    coverImageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sections", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("sections"),
    name: v.string(),
    description: v.string(),
    order: v.number(),
    coverImageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("sections") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
