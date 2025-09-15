import { createTool } from "@convex-dev/agent";
import { Effect } from "effect";
import { draftSchema, postSchema } from "../lib/schema";
import type { Platform } from "../lib/types";
import { api, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

export const createDraft = createTool({
	args: draftSchema,
	description: "Create a new draft of a post",
	handler: async (ctx, { title, versions }): Promise<Id<"drafts">> =>
		Effect.runPromise(
			Effect.gen(function* () {
				const draftId = yield* Effect.promise(async () => {
					return await ctx.runMutation(api.drafts.createDraft, {
						title,
						versions,
					});
				});

				return draftId;
			}),
		),
});

export const createPostIntent = createTool({
	args: postSchema,
	handler: async (ctx, { title, content, platform }): Promise<string> =>
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

				yield* Effect.promise(async () => {
					await ctx.scheduler.runAfter(0, internal.posts.createPost, {
						content,
						platform,
						title,
					});
				});

				return yield* Effect.sync(() => `${baseUrl}?${params.toString()}`);
			}),
		),
});
