import {
	type AuthFunctions,
	createClient,
	type GenericCtx,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { v } from "convex/values";
import { polarClient } from "../lib/polar";
import type { Tier } from "../lib/types";
import { api, components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { internalMutation, query } from "./_generated/server";
import authSchema from "./betterAuth/schema";

const siteUrl = process.env.SITE_URL;

const authFunctions: AuthFunctions = internal.auth;

export const authComponent = createClient<DataModel, typeof authSchema>(
	components.betterAuth,
	{
		authFunctions,
		local: {
			schema: authSchema,
		},
		triggers: {
			user: {
				onCreate: async (ctx, { _id: userId, isAnonymous }) => {
					if (isAnonymous) {
						await ctx.runMutation(api.betterAuth.adapter.updateOne, {
							input: {
								model: "user",
								update: { tier: "anonymous" satisfies Tier },
								where: [{ field: "id", operator: "eq", value: userId }],
							},
						});
					}
				},
				onDelete: async (ctx, { _id: userId }) => {
					await ctx.scheduler.runAfter(
						0,
						internal.auth.deleteAllForUserIdAsync,
						{ userId },
					);
				},
			},
		},
		verbose: false,
	},
);

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();

export const createAuth = (
	ctx: GenericCtx<DataModel>,
	{ optionsOnly } = { optionsOnly: false },
) => {
	return betterAuth({
		baseURL: siteUrl,
		database: authComponent.adapter(ctx),
		logger: { disabled: optionsOnly },
		plugins: [
			anonymous({
				onLinkAccount: async ({ newUser }) => {
					const paginated = await polarClient.customers.list({
						email: newUser.user.email,
						limit: 1,
					});

					const customer = paginated.result.items[0];

					if (!customer) {
						await polarClient.customers.create({
							email: newUser.user.email,
							externalId: newUser.user.id,
						});
					}

					const adapter = authComponent.adapter(ctx);

					await adapter({}).update({
						model: "user",
						update: { tier: "free" satisfies Tier },
						where: [{ field: "id", operator: "eq", value: newUser.user.id }],
					});
				},
			}),
			polar({
				client: polarClient,
				createCustomerOnSignUp: false,
				use: [
					checkout({
						authenticatedUsersOnly: true,
						products: [
							{
								productId: process.env.POLAR_PRODUCT_ID_PRO as string,
								slug: "pro" satisfies Tier,
							},
						],
					}),
					portal(),
					webhooks({
						onCustomerStateChanged: async ({
							data: { externalId, activeSubscriptions },
						}) => {
							const isPro = activeSubscriptions.some(
								(s) => s.status === "active",
							);

							const adapter = authComponent.adapter(ctx);

							if (isPro) {
								await adapter({}).update({
									model: "user",
									update: { tier: "pro" satisfies Tier },
									where: [{ field: "id", operator: "eq", value: externalId }],
								});
							} else {
								await adapter({}).update({
									model: "user",
									update: { tier: "free" satisfies Tier },
									where: [{ field: "id", operator: "eq", value: externalId }],
								});
							}
						},
						secret: process.env.POLAR_WEBHOOK_SECRET as string,
					}),
				],
			}),
			convex(),
		],
		secret: process.env.BETTER_AUTH_SECRET,
		socialProviders: {
			google: {
				accessType: "offline",
				clientId: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				prompt: "select_account consent",
			},
		},
		trustedOrigins: [siteUrl as string],
		user: {
			additionalFields: {
				tier: {
					required: false,
					type: "string",
				},
			},
		},
	} satisfies BetterAuthOptions);
};

export const getUser = query({
	args: {},
	handler: async (ctx) => {
		const user = await authComponent.safeGetAuthUser(ctx);

		const userId = user?._id;
		const userTier = user?.tier;
		const isAnonymous = user?.isAnonymous ?? false;

		return {
			isAnonymous,
			userId: userId as string,
			userTier: userTier as Tier,
		};
	},
});

export const deleteAllForUserIdAsync = internalMutation({
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
