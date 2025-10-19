import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const tier = v.union(
	v.literal("anonymous"),
	v.literal("free"),
	v.literal("pro"),
);

export const platform = v.union(
	v.literal("mastodon"),
	v.literal("linkedin"),
	v.literal("bluesky"),
	v.literal("threads"),
	v.literal("x"),
);

export const versions = v.object({
	bluesky: v.optional(v.string()),
	linkedin: v.optional(v.string()),
	mastodon: v.optional(v.string()),
	threads: v.optional(v.string()),
	x: v.optional(v.string()),
});

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
