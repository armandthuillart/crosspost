import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { platform } from "./schema";

export const createPost = internalMutation({
	args: v.object({
		content: v.string(),
		platform,
	}),
	handler: async (ctx, { content, platform }) => {
		return await ctx.db.insert("posts", {
			content,
			platform,
		});
	},
	returns: v.id("posts"),
});
