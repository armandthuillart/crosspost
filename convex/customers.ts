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
