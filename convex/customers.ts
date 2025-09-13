import { v } from "convex/values";
import { Effect } from "effect";
import { ChatSDKError } from "../lib/errors";
import { polarClient } from "../lib/polar";
import type { Tier } from "../lib/types";
import { query } from "./_generated/server";

export const getTier = query({
	args: { userId: v.string() },
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
