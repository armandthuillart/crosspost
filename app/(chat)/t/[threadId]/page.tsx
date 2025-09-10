import { getToken } from "@convex-dev/better-auth/nextjs";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { createAuth } from "@/lib/auth";
import type { Tier } from "@/lib/types";
import { api } from "../../../../convex/_generated/api";

type Params = Promise<{ threadId: string }>;

export default async function ChatPage({ params }: { params: Params }) {
	const { threadId } = await params;

	const token = await getToken(createAuth);
	const user = await fetchQuery(api.auth.getUser, {}, { token });

	const userId = user?._id;
	const isAnonymous = user?.isAnonymous ?? false;

	if (!userId) {
		return redirect("/api/auth/anonymous");
	}

	let tier: Tier = "anonymous";

	if (!isAnonymous) {
		tier = await fetchQuery(api.customers.getTier, { userId }, { token });
	}

	return (
		<Chat
			isAnonymous={isAnonymous}
			threadId={threadId}
			userId={userId}
			userTier={tier}
		/>
	);
}
