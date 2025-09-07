import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const platform = v.union(
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
		createdAt: v.number(),
		isGeneratingTitle: v.boolean(),
		title: v.string(),
		updatedAt: v.number(),
		userId: v.id("users"),
	}).index("by_user", ["userId"]),
	drafts: defineTable({
		createdAt: v.number(),
		title: v.string(),
		userId: v.id("users"),
	}).index("by_user", ["userId"]),
	messages: defineTable({
		chatId: v.id("chats"),
		createdAt: v.number(),
		parts: v.any(),
		role,
	}).index("by_chat_created_at", ["chatId", "createdAt"]),
	posts: defineTable({
		content: v.string(),
		createdAt: v.number(),
		platform,
		title: v.string(),
		url: v.optional(v.string()),
		userId: v.id("users"),
	})
		.index("by_user", ["userId"])
		.index("by_user_created_at", ["userId", "createdAt"]),
	users: defineTable({
		// ...
	}),
	versions: defineTable({
		content: v.string(),
		createdAt: v.number(),
		draftId: v.id("drafts"),
		platform,
		updatedAt: v.number(),
	}).index("by_version_platform", ["draftId", "platform"]),
});
