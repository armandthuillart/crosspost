import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { v } from "convex/values";
import { zodToConvex } from "convex-helpers/server/zod";
import authSchema from "~/convex/betterAuth/schema";
import { api, components } from "~/convex/generated/api";
import type { DataModel } from "~/convex/generated/dataModel";
import { query } from "~/convex/generated/server";
import { polarClient } from "~/lib/polar";
import { tierSchema } from "~/lib/schema";
import type { Tier, User } from "~/lib/types";

const siteUrl = process.env.SITE_URL;

export const authComponent = createClient<DataModel, typeof authSchema>(
	components.betterAuth,
	{
		local: {
			schema: authSchema,
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
		databaseHooks: {
			user: {
				create: {
					before: async ({ name, isAnonymous, ...rest }) => {
						const tier: Tier = isAnonymous ? "anonymous" : "free";
						const firstName = name.split(" ")[0];
						const lastName = name.split(" ")[1];
						return {
							data: {
								...rest,
								firstName,
								isAnonymous: isAnonymous ?? false,
								lastName,
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
					console.log("onLinkAccount", {
						anonymousUser,
						newUser,
					});

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

					await requireActionCtx(ctx).runMutation(api.chat.migrateChats, {
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
						successUrl: siteUrl,
					}),
					portal(),
					webhooks({
						onCustomerStateChanged: async ({
							data: { externalId, activeSubscriptions },
						}) => {
							console.log("onCustomerStateChanged", {
								activeSubscriptions,
								externalId,
							});

							const isPro = activeSubscriptions.some(
								(s) => s.status === "active",
							);

							if (externalId) {
								if (isPro) {
									await requireActionCtx(ctx).runMutation(
										api.betterAuth.auth.updateTier,
										{ tier: "pro", userId: externalId },
									);
								} else {
									await requireActionCtx(ctx).runMutation(
										api.betterAuth.auth.updateTier,
										{ tier: "free", userId: externalId },
									);
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
		trustedOrigins: [siteUrl as string],
		user: {
			additionalFields: {
				firstName: {
					required: false,
					type: "string",
				},
				lastName: {
					required: false,
					type: "string",
				},
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
	handler: async (ctx): Promise<User | null> => {
		const user = await authComponent.safeGetAuthUser(ctx);

		const tainted: User | null = user
			? {
					email: user.email,
					firstName: user.firstName!,
					id: user._id,
					lastName: user.lastName ?? undefined,
					tier: user.tier as Tier,
				}
			: null;

		return tainted;
	},
	returns: v.union(
		v.null(),
		v.object({
			email: v.string(),
			firstName: v.string(),
			id: v.string(),
			lastName: v.optional(v.string()),
			tier: zodToConvex(tierSchema),
		}),
	),
});
