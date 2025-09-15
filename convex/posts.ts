import { zodToConvex } from "convex-helpers/server/zod";
import { postSchema } from "../lib/schema";
import { internalMutation } from "./_generated/server";

export const createPost = internalMutation({
	args: zodToConvex(postSchema),
	handler: async (ctx, { title, content, platform }) => {
		return await ctx.db.insert("posts", { content, platform, title });
	},
});
