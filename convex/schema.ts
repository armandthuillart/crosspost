import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const tier = v.union(
	v.literal("anonymous"),
	v.literal("free"),
	v.literal("pro"),
);

export const platform = v.union(
	v.literal("threads"),
	v.literal("linkedin"),
	v.literal("bluesky"),
	v.literal("x"),
);

export const locale = v.union(v.literal("en"), v.literal("fr"));

export default defineSchema({
	drafts: defineTable({
		threadId: v.string(),
		userId: v.string(),
	})
		.index("by_user", ["userId"])
		.index("by_thread", ["threadId"]),
	posts: defineTable({
		content: v.string(),
		platform,
	}),
	versions: defineTable({
		content: v.string(),
		draftId: v.id("drafts"),
		platform,
		updatedAt: v.optional(v.number()),
	})
		.index("by_draft", ["draftId"])
		.index("by_draft_platform", ["draftId", "platform"]),
});
