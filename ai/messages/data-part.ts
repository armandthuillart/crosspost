import { convexToZod } from "convex-helpers/server/zod";
import { z } from "zod/v3";
import { platform } from "@/convex/schema";

export const dataPartSchema = z.object({
	createDraft: z.object({
		title: z.string().describe("The draft title."),
		versions: z
			.object({
				bluesky: z.object({ content: z.string() }).optional(),
				threads: z.object({ content: z.string() }).optional(),
				x: z.object({ content: z.string() }).optional(),
			})
			.refine(
				(data) => Object.values(data).some((content) => content !== undefined),
				"At least one platform must be provided.",
			)
			.describe(
				"Platform-specific versions of the draft. At least one platform must be provided.",
			),
	}),
	getSocials: z.object({
		providers: z
			.array(convexToZod(platform))
			.describe("Social providers to get the user's social accounts for."),
	}),
	publishPost: z.object({
		accountIds: z
			.array(z.string())
			.describe("Account(s) identifiers to publish the post to."),
		content: z.string().describe("The post content."),
		provider: convexToZod(platform).describe(
			"Provider to publish the post on.",
		),
	}),
	selectSocials: z.object({
		socials: z
			.array(convexToZod(platform))
			.describe("Social accounts the user can post to."),
	}),
	updateDraft: z.object({
		id: z.string().describe("The draft identifier to update."),
		title: z.string().optional().describe("The updated title for the draft."),
		versions: z
			.record(
				convexToZod(platform),
				z.object({
					content: z
						.string()
						.describe("The updated content for this platform."),
				}),
			)
			.optional()
			.describe("Platform-specific versions to update in the draft. "),
	}),
});

export type DataPart = z.infer<typeof dataPartSchema>;
