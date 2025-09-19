import {
	abortStream,
	createThread,
	listUIMessages,
	syncStreams,
	type ThreadDoc,
	vPaginationResult,
	vStreamArgs,
	vThreadDoc,
} from "@convex-dev/agent";
import { type PaginationResult, paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { TITLE_SYSTEM_PROMPT } from "../lib/prompts";
import { api, components, internal } from "./_generated/api";
import { internalAction, mutation, query } from "./_generated/server";
import { chatAgent } from "./agents";
import { limit } from "./rateLimiting";
import { verifyOwnership } from "./utils";

export const createChat = mutation({
	args: {},
	handler: async (ctx): Promise<string> => {
		const user = await ctx.runQuery(api.auth.getUser, {});

		return await createThread(ctx, components.agent, {
			title: "New Chat",
			userId: user.id,
		});
	},
	returns: v.string(),
});

export const sendMessage = mutation({
	args: {
		prompt: v.string(),
		threadId: v.string(),
	},
	handler: async (ctx, { prompt, threadId }) => {
		const user = await verifyOwnership(ctx, threadId);

		await limit(ctx, user.tier, {
			key: user.id,
			throws: true,
		});

		const { message, messageId } = await chatAgent.saveMessage(ctx, {
			prompt,
			skipEmbeddings: true,
			threadId,
			userId: user.id,
		});

		await ctx.scheduler.runAfter(0, internal.chat.streamChat, {
			promptMessageId: messageId,
			threadId,
		});

		if (message.order === 0) {
			await ctx.scheduler.runAfter(0, internal.chat.nameChat, {
				prompt,
				threadId,
			});
		}
	},
	returns: v.null(),
});

export const streamChat = internalAction({
	args: {
		promptMessageId: v.string(),
		threadId: v.string(),
	},
	handler: async (ctx, { threadId, promptMessageId }) => {
		const { consumeStream } = await chatAgent.streamText(
			ctx,
			{ threadId },
			{ promptMessageId },
			{ saveStreamDeltas: { chunking: "word", throttleMs: 100 } },
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

export const nameChat = internalAction({
	args: {
		prompt: v.string(),
		threadId: v.string(),
	},
	handler: async (ctx, { prompt, threadId }) => {
		const { text: title } = await chatAgent.generateText(
			ctx,
			{ threadId },
			{
				model: "google/gemini-2.5-flash-lite",
				prompt,
				system: TITLE_SYSTEM_PROMPT,
			},
		);

		await chatAgent.updateThreadMetadata(ctx, {
			patch: { title },
			threadId,
		});
	},
	returns: v.null(),
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
	args: {
		paginationOpts: paginationOptsValidator,
	},
	handler: async (
		ctx,
		{ paginationOpts },
	): Promise<PaginationResult<ThreadDoc>> => {
		const user = await ctx.runQuery(api.auth.getUser, {});

		return await ctx.runQuery(components.agent.threads.listThreadsByUserId, {
			paginationOpts,
			userId: user.id,
		});
	},
	returns: vPaginationResult(vThreadDoc),
});
