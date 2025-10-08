import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { platform } from "./schema";

export const createPost = internalMutation({
	args: v.object({
		content: v.string(),
		platform,
		title: v.string(),
	}),
	handler: async (ctx, { title, content, platform }) => {
		return await ctx.db.insert("posts", { content, platform, title });
	},
	returns: v.id("posts"),
});
