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
import authSchema from "./betterAuth/schema";

const siteUrl = process.env.SITE_URL;

const authFunctions: AuthFunctions = internal.auth;

export const { adapter, getAuthUser, registerRoutes } = createClient<
	DataModel,
	typeof authSchema
>(components.betterAuth, {
	authFunctions,
	local: {
		schema: authSchema,
	},
	triggers: {
		users: {
			onCreate: async (_, { isAnonymous }) => {
				if (isAnonymous) {
					console.log(
						"TRIGGER: An anonymous user was created, we should set his tier to anonymous",
					);
				}
			},
			onUpdate: async () => {
				console.log("TRIGGER: A user has been updated");
			},
		},
	},
	verbose: false,
});

export const createAuth = (
	ctx: GenericCtx<DataModel>,
	{ optionsOnly } = { optionsOnly: false },
) => {
	return betterAuth({
		account: {
			modelName: "accounts",
		},
		baseURL: siteUrl,
		database: adapter(ctx),
		logger: {
			disabled: optionsOnly,
		},
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
		session: {
			modelName: "sessions",
		},
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
			modelName: "users",
		},
		verification: {
			modelName: "verifications",
		},
	} satisfies BetterAuthOptions);
};
