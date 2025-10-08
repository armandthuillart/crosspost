import { v } from "convex/values";
import type { Platform } from "../lib/types";
import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

export const createDraft = mutation({
	args: v.object({
		threadId: v.string(),
		title: v.string(),
		userId: v.string(),
		versions: v.object({
			bluesky: v.optional(v.string()),
			linkedin: v.optional(v.string()),
			threads: v.optional(v.string()),
			x: v.optional(v.string()),
		}),
	}),
	handler: async (
		ctx,
		{ title, threadId, versions, userId },
	): Promise<Id<"drafts">> => {
		const draftId = await ctx.db.insert("drafts", {
			threadId,
			title,
			userId,
		});

		// Is there a way to have it type safe either anonymous, free or pro?
		for (const [platformName, content] of Object.entries(versions)) {
			await ctx.db.insert("versions", {
				content,
				draftId,
				platform: platformName as Platform,
			});
		}

		return draftId;
	},
	returns: v.id("drafts"),
});
