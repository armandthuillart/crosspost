import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { polarClient } from "../lib/polar";
import type { Tier } from "../lib/types";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authSchema from "./betterAuth/schema";

const siteUrl = process.env.SITE_URL;

export const { adapter, triggersApi, getHeaders, getAuthUser, registerRoutes } =
	createClient<DataModel, typeof authSchema>(components.betterAuth, {
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
					before: async (user) => {
						return {
							data: {
								...user,
								tier: user.isAnonymous
									? ("anonymous" satisfies Tier)
									: ("free" satisfies Tier),
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
					newUser: {
						user: { name, email, id: externalId },
					},
				}) => {
					const paginated = await polarClient.customers.list({
						email,
						limit: 1,
					});

					const customer = paginated.result.items[0];

					if (!customer) {
						await polarClient.customers.create({
							email,
							externalId,
							name,
						});
					}
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

							if (isPro) {
								console.log(
									"onCustomerStateChanged: A user is now pro, we should update his tier to pro",
								);
							} else {
								console.log(
									"onCustomerStateChanged: A user is not longer pro, we should downgrade his tier to free",
								);
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
	handler: async (ctx) => {
		const user = await getAuthUser(ctx);

		return {
			isAnonymous: user.isAnonymous ?? false,
			userId: user._id,
			userTier: user.tier as Tier,
		};
	},
});
