import { v } from "convex/values";
import { tier } from "../schema";
import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

export const syncTier = mutation({
	args: {
		externalId: v.string(),
		tier,
	},
	handler: async (ctx, { tier, externalId }) => {
		await ctx.db.patch(externalId as Id<"user">, {
			tier,
		});
	},
	returns: v.null(),
});
