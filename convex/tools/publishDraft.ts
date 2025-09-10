import { createTool } from "@convex-dev/agent";
import { convexToZod } from "convex-helpers/server/zod";
import { z } from "zod/v3";
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
	handler: async () => {},
});
