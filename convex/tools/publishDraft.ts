import { createTool } from "@convex-dev/agent";
import { convexToZod } from "convex-helpers/server/zod";
import { Effect } from "effect";
import { z } from "zod/v3";
import type { Platform } from "../../lib/types";
import { platform } from "../schema";

export const zodSchema = z
	.object({
		content: z.string().describe("The content of the post"),
		platform: convexToZod(platform).describe("Platform to publish the post to"),
	})
	.refine(
		({ content, platform }) => {
			switch (platform) {
				case "threads":
					return content.length <= 10000;
				case "bluesky":
					return content.length <= 300;
				case "x":
					return content.length <= 280;
			}
		},
		({ platform }) => {
			switch (platform) {
				case "threads":
					return { message: "Must be under 10000 characters" };
				case "bluesky":
					return { message: "Must be under 300 characters" };
				case "x":
					return { message: "Must be under 280 characters" };
			}
		},
	);

export const publishDraft = createTool({
	args: zodSchema,
	description: `Publish a draft to a platform. This will generate a URL the user can click to open a new tab with the post intent, as a final confirmation. This tool is used to publish drafts, not create drafts. This tool should be used once the user's intent to publish is confirmed.`,
	handler: async (_, { content, platform }) =>
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
					const baseUrls: Record<Platform, URL> = {
						bluesky: new URL("https://bsky.app/intent/compose"),
						threads: new URL("https://www.threads.net/intent/post"),
						x: new URL("https://x.com/intent/post"),
					};
					return baseUrls[platform];
				});

				return yield* Effect.sync(
					() => `${baseUrl.toString()}?${params.toString()}`,
				);
			}),
		),
});
