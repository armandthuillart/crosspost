import { v } from "convex/values";
import { zodToConvex } from "convex-helpers/server/zod";
import { platformSchema } from "../lib/schema";
import { internalMutation } from "./_generated/server";

export const createPost = internalMutation({
	args: v.object({
		content: v.string(),
		platform: zodToConvex(platformSchema),
		title: v.string(),
	}),
	handler: async (ctx, { title, content, platform }) => {
		return await ctx.db.insert("posts", { content, platform, title });
	},
	returns: v.id("posts"),
});
