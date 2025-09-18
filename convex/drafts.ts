import type { Infer } from "convex/values";
import { zodToConvex } from "convex-helpers/server/zod";
import { draftSchema } from "../lib/schema";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";
import type { platform } from "./schema";

export const createDraft = mutation({
	args: zodToConvex(draftSchema),
	handler: async (ctx, { title, versions }): Promise<Id<"drafts">> => {
		const { userId } = await ctx.runQuery(api.auth.getUser, {});

		const draftId = await ctx.db.insert("drafts", {
			title,
			userId,
		});

		for (const [P, content] of Object.entries(versions)) {
			await ctx.db.insert("versions", {
				content,
				draftId,
				platform: P as Infer<typeof platform>,
			});
		}

		return draftId;
	},
});
