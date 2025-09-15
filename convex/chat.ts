import {
	createThread,
	listUIMessages,
	syncStreams,
	vStreamArgs,
} from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import { internalAction, mutation, query } from "./_generated/server";
import { myAgent } from "./agents";

export const createChat = mutation({
	args: {},
	handler: async (ctx) => {
		return await createThread(ctx, components.agent, {
			title: "New Chat",
		});
	},
});

export const resumeChat = mutation({
	args: { prompt: v.string(), threadId: v.string() },
	handler: async (ctx, { prompt, threadId }) => {
		const { messageId } = await myAgent.saveMessage(ctx, {
			prompt,
			skipEmbeddings: true, // Will be generated lazily when streaming text.
			threadId,
		});

		await ctx.scheduler.runAfter(0, internal.chat.streamChat, {
			promptMessageId: messageId,
			threadId,
		});
	},
});

export const streamChat = internalAction({
	args: { promptMessageId: v.string(), threadId: v.string() },
	handler: async (ctx, { threadId, promptMessageId }) => {
		const { consumeStream } = await myAgent.streamText(
			ctx,
			{ threadId },
			{ promptMessageId },
			{ saveStreamDeltas: { chunking: "word", throttleMs: 100 } },
		);

		return consumeStream();
	},
});

export const renameChat = internalAction({
	args: { promptMessageId: v.string(), threadId: v.string() },
	handler: async (ctx, { threadId, promptMessageId }) => {
		const { text } = await myAgent.generateText(
			ctx,
			{ threadId },
			{ promptMessageId },
		);

		await myAgent.updateThreadMetadata(ctx, {
			patch: { title: text },
			threadId,
		});
	},
});

export const loadChat = query({
	args: {
		paginationOpts: paginationOptsValidator,
		streamArgs: vStreamArgs,
		threadId: v.string(),
	},
	handler: async (ctx, { threadId, streamArgs, paginationOpts }) => {
		const streams = await syncStreams(ctx, components.agent, {
			streamArgs,
			threadId,
		});

		const paginated = await listUIMessages(ctx, components.agent, {
			paginationOpts,
			threadId,
		});

		return {
			...paginated,
			streams,
		};
	},
});

export const listChats = query({
	args: { userId: v.string() },
	handler: async (ctx, { userId }) => {
		return await ctx.runQuery(components.agent.threads.listThreadsByUserId, {
			userId,
		});
	},
});
