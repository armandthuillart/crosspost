import {
	createThread,
	listUIMessages,
	syncStreams,
	vStreamArgs,
} from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { TITLE_MODEL } from "../lib/gateway";
import { TITLE_SYSTEM_PROMPT } from "../lib/prompts";
import { components, internal } from "./_generated/api";
import { internalAction, mutation, query } from "./_generated/server";
import { myAgent } from "./agents";

export const createChat = mutation({
	args: { prompt: v.string() },
	handler: async (ctx, { prompt }) => {
		const threadId = await createThread(ctx, components.agent, {
			title: "New Chat",
		});

		await ctx.scheduler.runAfter(0, internal.chat.renameChat, {
			prompt,
			threadId,
		});

		return threadId;
	},
});

export const sendMessage = mutation({
	args: { prompt: v.string(), threadId: v.string() },
	handler: async (ctx, { prompt, threadId }) => {
		const { messageId: promptMessageId } = await myAgent.saveMessage(ctx, {
			prompt,
			skipEmbeddings: true, // We're in a mutation, so we'll create the embeddings lazily when streaming text.
			threadId,
		});

		await ctx.scheduler.runAfter(0, internal.chat.streamChat, {
			promptMessageId,
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
	args: { prompt: v.string(), threadId: v.string() },
	handler: async (ctx, { prompt, threadId }) => {
		const { text } = await myAgent.generateText(
			ctx,
			{ threadId },
			{ model: TITLE_MODEL, prompt, system: TITLE_SYSTEM_PROMPT },
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
