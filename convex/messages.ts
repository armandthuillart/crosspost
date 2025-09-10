import { listUIMessages, vStreamArgs } from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import { query } from "./_generated/server";
import { agent } from "./agent";

export const list = query({
	args: {
		paginationOpts: paginationOptsValidator,
		streamArgs: vStreamArgs,
		threadId: v.string(),
	},
	handler: async (ctx, { threadId, streamArgs, paginationOpts }) => {
		await ctx.runQuery(internal.chat.authorize, {
			threadId,
		});

		const streams = await agent.syncStreams(ctx, {
			streamArgs,
			threadId,
		});

		const paginated = await listUIMessages(ctx, components.agent, {
			paginationOpts,
			threadId,
		});

		return {
			...paginated,
			streams,
		};
	},
});
