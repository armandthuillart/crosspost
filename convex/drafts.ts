import { type Infer, v } from "convex/values";
import { zodToConvex } from "convex-helpers/server/zod";
import { z } from "zod/v3";
import { draftSchema } from "../lib/schema";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";
import type { platform } from "./schema";

export const createDraft = mutation({
	args: zodToConvex(draftSchema.extend({ threadId: z.string() })),
	handler: async (
		ctx,
		{ title, threadId, versions },
	): Promise<Id<"drafts">> => {
		const user = await ctx.runQuery(api.auth.getUser, {});

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
				platform: P as Infer<typeof platform>,
			});
		}

		return draftId;
	},
	returns: v.id("drafts"),
});
