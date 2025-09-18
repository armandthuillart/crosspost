import { getStaticAuth } from "@convex-dev/better-auth";
import { v } from "convex/values";
import { subDays } from "date-fns";
import { createAuth } from "../auth";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { internalMutation } from "./_generated/server";
import { tier } from "./schema";

export const auth = getStaticAuth(createAuth);

export const tidyUpAnonymousUsers = internalMutation({
	args: {
		cursor: v.optional(v.string()),
	},
	handler: async (ctx, { cursor }) => {
		const twentyFourHoursAgo = subDays(new Date(), 1).getTime();

		const { page, isDone, continueCursor } = await ctx.db
			.query("user")
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

export const setTier = internalMutation({
	args: { tier, userId: v.string() },
	handler: async (ctx, { tier, userId }) => {
		await ctx.db.patch(userId as Id<"user">, { tier });
	},
});
