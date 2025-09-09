import { ActionCache } from "@convex-dev/action-cache";
import { v } from "convex/values";
import { Effect } from "effect";
import { z } from "zod";
import { polarClient } from "../lib/auth";
import { ChatSDKError } from "../lib/errors";
import { components, internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

const tierSchema = z.enum(["anonymous", "free", "pro"]);
type Tier = z.infer<typeof tierSchema>;

const tierCache = new ActionCache(components.actionCache, {
	action: internal.customers.getTier,
	name: "tier",
});

export const getTier = internalAction({
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

export const getTierCached = internalAction({
	args: {
		userId: v.id("users"),
	},
	handler: async (ctx, args): Promise<Tier> => {
		return await tierCache.fetch(ctx, { userId: args.userId });
	},
});

// import { Redis } from "@upstash/redis";
// import { v } from "convex/values";
// import { Effect } from "effect";
// import { hours, toSeconds } from "effect/Duration";
// import { z } from "zod";
// import { polarClient } from "../lib/auth";
// import { ChatSDKError } from "../lib/errors";
// import { api } from "./_generated/api";
// import { query } from "./_generated/server";

// const redis = Redis.fromEnv();

//

// export const getTier = query({
// 	args: {
// 		userId: v.id("users"),
// 	},
// 	handler: async (ctx, { userId }): Promise<z.infer<typeof tierSchema>> =>
// 		Effect.runPromise(
// 			Effect.gen(function* () {
// 				const cacheKey = `tier:${userId}`;

// 				const cachedTier = yield* Effect.tryPromise({
// 					catch: () => new ChatSDKError("offline:api"),
// 					try: () => redis.get(cacheKey),
// 				});

// 				if (cachedTier) {
// 					const parsedTier = yield* Effect.try({
// 						catch: () => null,
// 						try: () => tierSchema.parse(cachedTier),
// 					});

// 					if (parsedTier) {
// 						return parsedTier;
// 					}
// 				}

// 				const user = yield* Effect.tryPromise({
// 					catch: () => new ChatSDKError("unauthorized:api"),
// 					try: () => ctx.runQuery(api.auth.getUser, {}),
// 				});

// 				if (user?.isAnonymous) {
// 					return "anonymous";
// 				}

// 				const customerState = yield* Effect.tryPromise({
// 					catch: () => new ChatSDKError("offline:api"),
// 					try: () =>
// 						polarClient.customers.getStateExternal({ externalId: userId }),
// 				});

// 				const tier: z.infer<typeof tierSchema> =
// 					customerState.activeSubscriptions.some(
// 						({ status }) => status === "active",
// 					)
// 						? "pro"
// 						: "free";

// 				yield* Effect.tryPromise({
// 					catch: () => new ChatSDKError("offline:api"),
// 					try: () => redis.setex(cacheKey, toSeconds(hours(1)), tier),
// 				}).pipe(Effect.ignore);

// 				return tier;
// 			}),
// 		),
// });
