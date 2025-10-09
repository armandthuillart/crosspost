import { v } from "convex/values";
import { polarClient } from "../lib/polar";
import { components } from "./_generated/api";
import { action, internalMutation, mutation } from "./_generated/server";
import { createAuth, getAuth } from "./auth";
import { tier } from "./schema";

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

export const syncTier = mutation({
	args: {
		externalId: v.string(),
		tier,
	},
	handler: async (ctx, { tier, externalId }) => {
		const { auth } = await getAuth(createAuth, ctx);
		const internalAdapter = (await auth.$context).internalAdapter;

		internalAdapter.updateUser(externalId, {
			tier,
		});
	},
	returns: v.null(),
});

export const createCustomer = action({
	args: {
		email: v.string(),
		name: v.string(),
		userId: v.string(),
	},
	handler: async (_, { email, name, userId }) => {
		const paginated = await polarClient.customers.list({
			email,
			limit: 1,
		});

		const customer = paginated.result.items[0];

		if (!customer) {
			await polarClient.customers.create({
				email,
				externalId: userId,
				name,
			});
		}
	},
	returns: v.null(),
});
