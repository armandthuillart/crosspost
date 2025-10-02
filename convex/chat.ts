import { anthropic } from "@ai-sdk/anthropic";
import {
	abortStream,
	createThread,
	listMessages,
	listUIMessages,
	syncStreams,
	type ThreadDoc,
	vPaginationResult,
	vStreamArgs,
	vThreadDoc,
} from "@convex-dev/agent";
import { MINUTE } from "@convex-dev/rate-limiter";
import { type PaginationResult, paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { chatAgent } from "~/convex/agents";
import { api, components, internal } from "~/convex/generated/api";
import { internalAction, mutation, query } from "~/convex/generated/server";
import { rateLimiter } from "~/convex/rateLimiting";
import { getDraft, renameChat } from "~/convex/tools";
import { verifyOwnership } from "~/convex/utils";
import { ChatSDKError } from "~/lib/errors";
import { CHAT_PROMPT } from "~/lib/prompts";

export const createChat = mutation({
	args: {},
	handler: async (ctx): Promise<string> => {
		const user = await ctx.runQuery(api.auth.getUser, {});

		if (!user) {
			throw new ChatSDKError("unauthorized:auth");
		}

		return await createThread(ctx, components.agent, {
			title: "New Chat",
			userId: user.id,
		});
	},
	returns: v.string(),
});

export const sendMessage = mutation({
	args: {
		city: v.optional(v.string()),
		country: v.optional(v.string()),
		prompt: v.string(),
		region: v.optional(v.string()),
		threadId: v.string(),
	},
	handler: async (ctx, { city, prompt, threadId, country, region }) => {
		const user = await verifyOwnership(ctx, threadId);

		if (!user) {
			throw new ChatSDKError("unauthorized:auth");
		}

		const { id: userId } = user;

		await rateLimiter.limit(ctx, user.tier, {
			key: user.id,
			throws: true,
		});

		const { messageId: promptMessageId } = await chatAgent.saveMessage(ctx, {
			prompt,
			skipEmbeddings: true,
			threadId,
			userId,
		});

		await ctx.scheduler.runAfter(0, internal.chat.streamChat, {
			city,
			country,
			promptMessageId,
			region,
			threadId,
			userId,
		});
	},
	returns: v.null(),
});

export const streamChat = internalAction({
	args: {
		city: v.optional(v.string()),
		country: v.optional(v.string()),
		promptMessageId: v.string(),
		region: v.optional(v.string()),
		threadId: v.string(),
		userId: v.string(),
	},
	handler: async (
		ctx,
		{ city, userId, threadId, country, region, promptMessageId },
	) => {
		const { consumeStream } = await chatAgent.streamText(
			ctx,
			{ threadId, userId },
			{
				promptMessageId,
				system: CHAT_PROMPT({ city, country }),
				tools: {
					"get-draft": getDraft,
					"rename-chat": renameChat,
					"web-search": anthropic.tools.webSearch_20250305({
						maxUses: 5,
						userLocation: {
							city,
							country,
							region,
							type: "approximate",
						},
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

export const loadChat = query({
	args: {
		paginationOpts: paginationOptsValidator,
		streamArgs: vStreamArgs,
		threadId: v.string(),
	},
	handler: async (ctx, { threadId, streamArgs, paginationOpts }) => {
		await verifyOwnership(ctx, threadId);

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

		if (!user) {
			throw new ChatSDKError("unauthorized:auth");
		}

		return await ctx.runQuery(components.agent.threads.listThreadsByUserId, {
			paginationOpts,
			userId: user.id,
		});
	},
	returns: vPaginationResult(vThreadDoc),
});

export const migrateChats = mutation({
	args: {
		anonymousUserId: v.string(),
		newUserId: v.string(),
	},
	handler: async (ctx, { anonymousUserId, newUserId }) => {
		const { page: threads } = await ctx.runQuery(
			components.agent.threads.listThreadsByUserId,
			{
				order: "desc",
				paginationOpts: { cursor: null, numItems: 1 },
				userId: anonymousUserId,
			},
		);

		const thread = threads[0];

		if (!thread) {
			await ctx.runMutation(internal.users.deleteAllForUserId, {
				userId: anonymousUserId,
			});
			return;
		}

		const threadId = thread._id;

		const { page: messages } = await listMessages(ctx, components.agent, {
			paginationOpts: {
				cursor: null,
				numItems: 1,
			},
			threadId,
		});

		const lastMessage = messages[0];

		const now = Date.now();
		const createdAt = lastMessage?._creationTime;
		const wasChattingRecently = createdAt && createdAt > now - MINUTE * 5;

		if (wasChattingRecently) {
			await chatAgent.updateThreadMetadata(ctx, {
				patch: { userId: newUserId },
				threadId,
			});

			const drafts = await ctx.db
				.query("drafts")
				.withIndex("by_thread", (q) => q.eq("threadId", threadId))
				.collect();

			for (const { _id: draftId } of drafts) {
				await ctx.db.patch(draftId, {
					userId: newUserId,
				});
			}
		}

		await ctx.runMutation(internal.users.deleteAllForUserId, {
			userId: anonymousUserId,
		});

		await rateLimiter.reset(ctx, "anonymous", {
			key: anonymousUserId,
		});
	},
	returns: v.null(),
});

export const archiveChats = mutation({
	args: {
		threadIds: v.array(v.string()),
	},
	handler: async (ctx, { threadIds }) => {
		const user = await ctx.runQuery(api.auth.getUser, {});

		if (!user) {
			throw new ChatSDKError("unauthorized:auth");
		}

		for (const threadId of threadIds) {
			await ctx.runMutation(components.agent.threads.updateThread, {
				patch: { status: "archived" },
				threadId,
			});
		}
	},
	returns: v.null(),
});
