import {
	type AuthFunctions,
	createClient,
	type GenericCtx,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { polarClient } from "../lib/polar";
import type { Tier } from "../lib/types";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authSchema from "./betterAuth/schema";

const siteUrl = process.env.SITE_URL;

const authFunctions: AuthFunctions = internal.auth;

export const { adapter, triggersApi, getHeaders, getAuthUser, registerRoutes } =
	createClient<DataModel, typeof authSchema>(components.betterAuth, {
		authFunctions,
		local: {
			schema: authSchema,
		},
		triggers: {
			user: {
				onCreate: async (ctx, { isAnonymous }) => {
					if (isAnonymous) {
						console.log(
							"TRIGGER: An anonymous user was created, we should set his tier to anonymous",
						);
					}
				},
				onUpdate: async (ctx) => {
					console.log("TRIGGER: A user has been updated");
				},
			},
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
		logger: {
			disabled: optionsOnly,
		},
		plugins: [
			anonymous({
				onLinkAccount: async ({ newUser }) => {
					console.log(
						"onLinkAccount: An anonymous user linked his google account",
					);

					const paginated = await polarClient.customers.list({
						email: newUser.user.email,
						limit: 1,
					});

					console.log("onLinkAccount: Paginated", paginated);

					const customer = paginated.result.items[0];

					console.log("onLinkAccount: Customer", customer);

					if (!customer) {
						const newCustomer = await polarClient.customers.create({
							email: newUser.user.email,
							externalId: newUser.user.id,
						});

						console.log("onLinkAccount: New customer", newCustomer);
					}

					console.log(
						"onLinkAccount: A user has been linked to a customer, we should update set his tier to free",
					);
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
