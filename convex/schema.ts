import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const platform = v.union(
	v.literal("bluesky"),
	v.literal("threads"),
	v.literal("x"),
);

export default defineSchema({
	drafts: defineTable({
		title: v.string(),
		userId: v.id("users"),
	}).index("by_user", ["userId"]),
	draftsVersions: defineTable({
		content: v.string(),
		draftId: v.id("drafts"),
		platform,
	}).index("by_version_platform", ["draftId", "platform"]),
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
});
