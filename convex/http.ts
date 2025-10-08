import { httpRouter } from "convex/server";
import { ChatSDKError } from "../lib/errors";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { createAuth, registerRoutes } from "./auth";

const http = httpRouter();

registerRoutes(http, createAuth);

http.route({
	handler: httpAction(async (ctx, request) => {
		if (!request.body) {
			throw new ChatSDKError("bad_request:api");
		}

		const body = await request.text();
		const headers = Object.fromEntries(request.headers.entries());

		await ctx.runAction(api.polar.webhooks, {
			body,
			headers,
		});

		return new Response(null, { status: 200 });
	}),
	method: "POST",
	path: "/polar/events",
});

export default http;
