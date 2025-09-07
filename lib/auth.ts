import { convexAdapter } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireEnv } from "@convex-dev/better-auth/utils";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { minutes, toSeconds } from "effect/Duration";
import type { GenericCtx } from "../convex/_generated/server";
import { betterAuthComponent } from "../convex/auth";

const siteUrl = requireEnv("SITE_URL");

const createOptions = (ctx: GenericCtx) =>
	({
		advanced: {
			cookies: {
				session_data: {
					name: "session:data",
				},
				session_token: {
					name: "session:token",
				},
			},
		},
		baseURL: siteUrl,
		database: convexAdapter(ctx, betterAuthComponent),
		plugins: [anonymous()],
		session: {
			cookieCache: {
				enabled: true,
				maxAge: toSeconds(minutes(5)),
			},
		},
		telemetry: {
			enabled: false,
		},
	}) satisfies BetterAuthOptions;

export const createAuth = (ctx: GenericCtx) => {
	const options = createOptions(ctx);
	return betterAuth({
		...options,
		plugins: [...options.plugins, convex({ options })],
	});
};
