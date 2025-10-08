import { v } from "convex/values";
import { zodToConvex } from "convex-helpers/server/zod";
import { ChatSDKError } from "../../lib/errors";
import { tierSchema } from "../../lib/schema";
import { mutation } from "./_generated/server";

export const syncTier = mutation({
	args: {
		externalId: v.string(),
		tier: zodToConvex(tierSchema),
	},
	handler: async (ctx, { tier, externalId }) => {
		const userId = ctx.db.normalizeId("user", externalId);

		if (!userId) {
			throw new ChatSDKError("not_found:auth");
		}

		await ctx.db.patch(userId, {
			tier,
		});
	},
	returns: v.null(),
});
