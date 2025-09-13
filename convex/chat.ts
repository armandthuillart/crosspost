import type { GatewayModelId } from "@ai-sdk/gateway";
import { generateText } from "ai";
import { v } from "convex/values";
import { ChatSDKError } from "../lib/errors";
import type { Tier } from "../lib/types";
import { api, internal } from "./_generated/api";
import {
	internalMutation,
	internalQuery,
	mutation,
	query,
} from "./_generated/server";
import type { Id } from "./betterAuth/_generated/dataModel";

export const createChat = mutation({
	args: { prompt: v.string() },
	handler: async (ctx, { prompt }) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new ChatSDKError("unauthorized:chat");
		}

		const chatId = await ctx.db.insert("chats", {
			title: "b New Chat",
			userId: identity.subject as Id<"user">,
		});

		await ctx.scheduler.runAfter(0, internal.chat.renameChat, {
			chatId,
			prompt,
		});
	},
});

export const renameChat = internalMutation({
	args: { chatId: v.id("chats"), prompt: v.string() },
	handler: async (ctx, { chatId, prompt }) => {
		const { userId } = await ctx.runQuery(internal.chat.authorize);

		const chat = await ctx.db.get(chatId);

		if (!chat) {
			throw new ChatSDKError("not_found:chat");
		}

		if (chat.userId !== userId) {
			throw new ChatSDKError("forbidden:chat");
		}

		const { text: title } = await generateText({
			messages: [{ content: prompt, role: "user" }],
			model: "google/gemini-2.5-flash-lite" as GatewayModelId,
			system: `Generate a title that are 3-6 words, descriptive, sentence case, sound like something a person would actually say that is relevant to the first message in the thread.
        
			Good examples: 
			- Monday motivation hits
			- Morning coffee ritual
			- Casual greetings
			- New AI SDK 5`,
		});

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
	args: { chatId: v.id("chats") },
	handler: async (ctx, { chatId }) => {
		const { userId } = await ctx.runQuery(internal.chat.authorize);

		const chat = await ctx.db.get(chatId);

		if (!chat) {
			throw new ChatSDKError("not_found:chat");
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

export const listMessages = query({
	args: { chatId: v.id("chats") },
	handler: async (ctx, { chatId }) => {},
});

export const deleteMessages = mutation({
	args: { chatId: v.id("chats"), startOrder: v.number() },
	handler: async (ctx, { chatId, startOrder }) => {},
});

export const deleteChatsByUserId = internalMutation({
	args: { userId: v.id("user") },
	handler: async (ctx, { userId }) => {},
});

export const authorize = internalQuery({
	args: {},
	handler: async (ctx): Promise<{ userId: Id<"user">; userTier: Tier }> => {
		const user = await ctx.runQuery(api.auth.getUser);

		if (!user?.userId) {
			throw new ChatSDKError("unauthorized:chat");
		}

		let userTier: Tier = "anonymous";

		if (!user.isAnonymous) {
			userTier = await ctx.runQuery(api.customers.getTier, {
				userId: user.userId as Id<"user">,
			});
		}

		return { userId: user.userId as Id<"user">, userTier };
	},
});
