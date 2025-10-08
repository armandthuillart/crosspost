"use node";

import { validateEvent } from "@polar-sh/sdk/webhooks.js";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { action } from "./_generated/server";

export const webhooks = action({
	args: {
		body: v.any(),
		headers: v.any(),
	},
	handler: async (ctx, { body, headers }) => {
		const event = validateEvent(
			body,
			headers,
			process.env.POLAR_WEBHOOK_SECRET as string,
		);

		if (event.type === "customer.state_changed") {
			const { externalId, activeSubscriptions } = event.data;

			const isPro = activeSubscriptions.some(
				({ status }) => status === "active",
			);

			if (externalId) {
				if (isPro) {
					await ctx.runMutation(api.betterAuth.users.syncTier, {
						externalId,
						tier: "pro",
					});
				} else {
					await ctx.runMutation(api.betterAuth.users.syncTier, {
						externalId,
						tier: "free",
					});
				}
			}
		}
	},
});
