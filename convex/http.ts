import type { GatewayModelId } from "@ai-sdk/gateway";
import {
	convertToModelMessages,
	smoothStream,
	stepCountIs,
	streamText,
	validateUIMessages,
} from "ai";
import { httpRouter } from "convex/server";
import { z } from "zod/v3";
import { SYSTEM_PROMPT } from "../lib/prompts";
import { tools } from "../lib/tools";
import { extract, toUIMessages } from "../lib/utils";
import { api, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { httpAction } from "./_generated/server";
import { authComponent, createAuth } from "./auth";
import { rateLimiter } from "./rateLimiting";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth, { cors: true });

const bodySchema = z.object({
	message: z.object({
		id: z.string(),
		parts: z.array(
			z.object({
				text: z
					.string()
					.min(1, { message: "Must be at least 1 character" })
					.max(3000, { message: "Must be under 3000 characters" }),
				type: z.enum(["text"]),
			}),
		),
		role: z.enum(["user"]),
	}),
	optimisticId: z.string(),
});

http.route({
	handler: httpAction(async (ctx, request) => {
		console.log("we've hit the chat route");

		const { message, optimisticId } = await bodySchema.parseAsync(
			await request.json(),
		);

		console.log("message", message);
		console.log("optimisticId", optimisticId);

		const { userId, userTier } = await ctx.runQuery(
			internal.chat.authorizeChat,
		);

		console.log("userId", userId);
		console.log("userTier", userTier);

		await rateLimiter.limit(ctx, userTier, { key: userId, throws: true });

		const chat = await ctx.runQuery(api.chat.getChat, {
			optimisticId,
		});

		console.log("chat", chat);

		let chatId: Id<"chats">;

		if (!chat) {
			chatId = await ctx.runMutation(api.chat.createChat, {
				optimisticId,
				prompt: extract(message.parts),
			});
			console.log("no chat, creating chat", chatId);
		} else {
			chatId = chat._id;
			console.log("found a chat, using its id", chatId);
		}

		const previousMessages = await ctx.runQuery(api.chat.loadChat, {
			chatId,
		});

		const messages = [...toUIMessages(previousMessages), message];

		const validatedMessages = await validateUIMessages({ messages });

		console.log("messages", messages.length);

		const result = streamText({
			experimental_transform: smoothStream(),
			messages: convertToModelMessages(validatedMessages),
			model: "google/gemini-2.5-flash" as GatewayModelId,
			stopWhen: stepCountIs(5),
			system: SYSTEM_PROMPT,
			tools,
		});

		console.log("About to return stream response");

		const uiResponse = result.toUIMessageStreamResponse({
			onFinish: async ({ messages }) => {
				await ctx.runMutation(api.chat.saveChat, {
					chatId,
					messages,
				});
			},
			originalMessages: messages,
		});

		// Reflect CORS on the streaming response
		const origin = request.headers.get("Origin") ?? "*";
		const headers = new Headers(uiResponse.headers);
		headers.set("Access-Control-Allow-Origin", origin);
		headers.set(
			"Access-Control-Allow-Headers",
			"Content-Type, Digest, Authorization",
		);
		headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
		headers.set("Access-Control-Allow-Credentials", "true");
		headers.set(
			"Access-Control-Expose-Headers",
			"X-Vercel-AI-Data-Stream, Content-Type",
		);
		headers.set("Vary", "Origin");

		return new Response(uiResponse.body, {
			headers,
			status: uiResponse.status,
		});
	}),
	method: "POST",
	path: "/api/chat",
});

http.route({
	handler: httpAction(async (_, request) => {
		console.log("we've hit the chat options route");

		const origin = request.headers.get("Origin") ?? "*";
		const reqMethod =
			request.headers.get("Access-Control-Request-Method") ?? "POST";
		const reqHeaders =
			request.headers.get("Access-Control-Request-Headers") ??
			"Content-Type, Digest, Authorization";

		if (
			request.headers.get("Origin") !== null &&
			request.headers.get("Access-Control-Request-Method") !== null &&
			request.headers.get("Access-Control-Request-Headers") !== null
		) {
			return new Response(null, {
				headers: new Headers({
					"Access-Control-Allow-Credentials": "true",
					"Access-Control-Allow-Headers": reqHeaders,
					"Access-Control-Allow-Methods": `${reqMethod}, OPTIONS`,
					"Access-Control-Allow-Origin": origin,
					"Access-Control-Max-Age": "86400",
					Vary: "Origin",
				}),
			});
		} else {
			return new Response(null, {
				headers: new Headers({
					"Access-Control-Allow-Origin": origin,
					Vary: "Origin",
				}),
			});
		}
	}),
	method: "OPTIONS",
	path: "/api/chat",
});

export default http;
