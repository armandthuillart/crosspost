import { generateText } from "ai";
import { v } from "convex/values";
import { zodToConvex } from "convex-helpers/server/zod";
import { z } from "zod/v3";
import { ChatSDKError } from "../lib/errors";
import { TITLE_MODEL } from "../lib/gateway";
import { messageSchema } from "../lib/schema";
import type { Tier } from "../lib/types";
import { api, internal } from "./_generated/api";
import {
	internalAction,
	internalMutation,
	internalQuery,
	mutation,
	query,
} from "./_generated/server";
import type { Id } from "./betterAuth/_generated/dataModel";

export const createChat = mutation({
	args: { optimisticId: v.string(), prompt: v.string() },
	handler: async (ctx, { optimisticId, prompt }) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new ChatSDKError("unauthorized:chat");
		}

		const userId = identity.subject as Id<"user">;

		const chatId = await ctx.db.insert("chats", {
			optimisticId,
			title: "New Chat",
			userId,
		});

		await ctx.scheduler.runAfter(0, internal.chat.nameChat, {
			chatId,
			prompt,
			userId,
		});

		return chatId;
	},
});

export const saveChat = mutation({
	args: {
		chatId: v.id("chats"),
		messages: zodToConvex(z.array(messageSchema)),
	},
	handler: async (ctx, { chatId, messages }) => {
		for (const message of messages) {
			await ctx.db.insert("messages", {
				chatId,
				parts: message.parts,
				role: message.role,
			});
		}
	},
});

export const nameChat = internalAction({
	args: {
		chatId: v.id("chats"),
		prompt: v.string(),
		userId: v.string(),
	},
	handler: async (ctx, { chatId, prompt, userId }) => {
		const { text: title } = await generateText({
			messages: [{ content: prompt, role: "user" }],
			model: TITLE_MODEL,
			system: `Generate a title that are 3-6 words, descriptive, sentence case, sound like something a person would actually say that is relevant to the first message in the thread.
        
			Good examples: 
			- Monday motivation hits
			- Morning coffee ritual
			- Casual greetings
			- New AI SDK 5`,
		});

		await ctx.runMutation(internal.chat.renameChat, {
			chatId,
			title,
			userId,
		});

		return title;
	},
});

export const renameChat = internalMutation({
	args: {
		chatId: v.id("chats"),
		title: v.string(),
		userId: v.string(),
	},
	handler: async (ctx, { chatId, title, userId }) => {
		const chat = await ctx.db.get(chatId);

		if (!chat || chat.userId !== userId) {
			throw new ChatSDKError("forbidden:chat");
		}

		await ctx.db.patch(chatId, { title });

		return title;
	},
});

export const deleteChat = mutation({
	args: { chatId: v.id("chats") },
	handler: async (ctx, { chatId }) => {},
});

export const deleteChats = mutation({
	args: { chatIds: v.array(v.id("chats")) },
	handler: async (ctx, { chatIds }) => {},
});

export const abortStream = mutation({
	args: { chatId: v.id("chats") },
	handler: async (ctx, { chatId }) => {},
});

export const getChat = query({
	args: { optimisticId: v.string() },
	handler: async (ctx, { optimisticId }) => {
		const { userId } = await ctx.runQuery(internal.chat.authorizeChat);

		const chat = await ctx.db
			.query("chats")
			.withIndex("by_optimistic_id", (q) => q.eq("optimisticId", optimisticId))
			.unique();

		if (!chat) {
			return null;
		}

		if (chat.userId !== userId) {
			throw new ChatSDKError("forbidden:chat");
		}

		return chat;
	},
});

export const listChats = query({
	args: { userId: v.id("user") },
	handler: async (ctx, { userId }) => {},
});

export const loadChat = query({
	args: { chatId: v.id("chats") },
	handler: async (ctx, { chatId }) => {
		const messages = await ctx.db
			.query("messages")
			.withIndex("by_chat", (q) => q.eq("chatId", chatId))
			.order("desc")
			.take(10);

		if (!messages) {
			throw new ChatSDKError("not_found:chat");
		}

		return messages.reverse();
	},
});

export const deleteMessages = mutation({
	args: { chatId: v.id("chats"), startOrder: v.number() },
	handler: async (ctx, { chatId, startOrder }) => {},
});

export const deleteChatsByUserId = internalMutation({
	args: { userId: v.id("user") },
	handler: async (ctx, { userId }) => {},
});

export const authorizeChat = internalQuery({
	args: {},
	handler: async (ctx): Promise<{ userId: Id<"user">; userTier: Tier }> => {
		const user = await ctx.runQuery(api.auth.getUser);
		const userId = user?._id;
		const isAnonymous = user?.isAnonymous ?? false;

		if (!userId) {
			throw new ChatSDKError("unauthorized:chat");
		}

		let userTier: Tier = "anonymous";

		if (!isAnonymous) {
			userTier = await ctx.runQuery(api.customers.getTier, { userId });
		}

		return { userId, userTier };
	},
});
