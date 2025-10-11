import { z } from "zod";
import type { Platform } from "../lib/types";

export const tierSchema = z.enum(["anonymous", "free", "pro"]);

export const platformSchema = z.enum(["threads", "linkedin", "bluesky", "x"]);

export const draftSchema = z.object({
	versions: z
		.object({
			bluesky: z
				.string()
				.max(300, { message: "Must be under 300 characters" })
				.optional(),
			linkedin: z
				.string()
				.max(3000, { message: "Must be under 3000 characters" })
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

export const postSchema = z
	.object({
		content: z.string().describe("The content of the post"),
		platform: platformSchema.describe("Platform to publish the post to"),
		title: z.string().describe("The title of the post"),
	})
	.superRefine(({ content, platform }, ctx) => {
		const limits: Record<Platform, number> = {
			bluesky: 300,
			linkedin: 3000,
			threads: 10000,
			x: 280,
		};

		if (content.length > limits[platform]) {
			ctx.addIssue({
				code: "custom",
				message: `Must be under ${limits[platform]} characters`,
			});
		}
	});
