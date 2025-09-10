import { convexAdapter } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireEnv } from "@convex-dev/better-auth/utils";
import { checkout, polar, portal, usage } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import type { GenericCtx } from "../convex/_generated/server";
import { betterAuthComponent } from "../convex/auth";
import { isProduction } from "../lib/constants";

const siteUrl = requireEnv("SITE_URL");

export const polarClient = new Polar({
	accessToken: process.env.POLAR_ACCESS_TOKEN,
	server: isProduction ? "production" : "sandbox",
});

const createOptions = (ctx: GenericCtx) =>
	({
		baseURL: siteUrl,
		database: convexAdapter(ctx, betterAuthComponent),
		plugins: [
			anonymous(),
			polar({
				client: polarClient,
				createCustomerOnSignUp: false,
				use: [
					checkout({
						authenticatedUsersOnly: true,
						products: [
							{
								productId: process.env.POLAR_PRODUCT_ID_PRO as string,
								slug: "pro",
							},
						],
					}),
					portal(),
					usage(),
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
	}) satisfies BetterAuthOptions;

export const createAuth = (ctx: GenericCtx) => {
	const options = createOptions(ctx);
	return betterAuth({
		...options,
		plugins: [...options.plugins, convex({ options })],
	});
};
