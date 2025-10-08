import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { zodToConvex } from "convex-helpers/server/zod";
import { platformSchema } from "../lib/schema";

export default defineSchema({
	drafts: defineTable({
		threadId: v.string(),
		title: v.string(),
		userId: v.string(),
	})
		.index("by_user", ["userId"])
		.index("by_thread", ["threadId"]),
	posts: defineTable({
		content: v.string(),
		platform: zodToConvex(platformSchema),
		title: v.string(),
	}),
	versions: defineTable({
		content: v.string(),
		draftId: v.id("drafts"),
		platform: zodToConvex(platformSchema),
		updatedAt: v.optional(v.number()),
	})
		.index("by_draft", ["draftId"])
		.index("by_draft_platform", ["draftId", "platform"]),
});
