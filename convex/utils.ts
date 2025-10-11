import { getThreadMetadata } from "@convex-dev/agent";
import { ChatSDKError } from "../lib/errors";
import { tryCatch } from "../lib/utils";
import { api, components } from "./_generated/api";
import type { ActionCtx, MutationCtx, QueryCtx } from "./_generated/server";

export async function verifyOwnership(
	ctx: QueryCtx | MutationCtx | ActionCtx,
	threadId: string,
) {
	const user = await ctx.runQuery(api.auth.getUser, {});

	if (!user) {
		throw new ChatSDKError("unauthorized:auth");
	}

	const { data, error } = await tryCatch(
		getThreadMetadata(ctx, components.agent, {
			threadId,
		}),
	);

	if (!data || error) {
		throw new ChatSDKError("not_found:chat");
	}

	const { userId } = data;

	if (userId !== user.id) {
		throw new ChatSDKError("unauthorized:auth");
	}

	return user;
}
