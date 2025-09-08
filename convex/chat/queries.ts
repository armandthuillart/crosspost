import { v } from "convex/values";
import { ChatSDKError } from "../../lib/errors";
import { query } from "../_generated/server";
import { betterAuthComponent } from "../auth";

export const getChat = query({
	args: {
		chatId: v.id("chats"),
	},
	handler: async (ctx, { chatId }) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new ChatSDKError("unauthorized:chat").toResponse();
		}
		const userId = await betterAuthComponent.getAuthUserId(ctx);

		if (!userId) {
			throw new ChatSDKError("unauthorized:chat").toResponse();
		}

		const chat = await ctx.db.get(chatId);

		if (!chat) {
			throw new ChatSDKError("not_found:chat").toResponse();
		}

		if (chat.userId !== userId) {
			throw new ChatSDKError("forbidden:chat").toResponse();
		}

		return chat;
	},
});

export const getMessages = query({
	args: {
		chatId: v.id("chats"),
	},
	handler: async (ctx, { chatId }) => {
		const userId = await betterAuthComponent.getAuthUserId(ctx);

		if (!userId) {
			throw new ChatSDKError(
				"unauthorized:chat",
				"Please sign in to continue.",
			).toResponse();
		}

		const chat = await ctx.db.get(chatId);

		if (!chat) {
			throw new ChatSDKError(
				"not_found:chat",
				"Chat has been deleted or never existed.",
			).toResponse();
		}

		if (chat.userId !== userId) {
			throw new ChatSDKError(
				"forbidden:chat",
				"You do not have access to this chat.",
			).toResponse();
		}

		const messages = await ctx.db
			.query("messages")
			.withIndex("by_chat_created_at", (q) => q.eq("chatId", chatId))
			.order("desc")
			.take(100);

		return messages;
	},
});
