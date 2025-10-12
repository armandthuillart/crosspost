import { v } from "convex/values";
import { ChatSDKError } from "../lib/errors";
import type { Platform } from "../lib/types";
import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";
import { platform } from "./schema";

export const createDraft = mutation({
	args: v.object({
		threadId: v.string(),
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
		{ threadId, versions, userId },
	): Promise<Id<"drafts">> => {
		const draftId = await ctx.db.insert("drafts", {
			threadId,
			userId,
		});

		// TODO: Rewrite so it's type safe either anonymous, free or pro. Not string.
		for (const [name, content] of Object.entries(versions)) {
			await ctx.db.insert("versions", {
				content,
				draftId,
				platform: name as Platform,
			});
		}

		return draftId;
	},
	returns: v.id("drafts"),
});

export const updateDraft = mutation({
	args: {
		content: v.string(),
		draftId: v.id("drafts"),
		platform,
	},
	handler: async (ctx, { content, draftId, platform }) => {
		const version = await ctx.db
			.query("versions")
			.withIndex("by_draft_platform", (q) =>
				q.eq("draftId", draftId).eq("platform", platform),
			)
			.unique();

		if (!version) {
			throw new ChatSDKError("not_found:draft");
		}

		const versionId = version._id;
		await ctx.db.patch(versionId, { content });
	},
	returns: v.null(),
});
