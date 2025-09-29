import { getThreadMetadata } from "@convex-dev/agent";
import { api, components } from "~/convex/generated/api";
import type {
	ActionCtx,
	MutationCtx,
	QueryCtx,
} from "~/convex/generated/server";
import { ChatSDKError } from "~/lib/errors";

export async function verifyOwnership(
	ctx: QueryCtx | MutationCtx | ActionCtx,
	threadId: string,
) {
	const user = await ctx.runQuery(api.auth.getUser, {});

	if (!user) {
		throw new ChatSDKError("unauthorized:auth");
	}

	const { userId } = await getThreadMetadata(ctx, components.agent, {
		threadId,
	});

	if (userId !== user.id) {
		throw new ChatSDKError("unauthorized:auth");
	}

	return user;
}
