import { v } from "convex/values";
import { subDays } from "date-fns";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

export const deleteAnonymousUsers = internalMutation({
	args: { cursor: v.optional(v.string()) },
	handler: async (ctx, { cursor }) => {
		const twentyFourHoursAgo = subDays(new Date(), 1).getTime();

		const batch = await ctx.db
			.query("users")
			.withIndex("by_is_anonymous", (q) => q.eq("isAnonymous", true))
			.filter((q) => q.lt(q.field("_creationTime"), twentyFourHoursAgo))
			.paginate({ cursor: cursor ?? null, numItems: 100 });

		await Promise.all(
			batch.page.map(async (user) => {
				await ctx.runMutation(internal.chat.deleteChatsByUserId, {
					userId: user._id,
				});
				await ctx.db.delete(user._id);
			}),
		);

		if (!batch.isDone) {
			await ctx.scheduler.runAfter(0, internal.users.deleteAnonymousUsers, {
				cursor: batch.continueCursor,
			});
		}
	},
});
