import { getThreadMetadata } from "@convex-dev/agent";
import { v } from "convex/values";
import { ChatSDKError } from "../../lib/errors";
import type { Tier } from "../../lib/types";
import { api, components, internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import { internalAction, internalQuery, mutation } from "../_generated/server";
import { chatAgent } from "../agent";
import { rateLimiter } from "../rateLimiting";

export const create = mutation({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new ChatSDKError("unauthorized:chat");
		}

		const { threadId } = await chatAgent.createThread(ctx, {
			title: "New Chat",
			userId: identity.subject,
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
		const { userId, userTier } = await ctx.runQuery(
			internal.chat.thread.authorize,
			{ threadId },
		);

		await rateLimiter.limit(ctx, userTier, { key: userId, throws: true });

		const { messageId } = await chatAgent.saveMessage(ctx, {
			prompt,
			skipEmbeddings: true,
			threadId,
		});

		await ctx.scheduler.runAfter(0, internal.chat.thread.stream, {
			promptMessageId: messageId,
			threadId,
		});

		await ctx.scheduler.runAfter(0, internal.chat.title.generate, {
			prompt,
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
		const result = await chatAgent.streamText(
			ctx,
			{ threadId },
			{ promptMessageId },
			{ saveStreamDeltas: { chunking: "word", throttleMs: 100 } },
		);

		await result.consumeStream();
	},
});

export const authorize = internalQuery({
	args: { threadId: v.string() },
	handler: async (
		ctx,
		{ threadId },
	): Promise<{ userId: Id<"users">; userTier: Tier }> => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new ChatSDKError("unauthorized:chat");
		}

		const { userId } = await getThreadMetadata(ctx, components.agent, {
			threadId,
		});

		if (identity.subject !== userId) {
			throw new ChatSDKError("forbidden:chat");
		}

		const user = await ctx.db.get(userId as Id<"users">);

		let userTier: Tier = "anonymous";

		if (!user?.isAnonymous) {
			userTier = await ctx.runQuery(api.customers.getTier, {
				userId: userId as Id<"users">,
			});
		}

		return { userId: userId as Id<"users">, userTier };
	},
});
