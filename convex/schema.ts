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
		title: v.string(),
		userId: v.id("users"),
	}).index("by_user", ["userId"]),
	drafts: defineTable({
		title: v.string(),
		userId: v.id("users"),
	}).index("by_user", ["userId"]),
	messages: defineTable({
		chatId: v.id("chats"),
		parts: v.any(),
		role,
	}).index("by_chat_created_at", ["chatId", "_creationTime"]),
	posts: defineTable({
		content: v.string(),
		platform,
		title: v.string(),
		url: v.optional(v.string()),
		userId: v.id("users"),
	}).index("by_user", ["userId"]),
	users: defineTable({
		isAnonymous: v.optional(v.boolean()),
	}).index("by_is_anonymous", ["isAnonymous"]),
	versions: defineTable({
		content: v.string(),
		createdAt: v.number(),
		draftId: v.id("drafts"),
		platform,
		updatedAt: v.number(),
	}).index("by_draft_platform", ["draftId", "platform"]),
});
