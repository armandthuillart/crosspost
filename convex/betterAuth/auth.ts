import { getStaticAuth } from "@convex-dev/better-auth";
import { v } from "convex/values";
import { subDays } from "date-fns";
import type { Tier } from "../../lib/types";
import { createAuth } from "../auth";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { internalMutation, query } from "./_generated/server";

export const auth = getStaticAuth(createAuth);

export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		const user = await ctx.db.get(identity?.subject as Id<"users">);

		return {
			email: user?.email,
			isAnonymous: user?.isAnonymous,
			name: user?.name,
			userId: user?._id,
			userTier: user?.tier as Tier,
		};
	},
});

export const tidyUpAnonymousUsers = internalMutation({
	args: {
		cursor: v.optional(v.string()),
	},
	handler: async (ctx, { cursor }) => {
		const twentyFourHoursAgo = subDays(new Date(), 1).getTime();

		const { page, isDone, continueCursor } = await ctx.db
			.query("users")
			.withIndex("by_is_anonymous", (q) => q.eq("isAnonymous", true))
			.filter((q) => q.lt(q.field("_creationTime"), twentyFourHoursAgo))
			.paginate({ cursor: cursor ?? null, numItems: 100 });

		for (const { _id: userId } of page) {
			await ctx.db.delete(userId);
		}

		if (!isDone) {
			await ctx.scheduler.runAfter(0, internal.auth.tidyUpAnonymousUsers, {
				cursor: continueCursor,
			});
		}
	},
});
