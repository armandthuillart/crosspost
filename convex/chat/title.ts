import { gateway } from "@ai-sdk/gateway";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";
import { chatAgent } from "../agent";

export const generate = internalAction({
	args: { prompt: v.string(), threadId: v.string() },
	handler: async (ctx, { prompt, threadId }) => {
		const { userId } = await ctx.runQuery(internal.chat.thread.authorize, {
			threadId,
		});

		const result = await chatAgent.generateText(
			ctx,
			{ threadId, userId },
			{ model: gateway.languageModel("google/gemini-2.5-flash-lite"), prompt },
		);

		const { title } = await chatAgent.updateThreadMetadata(ctx, {
			patch: { title: result.text },
			threadId,
		});

		return title;
	},
});
