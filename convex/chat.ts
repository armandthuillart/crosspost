import { getThreadMetadata } from "@convex-dev/agent";
import { getToken } from "@convex-dev/better-auth/nextjs";
import { checkBotId } from "botid/server";
import { fetchAction, fetchQuery } from "convex/nextjs";
import { v } from "convex/values";
import { createAuth } from "../lib/auth";
import { ChatSDKError } from "../lib/errors";
import type { Tier } from "../lib/types";
import { api, components, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
	type ActionCtx,
	internalAction,
	type MutationCtx,
	mutation,
	type QueryCtx,
} from "./_generated/server";
import { agent } from "./agent";
import { betterAuthComponent } from "./auth";
import { rateLimiter } from "./rateLimiting";

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
		const { userId, userTier } = await authorize(ctx, threadId);

		await rateLimiter.limit(ctx, userTier, { key: userId, throws: true });

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
			{ saveStreamDeltas: { chunking: "word", throttleMs: 100 } },
		);

		await result.consumeStream();
	},
});

// This is a Next.js Server Action (fluid compute), that does:
// 1. Get the user's token by creating an auth client (betterAuth adapter)
// 2. Get user metadata (betterAuth user) + convex user fields merged into one object
// 3. Some guards for userId, threadId, and user.isAnonymous
// 4. Ensure the current user id matches the thread's user id (ownership check)
// 5. Get the user's tier to be able to rate limit the user based on their tier
// 6. Return the userId and userTier for a lot of convex functions that need them.
export async function authorize(
	ctx: QueryCtx | MutationCtx | ActionCtx,
	threadId: string,
) {
	const { isBot } = await checkBotId();

	if (isBot) {
		throw new ChatSDKError("forbidden:chat", "Bots can't chat");
	}

	const token = await getToken(createAuth);
	const user = await fetchQuery(api.auth.getUser, {}, { token });
	const isAnonymous = user?.isAnonymous;

	if (!user) {
		throw new ChatSDKError("unauthorized:chat");
	}

	const { userId } = await getThreadMetadata(ctx, components.agent, {
		threadId,
	});

	if (user.userId !== userId) {
		throw new ChatSDKError("forbidden:chat");
	}

	let userTier: Tier = "anonymous";

	if (!isAnonymous) {
		userTier = await fetchAction(
			api.customers.getTier,
			{ userId: userId as Id<"users"> },
			{ token },
		);
	}

	return { userId, userTier };
}
