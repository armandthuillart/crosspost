import { getStaticAuth } from "@convex-dev/better-auth";
import { v } from "convex/values";
import { zodToConvex } from "convex-helpers/server/zod";
import { subDays } from "date-fns";
import { createAuth } from "~/convex/auth";
import { internal } from "~/convex/betterAuth/generated/api";
import type { Id } from "~/convex/betterAuth/generated/dataModel";
import {
	internalMutation,
	mutation,
} from "~/convex/betterAuth/generated/server";
import { tierSchema } from "~/lib/schema";

export const auth = getStaticAuth(createAuth);

export const tidyUpAnonymousUsers = internalMutation({
	args: {
		cursor: v.optional(v.string()),
	},
	handler: async (ctx, { cursor }) => {
		const twentyFourHoursAgo = subDays(new Date(), 1).getTime();

		const { page, isDone, continueCursor } = await ctx.db
			.query("user")
			.withIndex("by_is_anonymous", (q) =>
				q.eq("isAnonymous", true).lt("_creationTime", twentyFourHoursAgo),
			)
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
	returns: v.null(),
});

export const updateTier = mutation({
	args: {
		tier: zodToConvex(tierSchema),
		userId: v.string(),
	},
	handler: async (ctx, { tier, userId }) => {
		await ctx.db.patch(userId as Id<"user">, {
			tier,
		});
	},
	returns: v.null(),
});
