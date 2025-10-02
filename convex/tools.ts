import { createTool } from "@convex-dev/agent";
import { z } from "zod/v3";
import { chatAgent } from "~/convex/agents";
import { api, internal } from "~/convex/generated/api";
import type { Id } from "~/convex/generated/dataModel";
import { draftSchema, postSchema } from "~/lib/schema";
import type { Platform } from "~/lib/types";

export const getDraft = createTool({
	args: draftSchema,
	description:
		"Create a new post draft. It will return the draft id if successful.",
	handler: async (
		{ threadId, runMutation },
		{ title, versions },
	): Promise<Id<"drafts">> => {
		if (!threadId) {
			throw new Error("Thread ID is required");
		}

		return await runMutation(api.drafts.createDraft, {
			threadId,
			title,
			versions,
		});
	},
});

// For the URL generation, a simple function is enough, based on a button click. For the post creation, a simple mutation is enough.
export const post = createTool({
	args: postSchema,
	description:
		"Create a post intent for the given content. It will return the post intent url if successful.",
	handler: async (ctx, { title, content, platform }): Promise<string> => {
		function parse(content: string): string {
			const hashtags = content.match(/#\w+/g)?.map((tag) => tag.slice(1)) || [];
			const urls = content.match(/https?:\/\/[^\s]+/g) || [];
			const via = content.match(/@(\w+)/)?.[1] || null;

			let text = content
				.replace(/#\w+/g, "")
				.replace(/https?:\/\/[^\s]+/g, "")
				.replace(/@\w+/g, "")
				.replace(/\s+/g, " ")
				.trim();

			if (hashtags.length > 0) {
				text += ` ${hashtags.map((tag) => `#${tag}`).join(" ")}`;
			}
			if (urls.length > 0) {
				text += `\n${urls[0]}`;
			}
			if (via) {
				text += `\n@${via}`;
			}
			return text;
		}

		const params = new URLSearchParams();
		params.append("text", parse(content));

		const baseUrls: Record<Platform, string> = {
			bluesky: "https://bsky.app/intent/compose",
			linkedin: "https://www.linkedin.com/feed/?shareActive&mini=true",
			threads: "https://www.threads.net/intent/post",
			x: "https://x.com/intent/post",
		};

		const baseUrl = baseUrls[platform];

		await ctx.scheduler.runAfter(0, internal.posts.createPost, {
			content,
			platform,
			title,
		});

		return `${baseUrl}?${params.toString()}`;
	},
});

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
