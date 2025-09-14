import { google } from "@ai-sdk/google";
import type { InferUITools, ToolSet, UIDataTypes, UIMessage } from "ai";
import { tool } from "ai";
import { fetchMutation } from "convex/nextjs";
import { Effect } from "effect";
import { api } from "../convex/_generated/api";
import { draftSchema, postSchema } from "../lib/schema";
import type { Platform } from "../lib/types";

export const tools = {
	create_draft: tool({
		description: `Create a new draft to work on. Versions should be platform-specific. You're able to publish the draft later. This will create a new draft with the title and versions. This will create a carousel of posts, which helps the user preview the post on different platforms. Each version is editable. This tool is used to create drafts, not publish posts.`,
		execute: async ({ title, versions }) =>
			Effect.runPromise(
				Effect.gen(function* () {
					const draftId = yield* Effect.promise(async () => {
						return await fetchMutation(api.drafts.createDraft, {
							title,
							versions,
						});
					});
					return draftId;
				}),
			),
		inputSchema: draftSchema,
	}),
	create_post_intent: tool({
		description:
			"Publish a draft to a platform. This will generate a URL the user can click to open a new tab with the post intent, as a final confirmation. This tool is used to publish drafts, not create drafts. This tool should be used once the user's intent to publish is confirmed.",
		execute: async ({ content, platform }) =>
			Effect.runPromise(
				Effect.gen(function* () {
					function* parse(content: string) {
						const hashtags = yield* Effect.sync(
							() => content.match(/#\w+/g)?.map((tag) => tag.slice(1)) || [],
						);

						const urls = yield* Effect.sync(
							() => content.match(/https?:\/\/[^\s]+/g) || [],
						);

						const via = yield* Effect.sync(() => {
							const matcher = content.match(/@(\w+)/);
							return matcher ? matcher[1] : null;
						});

						let text = yield* Effect.sync(() =>
							content
								.replace(/#\w+/g, "")
								.replace(/https?:\/\/[^\s]+/g, "")
								.replace(/@\w+/g, "")
								.replace(/\s+/g, " ")
								.trim(),
						);

						return yield* Effect.sync(() => {
							if (hashtags.length > 0) {
								text += hashtags.map((tag) => `#${tag}`).join(" ");
							}
							if (urls.length > 0) {
								text += `\n${urls[0]}`;
							}
							if (via) {
								text += `\n@${via}`;
							}
							return text;
						});
					}

					const text = yield* parse(content);

					const params = yield* Effect.sync(() => {
						const params = new URLSearchParams();
						params.append("text", text);
						return params;
					});

					const baseUrl = yield* Effect.sync(() => {
						const baseUrls: Record<Platform, string> = {
							bluesky: "https://bsky.app/intent/compose",
							linkedin: "https://www.linkedin.com/feed/?shareActive&mini=true",
							threads: "https://www.threads.net/intent/post",
							x: "https://x.com/intent/post",
						};
						return baseUrls[platform];
					});

					return yield* Effect.sync(() => `${baseUrl}?${params.toString()}`);
				}),
			),
		inputSchema: postSchema,
	}),
	web_search: google.tools.googleSearch({}),
} satisfies ToolSet;

export type ChatTools = InferUITools<typeof tools>;

export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;
