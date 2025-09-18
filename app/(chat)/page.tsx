import { fetchMutation, fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { getToken } from "@/lib/auth-server";
import type { Tier } from "@/lib/types";
import { api } from "../../convex/_generated/api";

export default async function Page() {
	const token = await getToken();

	if (!token) {
		// Redirect to our proxy, not directly to "/sign-in/anonymous".
		// The proxy converts this GET into the required POST and propagates cookies.
		return redirect("/api/auth/anonymous");
	}

	const { userTier, isAnonymous } = await fetchQuery(
		api.auth.getUser,
		{},
		{ token },
	);

	const threadId = await fetchMutation(api.chat.createChat, {}, { token });

	return (
		<Chat
			isAnonymous={isAnonymous ?? false}
			threadId={threadId}
			userTier={userTier as Tier}
		/>
	);
}
