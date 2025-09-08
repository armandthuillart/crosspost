import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalMutation, mutation } from "../_generated/server";

export const deleteMessagesAtOrAfterMessage = mutation({
	args: {
		batchSize: v.optional(v.number()),
		messageId: v.id("messages"),
	},
	handler: async (ctx, { messageId, batchSize }) => {
		const anchor = await ctx.db.get(messageId);
		if (!anchor) {
			throw new Error(`Message with id ${messageId} not found.`);
		}
		// Kick off the batched worker starting from the first page.
		await ctx.scheduler.runAfter(
			0,
			internal.chat.mutations.deleteMessagesByChatAfterTimestampBatch,
			{
				chatId: anchor.chatId,
				cursor: null,
				numItems: batchSize ?? 500,
				timestamp: anchor.createdAt,
			},
		);
	},
});

export const deleteMessagesByChatAfterTimestampBatch = internalMutation({
	args: {
		chatId: v.id("chats"),
		cursor: v.union(v.string(), v.null()),
		numItems: v.number(),
		timestamp: v.number(),
	},
	handler: async (ctx, { chatId, timestamp, cursor, numItems }) => {
		// Page through messages at/after timestamp using the index (chatId, createdAt)
		const page = await ctx.db
			.query("messages")
			.withIndex("by_chat_created_at", (q) =>
				q.eq("chatId", chatId).gte("createdAt", timestamp),
			)
			.paginate({ cursor, numItems });

		// Delete this page
		await Promise.all(page.page.map((doc) => ctx.db.delete(doc._id)));

		// Continue if more remain
		if (!page.isDone) {
			await ctx.scheduler.runAfter(
				0,
				internal.chat.mutations.deleteMessagesByChatAfterTimestampBatch,
				{
					chatId,
					cursor: page.continueCursor,
					numItems,
					timestamp,
				},
			);
		}
	},
});
