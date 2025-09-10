import { createTool } from "@convex-dev/agent";
import { Effect } from "effect";
import { z } from "zod/v3";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { ChatSDKError } from "../../lib/errors";

export const zodSchema = z.object({
	title: z.string().describe("The title of the draft"),
	versions: z
		.object({
			bluesky: z
				.string()
				.max(300, { message: "Must be under 300 characters" })
				.optional(),
			threads: z
				.string()
				.max(10000, { message: "Must be under 10000 characters" })
				.optional(),
			x: z
				.string()
				.max(280, { message: "Must be under 280 characters" })
				.optional(),
		})
		.refine(
			(version) =>
				Object.values(version).some((content) => content !== undefined),
			"Must have at least one version",
		)
		.describe("Platform-specific versions of the draft"),
});

export const createDraft = createTool({
	args: zodSchema,
	description: `Create a new draft to work on. Versions should be platform-specific. You're able to publish the draft later. This will create a new draft with the title and versions. This will create a carousel of posts, which helps the user preview the post on different platforms. Each version is editable. This tool is used to create drafts, not publish posts.`,
	handler: async (ctx, { title, versions }) =>
		Effect.runPromise(
			Effect.tryPromise({
				catch: () => new ChatSDKError("bad_request:draft").toResponse(),
				try: (): Promise<Id<"drafts">> =>
					ctx.runMutation(api.drafts.createDraft, { title, versions }),
			}),
		),
});
