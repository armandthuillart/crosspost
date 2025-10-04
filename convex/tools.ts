import { createTool } from "@convex-dev/agent";
import { z } from "zod/v3";
import { chatAgent } from "~/convex/agents";
import { api } from "~/convex/generated/api";
import type { Id } from "~/convex/generated/dataModel";
import { ChatSDKError } from "~/lib/errors";
import { draftSchema } from "~/lib/schema";

export const getDraft = createTool({
	args: draftSchema,
	description:
		"Create a new post draft. It will return the draft id if successful.",
	handler: async (
		{ threadId, runMutation, userId },
		{ title, versions },
	): Promise<Id<"drafts">> => {
		if (!threadId) {
			throw new ChatSDKError("bad_request:draft");
		}

		if (!userId) {
			throw new ChatSDKError("unauthorized:auth");
		}

		return await runMutation(api.drafts.createDraft, {
			threadId,
			title,
			userId,
			versions,
		});
	},
});

// await ctx.scheduler.runAfter(0, internal.posts.createPost, {
// 	content,
// 	platform,
// 	title,
// });

export const renameChat = createTool({
	args: z.object({
		title: z
			.string()
			.max(6, "Must be under 6 words")
			.describe("The new title of the chat"),
	}),
	description:
		"Rename the current chat when the topic changes. It will return the new chat title if successful.",
	handler: async (ctx, { title }): Promise<string> => {
		const { threadId } = ctx;

		if (!threadId) {
			throw new Error("No threadId in context");
		}

		await chatAgent.updateThreadMetadata(ctx, {
			patch: { title },
			threadId,
		});

		return `Chat renamed to "${title}"`;
	},
});
