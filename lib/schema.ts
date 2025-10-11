import { z } from "zod";

export const tierSchema = z.enum(["anonymous", "free", "pro"]);

export const platformSchema = z.enum(["threads", "linkedin", "bluesky", "x"]);

export const draftSchema = z.object({
	versions: z
		.object({
			bluesky: z
				.string()
				.max(300, { error: "Must be under 300 characters" })
				.optional(),
			linkedin: z
				.string()
				.max(3000, { error: "Must be under 3000 characters" })
				.optional(),
			threads: z
				.string()
				.max(10000, { error: "Must be under 10000 characters" })
				.optional(),
			x: z
				.string()
				.max(280, { error: "Must be under 280 characters" })
				.optional(),
		})
		.refine(
			(version) =>
				Object.values(version).some((content) => content !== undefined),
			"Must have at least one version",
		)
		.describe("Platform-specific versions of the draft"),
});
