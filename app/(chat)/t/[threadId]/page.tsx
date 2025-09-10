import { getToken } from "@convex-dev/better-auth/nextjs";
import { fetchAction, fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { createAuth } from "@/lib/auth";
import type { Tier } from "@/lib/types";
import { api } from "../../../../convex/_generated/api";

type Params = Promise<{ threadId: string }>;

export default async function ChatPage({ params }: { params: Params }) {
	const token = await getToken(createAuth);
	const user = await fetchQuery(api.auth.getUser, {}, { token });

	const userId = user?._id;
	const isAnonymous = user?.isAnonymous;

	if (!userId) {
		return redirect("/api/auth/anonymous");
	}

	const { threadId } = await params;

	let tier: Tier = "anonymous";

	if (!isAnonymous) {
		tier = await fetchAction(api.customers.getTier, { userId }, { token });
	}

	return (
		<Chat
			isAnonymous={isAnonymous ?? false}
			threadId={threadId}
			userId={userId}
			userTier={tier}
		/>
	);
}
