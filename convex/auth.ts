import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { v } from "convex/values";
import { polarClient } from "../lib/polar";
import type { Tier, User } from "../lib/types";
import { api, components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authSchema from "./betterAuth/schema";
import { tier } from "./schema";

const siteUrl = process.env.SITE_URL;

export const {
	adapter,
	getAuth,
	getAnyUserById,
	registerRoutes,
	safeGetAuthUser,
} = createClient<DataModel, typeof authSchema>(components.betterAuth, {
	local: {
		schema: authSchema,
	},
	verbose: false,
});

export const createAuth = (
	ctx: GenericCtx<DataModel>,
	{ optionsOnly } = { optionsOnly: false },
) => {
	return betterAuth({
		advanced: {
			cookies: {
				session_data: {
					name: "SESSION_DATA",
				},
				session_token: {
					name: "SESSION_TOKEN",
				},
				state: {
					name: "SESSION_STATE",
				},
			},
		},
		baseURL: siteUrl,
		database: adapter(ctx),
		databaseHooks: {
			user: {
				create: {
					after: async ({ id: userId, name, email }) => {
						requireActionCtx(ctx).scheduler.runAfter(
							0,
							api.users.createCustomer,
							{ email, name, userId },
						);
					},
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
			level: "error",
		},
		plugins: [
			anonymous({
				onLinkAccount: async ({
					newUser: { user: newUser },
					anonymousUser: { user: anonymousUser },
				}) => {
					requireActionCtx(ctx).scheduler.runAfter(
						0,
						api.users.createCustomer,
						{
							email: newUser.email,
							name: newUser.name,
							userId: newUser.id,
						},
					);

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
		const user = await safeGetAuthUser(ctx);

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
			tier,
		}),
	),
});
