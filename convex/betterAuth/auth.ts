import { getStaticAuth } from "@convex-dev/better-auth";
import { v } from "convex/values";
import { subDays } from "date-fns";
import { createAuth } from "../auth";
import { api, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { internalMutation } from "./_generated/server";

export const auth = getStaticAuth(createAuth);

export const deleteInactiveAnonymousUsers = internalMutation({
	args: { cursor: v.optional(v.string()) },
	handler: async (ctx, { cursor }) => {
		const twentyFourHoursAgo = subDays(new Date(), 1).getTime();

		const batch = await ctx.db
			.query("user")
			.withIndex("by_is_anonymous", (q) => q.eq("isAnonymous", true))
			.filter((q) => q.lt(q.field("createdAt"), twentyFourHoursAgo))
			.paginate({ cursor: cursor ?? null, numItems: 100 });

		await Promise.all(
			batch.page.map(async ({ _id: userId }) => {
				await ctx.runMutation(api.adapter.deleteOne, {
					input: {
						model: "user",
						where: [
							{ field: "id", operator: "eq", value: userId },
							{ field: "isAnonymous", operator: "eq", value: true },
						],
					},
				});
			}),
		);

		if (!batch.isDone) {
			await ctx.scheduler.runAfter(
				0,
				internal.auth.deleteInactiveAnonymousUsers,
				{ cursor: batch.continueCursor },
			);
		}
	},
});

export const saveTier = internalMutation({
	args: {
		tier: v.union(v.literal("anonymous"), v.literal("free"), v.literal("pro")),
		userId: v.string(),
	},
	handler: async (ctx, { tier, userId }) => {
		console.log("saveTier in the saveTier mutation", tier, userId);

		await ctx.db.patch(userId as Id<"user">, { tier });
	},
	returns: v.null(),
});
