import { v } from "convex/values";
import { polarClient } from "../lib/polar";
import { query } from "./_generated/server";

export const getTier = query({
	args: { userId: v.string() },
	handler: async (_, { userId }) => {
		const customerState = await polarClient.customers.getStateExternal({
			externalId: userId,
		});

		const activeSubscription = customerState.activeSubscriptions.find(
			({ status }) => status === "active",
		);

		return activeSubscription ? "pro" : "free";
	},
});
