import { getThreadMetadata } from "@convex-dev/agent";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import {
	type ActionCtx,
	internalAction,
	type MutationCtx,
	mutation,
	type QueryCtx,
} from "./_generated/server";
import { agent } from "./agent";
import { betterAuthComponent } from "./auth";

export const create = mutation({
	args: {},
	handler: async (ctx) => {
		const userId = await betterAuthComponent.getAuthUserId(ctx);

		const { threadId } = await agent.createThread(ctx, {
			userId,
		});

		return threadId;
	},
});

export const start = mutation({
	args: {
		prompt: v.string(),
		threadId: v.string(),
	},
	handler: async (ctx, { threadId, prompt }) => {
		await authorize(ctx, threadId);

		const { messageId } = await agent.saveMessage(ctx, {
			prompt,
			skipEmbeddings: true,
			threadId,
		});

		await ctx.scheduler.runAfter(0, internal.chat.stream, {
			promptMessageId: messageId,
			threadId,
		});
	},
});

export const stream = internalAction({
	args: {
		promptMessageId: v.string(),
		threadId: v.string(),
	},
	handler: async (ctx, { threadId, promptMessageId }) => {
		const result = await agent.streamText(
			ctx,
			{ threadId },
			{ promptMessageId },
			{ saveStreamDeltas: true },
		);

		await result.consumeStream();
	},
});

export async function authorize(
	ctx: QueryCtx | MutationCtx | ActionCtx,
	threadId: string,
	requireUser?: boolean,
) {
	const userId = await betterAuthComponent.getAuthUserId(ctx);

	if (requireUser && !userId) {
		throw new Error("Unauthorized: user is required");
	}

	const { userId: threadUserId } = await getThreadMetadata(
		ctx,
		components.agent,
		{ threadId },
	);

	if (requireUser && threadUserId !== userId) {
		throw new Error("Unauthorized: user does not match thread user");
	}
}
