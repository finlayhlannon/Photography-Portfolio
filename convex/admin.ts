import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const authenticate = mutation({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    // Simple password check - in production, use proper auth
    const adminPassword = "portfolio2024"; // Change this password
    return args.password === adminPassword;
  },
});

export const getSetting = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
    return setting?.value || null;
  },
});

export const setSetting = mutation({
  args: { key: v.string(), value: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
    
    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
    } else {
      await ctx.db.insert("settings", { key: args.key, value: args.value });
    }
  },
});
