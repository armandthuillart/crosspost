import { ActionCache } from "@convex-dev/action-cache";
import { v } from "convex/values";
import { Effect } from "effect";
import { z } from "zod";
import { polarClient } from "../lib/auth";
import { ChatSDKError } from "../lib/errors";
import { api, components, internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";

const tierSchema = z.enum(["anonymous", "free", "pro"]);
type Tier = z.infer<typeof tierSchema>;

const tierCache = new ActionCache(components.actionCache, {
	action: internal.customers.getTier,
	name: "tier",
});

export const getTier = internalAction({
	args: { userId: v.id("users") },
	handler: async (ctx, { userId }): Promise<Tier> =>
		Effect.runPromise(
			Effect.gen(function* () {
				const user = yield* Effect.tryPromise({
					catch: () => new ChatSDKError("offline:api"),
					try: () => ctx.runQuery(api.auth.getUser, {}),
				});

				if (user?.isAnonymous) {
					return "anonymous";
				}

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

export const getTierCached = action({
	args: {
		userId: v.id("users"),
	},
	handler: async (ctx, args): Promise<Tier> => {
		return await tierCache.fetch(ctx, { userId: args.userId });
	},
});
