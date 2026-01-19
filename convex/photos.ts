import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listBySection = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    const photos = await ctx.db
      .query("photos")
      .withIndex("by_section", (q) => q.eq("sectionId", args.sectionId))
      .collect();
    
    return Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        imageUrl: await ctx.storage.getUrl(photo.imageId),
        thumbnailUrl: photo.thumbnailId ? await ctx.storage.getUrl(photo.thumbnailId) : null,
        mediumUrl: photo.mediumId ? await ctx.storage.getUrl(photo.mediumId) : null,
      }))
    );
  },
});

export const get = query({
  args: { id: v.id("photos") },
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.id);
    if (!photo) return null;
    
    return {
      ...photo,
      imageUrl: await ctx.storage.getUrl(photo.imageId),
      thumbnailUrl: photo.thumbnailId ? await ctx.storage.getUrl(photo.thumbnailId) : null,
      mediumUrl: photo.mediumId ? await ctx.storage.getUrl(photo.mediumId) : null,
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    sectionId: v.id("sections"),
    imageId: v.id("_storage"),
    thumbnailId: v.optional(v.id("_storage")),
    mediumId: v.optional(v.id("_storage")),
    date: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("photos", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("photos"),
    title: v.string(),
    description: v.string(),
    date: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const updateWithThumbnails = mutation({
  args: {
    id: v.id("photos"),
    thumbnailId: v.id("_storage"),
    mediumId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const { id, thumbnailId, mediumId } = args;
    await ctx.db.patch(id, { thumbnailId, mediumId });
  },
});

export const remove = mutation({
  args: { id: v.id("photos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
