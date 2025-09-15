import { v } from "convex/values";
import { subDays } from "date-fns";
import { components } from "../_generated/api";
import { authComponent, createAuth } from "../auth";
import { internal } from "./_generated/api";
import { internalMutation, mutation } from "./_generated/server";

// biome-ignore lint/suspicious/noExplicitAny: static instance for BetterAuth schema generation
export const auth = createAuth({} as any);

export const signInAnonymous = mutation({
	args: {},
	handler: async (ctx) => {
		return await createAuth(ctx).api.signInAnonymous({
			headers: await authComponent.getHeaders(ctx),
		});
	},
});

export const deleteAnonymousUsers = internalMutation({
	args: { cursor: v.optional(v.string()) },
	handler: async (ctx, { cursor }) => {
		const twentyFourHoursAgo = subDays(new Date(), 1).getTime();

		const batch = await ctx.db
			.query("user")
			.withIndex("by_is_anonymous", (q) => q.eq("isAnonymous", true))
			.filter((q) => q.lt(q.field("createdAt"), twentyFourHoursAgo))
			.paginate({ cursor: cursor ?? null, numItems: 100 });

		await Promise.all(
			batch.page.map(async (user) => {
				await ctx.runMutation(components.agent.users.deleteAllForUserIdAsync, {
					userId: user._id,
				});
			}),
		);

		if (!batch.isDone) {
			await ctx.scheduler.runAfter(0, internal.auth.deleteAnonymousUsers, {
				cursor: batch.continueCursor,
			});
		}
	},
});
