import { createTool } from "@convex-dev/agent";
import { draftSchema, postSchema } from "../lib/schema";
import type { Platform } from "../lib/types";
import { api, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

export const createDraft = createTool({
	args: draftSchema,
	description: "Create a new draft of a post",
	handler: async (ctx, { title, versions }): Promise<Id<"drafts">> => {
		const draftId = await ctx.runMutation(api.drafts.createDraft, {
			title,
			versions,
		});

		return draftId;
	},
});

export const createPostIntent = createTool({
	args: postSchema,
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
