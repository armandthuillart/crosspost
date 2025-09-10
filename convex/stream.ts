import { abortStream } from "@convex-dev/agent";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import { mutation } from "./_generated/server";

export const abort = mutation({
	args: { order: v.number(), threadId: v.string() },
	handler: async (ctx, { threadId, order }) => {
		await ctx.runQuery(internal.chat.authorize, {
			threadId,
		});

		if (
			await abortStream(ctx, components.agent, {
				order,
				reason: "Aborting explicitly",
				threadId,
			})
		) {
			console.log("Aborted stream", threadId, order);
		} else {
			console.log("No stream found", threadId, order);
		}
	},
});
