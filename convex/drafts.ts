import { zodToConvex } from "convex-helpers/server/zod";
import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";
import { zodSchema } from "./tools/createDraft";

export const createDraft = mutation({
	args: zodToConvex(zodSchema),
	handler: async (ctx, { title, versions }) => {
		const identity = await ctx.auth.getUserIdentity();

		const draftId = await ctx.db.insert("drafts", {
			title,
			userId: identity?.subject as Id<"users">,
		});

		for (const [platform, { content }] of Object.entries(versions)) {
			await ctx.db.insert("versions", {
				content,
				draftId,
				// @ts-expect-error — ?
				platform,
			});
		}

		return draftId;
	},
});
