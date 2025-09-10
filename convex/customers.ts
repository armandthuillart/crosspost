import { ActionCache } from "@convex-dev/action-cache";
import { HOUR } from "@convex-dev/rate-limiter";
import { v } from "convex/values";
import { Effect } from "effect";
import { polarClient } from "../lib/auth";
import { ChatSDKError } from "../lib/errors";
import type { Tier } from "../lib/types";
import { api, components } from "./_generated/api";
import { action, internalAction } from "./_generated/server";

export const getTier = action({
	args: { userId: v.id("users") },
	handler: async (_, { userId }): Promise<Tier> =>
		Effect.runPromise(
			Effect.gen(function* () {
				const customerState = yield* Effect.tryPromise({
					catch: () => new ChatSDKError("offline:api"),
					try: () =>
						polarClient.customers.getStateExternal({ externalId: userId }),
				});

				const tier: Tier = customerState.activeSubscriptions.some(
					({ status }) => status === "active",
				)
					? "pro"
					: "free";

				return tier;
			}),
		),
});

const tierCache = new ActionCache(components.actionCache, {
	action: api.customers.getTier,
	name: "tier",
	ttl: HOUR,
});

export const useTier = internalAction({
	args: { userId: v.id("users") },
	handler: async (ctx, args): Promise<Tier> => {
		return await tierCache.fetch(ctx, { userId: args.userId });
	},
});

// import { ActionCache } from "@convex-dev/action-cache";
// import { v } from "convex/values";
// import { Effect } from "effect";
// import { z } from "zod";
// import { polarClient } from "../lib/auth";
// import { ChatSDKError } from "../lib/errors";
// import { api, components, internal } from "./_generated/api";
// import { action, internalAction } from "./_generated/server";

// const tierSchema = z.enum(["anonymous", "free", "pro"]);
// type Tier = z.infer<typeof tierSchema>;

// const tierCache = new ActionCache(components.actionCache, {
// 	action: internal.customers.storeTier,
// 	name: "tier",
// 	ttl: 1000 * 60 * 60,
// });

// export const storeTier = internalAction({
// 	args: { userId: v.id("users") },
// 	handler: async (ctx, { userId }): Promise<Tier> =>
// 		Effect.runPromise(
// 			Effect.gen(function* () {
// 				const user = yield* Effect.tryPromise({
// 					catch: () => new ChatSDKError("offline:api"),
// 					try: () => ctx.runQuery(api.auth.getUser),
// 				});

// 				if (user?.isAnonymous) {
// 					return "anonymous";
// 				}

// 				const customerState = yield* Effect.tryPromise({
// 					catch: () => new ChatSDKError("offline:api"),
// 					try: () =>
// 						polarClient.customers.getStateExternal({ externalId: userId }),
// 				});

// 				const tier: Tier = customerState.activeSubscriptions.some(
// 					({ status }) => status === "active",
// 				)
// 					? "pro"
// 					: "free";

// 				return tier;
// 			}),
// 		),
// });

// export const getTier = internalAction({
// 	args: { userId: v.id("users") },
// 	handler: async (ctx, args): Promise<Tier> => {
// 		return await tierCache.fetch(ctx, { userId: args.userId });
// 	},
// });

// export const getTierPublic = action({
// 	args: { userId: v.id("users") },
// 	handler: async (ctx, args): Promise<Tier> => {
// 		return await ctx.runAction(internal.customers.getTier, {
// 			userId: args.userId,
// 		});
// 	},
// });
