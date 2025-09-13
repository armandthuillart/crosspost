import type { Infer } from "convex/values";
import { zodToConvex } from "convex-helpers/server/zod";
import { ChatSDKError } from "../lib/errors";
import { draftSchema } from "../lib/schema";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";
import type { Id as BetterAuthId } from "./betterAuth/_generated/dataModel";
import type { platform } from "./schema";

export const createDraft = mutation({
	args: zodToConvex(draftSchema),
	handler: async (ctx, { title, versions }): Promise<Id<"drafts">> => {
		const user = await ctx.runQuery(api.auth.getUser);

		if (!user?.userId) {
			throw new ChatSDKError("unauthorized:draft");
		}

		const draftId = await ctx.db.insert("drafts", {
			title,
			userId: user.userId as BetterAuthId<"user">,
		});

		for (const [key, content] of Object.entries(versions)) {
			await ctx.db.insert("versions", {
				content,
				draftId,
				platform: key as Infer<typeof platform>,
			});
		}

		return draftId;
	},
});
