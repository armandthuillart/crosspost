import { zodToConvex } from "convex-helpers/server/zod";
import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";
import { betterAuthComponent } from "./auth";
import { zodSchema } from "./tools/createDraft";

export const createDraft = mutation({
	args: zodToConvex(zodSchema),
	handler: async (ctx, { title, versions }) => {
		const userId = await betterAuthComponent.getAuthUserId(ctx);

		if (!userId) {
			throw new Error("User ID not found");
		}

		const draftId = await ctx.db.insert("drafts", {
			title,
			userId: userId as Id<"users">,
		});

		for (const [key, content] of Object.entries(versions)) {
			await ctx.db.insert("draftsVersions", {
				content,
				draftId,
				platform: key as "bluesky" | "threads" | "x",
			});
		}

		return draftId;
	},
});
