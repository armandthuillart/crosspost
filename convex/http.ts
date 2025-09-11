import {
	convertToModelMessages,
	gateway,
	streamText,
	type UIMessage,
} from "ai";
import { httpRouter } from "convex/server";
import { createAuth } from "../lib/auth";
import { httpAction } from "./_generated/server";
import { betterAuthComponent } from "./auth";

const http = httpRouter();

betterAuthComponent.registerRoutes(http, createAuth);

http.route({
	handler: httpAction(async (_, req) => {
		const { messages }: { messages: UIMessage[] } = await req.json();

		const result = streamText({
			messages: convertToModelMessages(messages),
			model: gateway.languageModel("google/gemini-2.5-flash"),
		});

		return result.toUIMessageStreamResponse({
			headers: new Headers({
				"Access-Control-Allow-Origin": "*",
				Vary: "origin",
			}),
		});
	}),
	method: "POST",
	path: "/api/chat",
});

http.route({
	handler: httpAction(async (_, request) => {
		const headers = request.headers;
		if (
			headers.get("Origin") !== null &&
			headers.get("Access-Control-Request-Method") !== null &&
			headers.get("Access-Control-Request-Headers") !== null
		) {
			return new Response(null, {
				headers: new Headers({
					"Access-Control-Allow-Headers": "Content-Type, Digest, Authorization",
					"Access-Control-Allow-Methods": "POST",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Max-Age": "86400",
				}),
			});
		} else {
			return new Response();
		}
	}),
	method: "OPTIONS",
	path: "/api/chat",
});

export default http;
