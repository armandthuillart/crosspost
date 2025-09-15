import { fetchQuery, preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { getToken } from "@/lib/auth-server";
import { api } from "../../../../convex/_generated/api";

export default async function Page({ params }: PageProps<"/c/[threadId]">) {
	const token = await getToken();

	if (!token) {
		return redirect("/api/auth/anonymous");
	}

	const { userId, isAnonymous, userTier } = await fetchQuery(
		api.auth.getUser,
		{},
		{ token },
	);

	const { threadId } = await params;

	await preloadQuery(
		api.chat.loadChat,
		{
			paginationOpts: { cursor: null, numItems: 10 },
			streamArgs: { kind: "list", startOrder: 0 },
			threadId,
		},
		{ token },
	);

	return (
		<Chat
			isAnonymous={isAnonymous}
			threadId={threadId}
			userId={userId}
			userTier={userTier}
		/>
	);
}
