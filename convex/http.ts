import { validateEvent } from "@polar-sh/sdk/webhooks.js";
import { httpActionGeneric, httpRouter } from "convex/server";
import { ChatSDKError } from "../lib/errors";
import { api } from "./_generated/api";
import { createAuth, registerRoutes } from "./auth";

const http = httpRouter();

registerRoutes(http, createAuth);

http.route({
	handler: httpActionGeneric(async (ctx, request) => {
		if (!request.body) {
			throw new ChatSDKError("bad_request:api");
		}

		const body = await request.text();
		const headers = Object.fromEntries(request.headers.entries());

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

		return new Response(null, { status: 200 });
	}),
	method: "POST",
	path: "/polar/events",
});

export default http;
