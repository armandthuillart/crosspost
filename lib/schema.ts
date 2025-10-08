import { z } from "zod";

export const tierSchema = z.enum(["anonymous", "free", "pro"]);

export const platformSchema = z.enum(["threads", "linkedin", "bluesky", "x"]);

export const draftSchema = z.object({
	title: z.string().describe("The title of the draft"),
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
	.refine(
		({ content, platform }) => {
			switch (platform) {
				case "threads":
					return content.length <= 10000;
				case "linkedin":
					return content.length <= 3000;
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
				case "linkedin":
					return { message: "Must be under 3000 characters" };
				case "bluesky":
					return { message: "Must be under 300 characters" };
				case "x":
					return { message: "Must be under 280 characters" };
			}
		},
	);
