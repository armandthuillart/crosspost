import type { Infer } from "convex/values";
import { zodToConvex } from "convex-helpers/server/zod";
import { ChatSDKError } from "../lib/errors";
import { draftSchema } from "../lib/schema";
import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";
import type { platform } from "./schema";

export const createDraft = mutation({
	args: zodToConvex(draftSchema),
	handler: async (ctx, { title, versions }) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new ChatSDKError("unauthorized:draft");
		}

		const draftId = await ctx.db.insert("drafts", {
			title,
			userId: identity.subject as Id<"users">,
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
