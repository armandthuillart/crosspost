import { type AnthropicProviderOptions, anthropic } from "@ai-sdk/anthropic";
import { type GatewayProviderOptions, gateway } from "@ai-sdk/gateway";
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
import type { Locale } from "next-intl";
import { ChatSDKError } from "../lib/errors";
import { CHAT_PROMPT } from "../lib/prompts";
import { api, components, internal } from "./_generated/api";
import { internalAction, mutation, query } from "./_generated/server";
import { chatAgent } from "./agents";
import { rateLimiter } from "./rateLimiting";
import { locale } from "./schema";
import { getDraft, renameChat } from "./tools";
import { verifyOwnership } from "./utils";

const CHAT_TITLE = ({ locale }: { locale: Locale }) => {
	if (locale === "en") return "New Chat";
	if (locale === "fr") return "Nouvelle discussion";
};

export const createChat = mutation({
	args: { locale },
	handler: async (ctx, { locale }): Promise<string> => {
		const user = await ctx.runQuery(api.auth.getUser, {});

		if (!user) {
			throw new ChatSDKError("unauthorized:auth");
		}

		return await createThread(ctx, components.agent, {
			title: CHAT_TITLE({ locale }),
			userId: user.id,
		});
	},
	returns: v.string(),
});

export const sendMessage = mutation({
	args: {
		city: v.optional(v.string()),
		country: v.optional(v.string()),
		locale,
		prompt: v.string(),
		region: v.optional(v.string()),
		threadId: v.string(),
	},
	handler: async (ctx, { city, locale, prompt, threadId, country, region }) => {
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
			isPro: user.tier === "pro",
			locale,
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
				model: gateway.languageModel("anthropic/claude-sonnet-4.5"),
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

export const deleteChats = mutation({
	args: {
		threadIds: v.array(v.string()),
	},
	handler: async (ctx, { threadIds }) => {
		const user = await ctx.runQuery(api.auth.getUser, {});

		if (!user) {
			throw new ChatSDKError("unauthorized:auth");
		}

		for (const threadId of threadIds) {
			await chatAgent.deleteThreadAsync(ctx, {
				threadId,
			});

			const drafts = await ctx.db
				.query("drafts")
				.withIndex("by_thread", (q) => q.eq("threadId", threadId))
				.collect();

			for (const { _id: draftId } of drafts) {
				const versions = await ctx.db
					.query("versions")
					.withIndex("by_draft", (q) => q.eq("draftId", draftId))
					.collect();

				for (const version of versions) {
					await ctx.db.delete(version._id);
				}

				await ctx.db.delete(draftId);
			}
		}
	},
	returns: v.null(),
});
