import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { polarClient } from "../lib/polar";
import type { Tier } from "../lib/types";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authSchema from "./betterAuth/schema";

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

export const createAuth = (ctx: GenericCtx<DataModel>) =>
	betterAuth({
		baseURL: siteUrl,
		database: authComponent.adapter(ctx),
		plugins: [
			anonymous(),
			convex(),
			polar({
				client: polarClient,
				createCustomerOnSignUp: false,
				use: [
					checkout({
						authenticatedUsersOnly: true,
						products: [
							{
								productId: process.env.POLAR_PRODUCT_ID_PRO as string,
								slug: "pro" as Tier,
							},
						],
					}),
					portal(),
				],
			}),
		],
		socialProviders: {
			google: {
				accessType: "offline",
				clientId: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				prompt: "select_account consent",
			},
		},
	} satisfies BetterAuthOptions);

export const getUser = query({
	args: {},
	handler: async (ctx) => {
		return authComponent.safeGetAuthUser(ctx);
	},
});
