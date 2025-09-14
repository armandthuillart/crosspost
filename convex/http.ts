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
		const { message, optimisticId } = await bodySchema.parseAsync(
			await request.json(),
		);

		const { userId, userTier } = await ctx.runQuery(
			internal.chat.authorizeChat,
		);

		await rateLimiter.limit(ctx, userTier, { key: userId, throws: true });

		const chat = await ctx.runQuery(api.chat.getChat, {
			optimisticId,
		});

		let chatId: Id<"chats">;

		if (!chat) {
			chatId = await ctx.runMutation(api.chat.createChat, {
				optimisticId,
				prompt: extract(message.parts),
			});
		} else {
			chatId = chat._id;
		}

		const previousMessages = await ctx.runQuery(api.chat.loadChat, {
			chatId,
		});

		const messages = [...toUIMessages(previousMessages), message];

		const validatedMessages = await validateUIMessages({ messages });

		const result = streamText({
			experimental_transform: smoothStream(),
			messages: convertToModelMessages(validatedMessages),
			model: "google/gemini-2.5-flash" as GatewayModelId,
			stopWhen: stepCountIs(5),
			system: SYSTEM_PROMPT,
			tools,
		});

		return result.toUIMessageStreamResponse({
			onFinish: async ({ messages }) => {
				await ctx.runMutation(api.chat.saveChat, {
					chatId,
					messages,
				});
			},
			originalMessages: messages,
		});
	}),
	method: "POST",
	path: "/api/chat",
});

export default http;
