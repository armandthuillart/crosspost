import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireMutationCtx } from "@convex-dev/better-auth/utils";
import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
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

export const { adapter, getHeaders, getAuthUser, triggersApi, registerRoutes } =
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
					anonymousUser: { user: anonymousUser },
					newUser: { user: newUser },
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

					// Move the user threads to the new user.
					await requireMutationCtx(ctx).runMutation(api.chat.migrateChats	, {
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
							data: { activeSubscriptions },
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
	handler: async (ctx): Promise<User> => {
		const user = await getAuthUser(ctx);

		const tainted: User = {
			email: user.email,
			id: user._id,
			name: user.name,
			tier: user.tier as Tier,
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
