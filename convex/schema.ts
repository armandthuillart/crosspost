import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const platform = v.union(
	v.literal("linkedin"),
	v.literal("bluesky"),
	v.literal("threads"),
	v.literal("x"),
);

export const role = v.union(
	v.literal("assistant"),
	v.literal("system"),
	v.literal("user"),
);

export default defineSchema({
	chats: defineTable({
		optimisticId: v.string(),
		title: v.string(),
		userId: v.string(),
	})
		.index("by_user", ["userId"])
		.index("by_optimistic_id", ["optimisticId"]),
	drafts: defineTable({
		title: v.string(),
		userId: v.string(),
	}).index("by_user", ["userId"]),
	messages: defineTable({
		chatId: v.id("chats"),
		parts: v.any(),
		role,
	}).index("by_chat", ["chatId"]),
	posts: defineTable({
		content: v.string(),
		platform,
		title: v.string(),
		url: v.optional(v.string()),
		userId: v.string(),
	}).index("by_user", ["userId"]),
	versions: defineTable({
		content: v.string(),
		draftId: v.id("drafts"),
		platform,
		updatedAt: v.optional(v.number()),
	}).index("by_draft_platform", ["draftId", "platform"]),
});
