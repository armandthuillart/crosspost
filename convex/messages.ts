import { listUIMessages } from "@convex-dev/agent";
import { vStreamArgs } from "@convex-dev/agent/validators";
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
	handler: async (ctx, args) => {
		await ctx.runQuery(internal.chat.authorize, {
			threadId: args.threadId,
		});

		const streams = await agent.syncStreams(ctx, {
			streamArgs: args.streamArgs,
			threadId: args.threadId,
		});

		const paginated = await listUIMessages(ctx, components.agent, args);

		return {
			...paginated,
			streams,
		};
	},
});
