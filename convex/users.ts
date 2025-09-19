import { v } from "convex/values";
import { components } from "./_generated/api";
import { internalMutation } from "./_generated/server";

export const deleteAllForUserId = internalMutation({
	args: { userId: v.string() },
	handler: async (ctx, { userId }) => {
		for await (const { _id: draftId } of ctx.db
			.query("drafts")
			.withIndex("by_user", (q) => q.eq("userId", userId))) {
			for await (const { _id: versionId } of ctx.db
				.query("versions")
				.withIndex("by_draft_platform", (q) => q.eq("draftId", draftId))) {
				await ctx.db.delete(versionId);
			}

			await ctx.db.delete(draftId);
		}

		await ctx.runMutation(components.agent.users.deleteAllForUserIdAsync, {
			userId,
		});
	},
	returns: v.null(),
});
