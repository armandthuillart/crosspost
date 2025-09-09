import { createTool } from "@convex-dev/agent";
import { z } from "zod/v3";
import { api } from "../../convex/_generated/api";
import type { Id } from "../_generated/dataModel";

export const zodSchema = z.object({
	title: z.string().describe("The title of the draft"),
	versions: z
		.object({
			bluesky: z.object({ content: z.string() }).optional(),
			threads: z.object({ content: z.string() }).optional(),
			x: z.object({ content: z.string() }).optional(),
		})
		.refine(
			(version) =>
				Object.values(version).some((content) => content !== undefined),
			"At least one version must be provided",
		)
		.describe("Platform-specific versions of the draft"),
});

export const createDraft = createTool({
	args: zodSchema,
	handler: async (ctx, { title, versions }) => {
		const draftId: Id<"drafts"> = await ctx.runMutation(
			api.drafts.createDraft,
			{ title, versions },
		);
		return draftId;
	},
});
