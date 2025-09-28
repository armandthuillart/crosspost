import { v } from "convex/values";
import { ChatSDKError } from "../lib/errors";
import type { Platform } from "../lib/types";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

export const createDraft = mutation({
	args: v.object({
		threadId: v.string(),
		title: v.string(),
		versions: v.object({
			bluesky: v.optional(v.string()),
			threads: v.optional(v.string()),
			x: v.optional(v.string()),
		}),
	}),
	handler: async (
		ctx,
		{ title, threadId, versions },
	): Promise<Id<"drafts">> => {
		const user = await ctx.runQuery(api.auth.getUser, {});

		if (!user) {
			throw new ChatSDKError("unauthorized:auth");
		}

		const draftId = await ctx.db.insert("drafts", {
			threadId,
			title,
			userId: user.id,
		});

		// Is there a way to have it type safe either anonymous, free or pro?
		for (const [P, content] of Object.entries(versions)) {
			await ctx.db.insert("versions", {
				content,
				draftId,
				platform: P as Platform,
			});
		}

		return draftId;
	},
	returns: v.id("drafts"),
});
