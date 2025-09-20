import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { ConvexHttpClient } from "convex/browser";
import { v } from "convex/values";
import { zodToConvex } from "convex-helpers/server/zod";
import { polarClient } from "../lib/polar";
import { tierSchema } from "../lib/schema";
import type { Tier, User } from "../lib/types";
import { api, components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authSchema from "./betterAuth/schema";

const siteUrl = process.env.SITE_URL;

export const {
	adapter,
	getHeaders,
	triggersApi,
	registerRoutes,
	safeGetAuthUser,
} = createClient<DataModel, typeof authSchema>(components.betterAuth, {
	local: {
		schema: authSchema,
	},
	verbose: false,
});

export const { onCreate, onUpdate, onDelete } = triggersApi();

export const createAuth = (
	ctx: GenericCtx<DataModel>,
	{ optionsOnly } = { optionsOnly: false },
) => {
	return betterAuth({
		baseURL: siteUrl,
		database: adapter(ctx),
		databaseHooks: {
			user: {
				create: {
					before: async ({ isAnonymous, ...rest }) => {
						const tier: Tier = isAnonymous ? "anonymous" : "free";
						return {
							data: {
								...rest,
								isAnonymous: isAnonymous ?? false,
								tier,
							},
						};
					},
				},
			},
		},
		logger: {
			disabled: optionsOnly,
		},
		plugins: [
			anonymous({
				onLinkAccount: async ({
					newUser: { user: newUser },
					anonymousUser: { user: anonymousUser },
				}) => {
					const paginated = await polarClient.customers.list({
						email: newUser.email,
						limit: 1,
					});

					const customer = paginated.result.items[0];

					if (!customer) {
						await polarClient.customers.create({
							email: newUser.email,
							externalId: newUser.id,
							name: newUser.name,
						});
					}

					const convex = new ConvexHttpClient(
						"https://content-boar-853.convex.cloud",
					);

					await convex.mutation(api.chat.migrateChats, {
						anonymousUserId: anonymousUser.id,
						newUserId: newUser.id,
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

							const convex = new ConvexHttpClient(
								"https://content-boar-853.convex.cloud",
							);

							if (externalId) {
								if (isPro) {
									await convex.mutation(api.betterAuth.auth.updateTier, {
										tier: "pro",
										userId: externalId,
									});
								} else {
									await convex.mutation(api.betterAuth.auth.updateTier, {
										tier: "free",
										userId: externalId,
									});
								}
							}
						},
						secret: process.env.POLAR_WEBHOOK_SECRET as string,
					}),
				],
			}),
			convex(),
		],
		socialProviders: {
			google: {
				accessType: "offline",
				clientId: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				prompt: "select_account consent",
			},
		},
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
	handler: async (ctx): Promise<User> => {
		const user = await safeGetAuthUser(ctx);

		const tainted: User = {
			email: user?.email ?? "",
			id: user?._id ?? "",
			name: user?.name ?? "",
			tier: (user?.tier as Tier) ?? "anonymous",
		};

		return tainted;
	},
	returns: v.object({
		email: v.string(),
		id: v.string(),
		name: v.string(),
		tier: zodToConvex(tierSchema),
	}),
});
