import {
	abortStream,
	createThread,
	getThreadMetadata,
	listUIMessages,
	syncStreams,
	type ThreadDoc,
	vStreamArgs,
} from "@convex-dev/agent";
import { type PaginationResult, paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { ChatSDKError } from "../lib/errors";
import { TITLE_MODEL } from "../lib/gateway";
import { TITLE_SYSTEM_PROMPT } from "../lib/prompts";
import { api, components, internal } from "./_generated/api";
import {
	type ActionCtx,
	internalAction,
	type MutationCtx,
	mutation,
	type QueryCtx,
	query,
} from "./_generated/server";
import { chatAgent } from "./agents";
import { rateLimiter } from "./rateLimiting";

export const createChat = mutation({
	args: {},
	handler: async (ctx) => {
		const { userId } = await ctx.runQuery(api.auth.getUser, {});

		const threadId = await createThread(ctx, components.agent, {
			title: "New Chat",
			userId,
		});

		return threadId;
	},
});

export const sendMessage = mutation({
	args: { prompt: v.string(), threadId: v.string() },
	handler: async (ctx, { prompt, threadId }) => {
		const { userId, userTier } = await verifyOwnership(ctx, threadId);

		await rateLimiter.limit(ctx, userTier, {
			key: userId,
			throws: true,
		});

		const { messageId } = await chatAgent.saveMessage(ctx, {
			prompt,
			skipEmbeddings: true, // We're in a mutation (no access to fetch), so they'll be lazily generated when streaming.
			threadId,
			userId,
		});

		await ctx.scheduler.runAfter(0, internal.chat.streamChat, {
			promptMessageId: messageId,
			threadId,
		});
	},
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

		await consumeStream({
			onError: (error) => {
				console.error("chat.tsx: streamChat: error:", error);
			},
		});
	},
});

export const abortStreamByOrder = mutation({
	args: {
		order: v.number(),
		threadId: v.string(),
	},
	handler: async (ctx, { order, threadId }) => {
		await verifyOwnership(ctx, threadId);

		if (
			await abortStream(ctx, components.agent, {
				order,
				reason: "Aborting explicitly",
				threadId,
			})
		) {
			console.log("Aborted stream", threadId, order);
		} else {
			console.log("No stream found", threadId, order);
		}
	},
});

export const renameChat = internalAction({
	args: {
		prompt: v.string(),
		threadId: v.string(),
	},
	handler: async (ctx, { prompt, threadId }) => {
		const result = await chatAgent.generateText(
			ctx,
			{ threadId },
			{ model: TITLE_MODEL, prompt, system: TITLE_SYSTEM_PROMPT },
		);

		await chatAgent.updateThreadMetadata(ctx, {
			patch: { title: result.text },
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
	args: {
		paginationOpts: paginationOptsValidator,
	},
	handler: async (
		ctx,
		{ paginationOpts },
	): Promise<PaginationResult<ThreadDoc>> => {
		const { userId } = await ctx.runQuery(api.auth.getUser, {});

		const threads = await ctx.runQuery(
			components.agent.threads.listThreadsByUserId,
			{ paginationOpts, userId },
		);

		return threads;
	},
});

export async function verifyOwnership(
	ctx: QueryCtx | MutationCtx | ActionCtx,
	threadId: string,
) {
	const { userId, userTier } = await ctx.runQuery(api.auth.getUser, {});

	if (!userId) {
		throw new ChatSDKError("unauthorized:auth");
	}

	const { userId: threadUserId } = await getThreadMetadata(
		ctx,
		components.agent,
		{ threadId },
	);

	if (threadUserId !== userId) {
		throw new ChatSDKError("unauthorized:auth");
	}

	return { userId, userTier };
}
