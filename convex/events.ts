import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db
      .query("events")
      .withIndex("by_created")
      .order("desc")
      .collect();
    
    return Promise.all(
      events.map(async (event) => ({
        ...event,
        imageUrl: await ctx.storage.getUrl(event.imageId),
      }))
    );
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    link: v.string(),
    imageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});