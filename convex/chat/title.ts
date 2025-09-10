import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";
import { titleAgent } from "../agent";

export const generate = internalAction({
	args: { prompt: v.string(), threadId: v.string() },
	handler: async (ctx, { prompt, threadId }) => {
		const { userId } = await ctx.runQuery(internal.chat.thread.authorize, {
			threadId,
		});

		const result = await titleAgent.generateText(
			ctx,
			{ threadId, userId },
			{ prompt },
		);

		const { title } = await titleAgent.updateThreadMetadata(ctx, {
			patch: { title: result.text },
			threadId,
		});

		return title;
	},
});
