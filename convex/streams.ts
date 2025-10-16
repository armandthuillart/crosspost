import { type AnthropicProviderOptions, anthropic } from "@ai-sdk/anthropic";
import type { GatewayProviderOptions } from "@ai-sdk/gateway";
import { abortStream } from "@convex-dev/agent";
import { v } from "convex/values";
import { CHAT_PROMPT } from "../lib/prompts";
import { components } from "./_generated/api";
import { internalAction, mutation } from "./_generated/server";
import { chatAgent } from "./agents";
import { locale } from "./schema";
import { getDraft, renameChat } from "./tools";
import { verifyOwnership } from "./utils";

export const streamChat = internalAction({
	args: {
		city: v.optional(v.string()),
		country: v.optional(v.string()),
		isPro: v.boolean(),
		locale,
		promptMessageId: v.string(),
		region: v.optional(v.string()),
		threadId: v.string(),
		userId: v.string(),
	},
	handler: async (
		ctx,
		{ isPro, city, locale, userId, threadId, country, region, promptMessageId },
	) => {
		const { consumeStream } = await chatAgent.streamText(
			ctx,
			{ threadId, userId },
			{
				model: isPro
					? "anthropic/claude-sonnet-4.5"
					: "anthropic/claude-4.5-haiku",
				promptMessageId,
				providerOptions: {
					anthropic: {
						thinking: {
							budgetTokens: 0.001,
							type: isPro ? "enabled" : "disabled",
						},
					} as AnthropicProviderOptions,
					gateway: { only: ["anthropic"] } as GatewayProviderOptions,
				},
				system: CHAT_PROMPT({ city, country, locale }),
				tools: {
					"get-draft": getDraft,
					"rename-chat": renameChat,
					...(isPro && {
						"web-search": anthropic.tools.webSearch_20250305({
							maxUses: 5,
							...((city || country || region) && {
								userLocation: {
									...(city && { city }),
									...(country && { country }),
									...(region && { region }),
									type: "approximate",
								},
							}),
						}),
					}),
				},
			},
			{ saveStreamDeltas: true },
		);

		await consumeStream();
	},
	returns: v.null(),
});

export const abortStreamByOrder = mutation({
	args: {
		order: v.number(),
		threadId: v.string(),
	},
	handler: async (ctx, { order, threadId }) => {
		await verifyOwnership(ctx, threadId);

		await abortStream(ctx, components.agent, {
			order,
			reason: "Aborting explicitly",
			threadId,
		});
	},
	returns: v.null(),
});
