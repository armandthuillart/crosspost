import { v } from "convex/values";
import { zodToConvex } from "convex-helpers/server/zod";
import { api } from "~/convex/generated/api";
import type { Id } from "~/convex/generated/dataModel";
import { mutation } from "~/convex/generated/server";
import { ChatSDKError } from "~/lib/errors";
import { draftSchema } from "~/lib/schema";
import type { Platform } from "~/lib/types";

export const createDraft = mutation({
	args: v.object({
		threadId: v.string(),
		title: v.string(),
		versions: zodToConvex(draftSchema.shape.versions),
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
