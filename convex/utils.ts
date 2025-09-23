import { getThreadMetadata } from "@convex-dev/agent";
import { ChatSDKError } from "../lib/errors";
import { api, components } from "./_generated/api";
import type { ActionCtx, MutationCtx, QueryCtx } from "./_generated/server";

export async function verifyOwnership(
	ctx: QueryCtx | MutationCtx | ActionCtx,
	threadId: string,
) {
	const user = await ctx.runQuery(api.auth.getUser, {});

	if (!user.id) {
		throw new ChatSDKError("unauthorized:auth");
	}

	console.log("DEBUG: verifyOwnership called with threadId:", threadId);
	console.log("DEBUG: threadId type:", typeof threadId);
	console.log("DEBUG: threadId length:", threadId.length);

	const { userId } = await getThreadMetadata(ctx, components.agent, {
		threadId,
	});

	if (userId !== user.id) {
		throw new ChatSDKError("unauthorized:auth");
	}

	return user;
}
