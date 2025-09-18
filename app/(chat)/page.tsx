import "server-only";

import { fetchMutation, fetchQuery } from "convex/nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { getToken } from "@/lib/auth-server";
import type { Tier } from "@/lib/types";
import { api } from "../../convex/_generated/api";

export default async function Page() {
	const token = await getToken();
	const cookieStore = await cookies();

	if (!token) {
		// Redirect to our proxy, not directly to "/sign-in/anonymous".
		// The proxy converts this GET into the required POST and propagates cookies.
		return redirect("/api/auth/proxy/anonymous");
	}

	const { userTier, isAnonymous } = await fetchQuery(
		api.auth.getUser,
		{},
		{ token },
	);

	let threadId = cookieStore.get("chat")?.value;

	if (!threadId) {
		threadId = await fetchMutation(api.chat.createChat, {}, { token });
	}

	return (
		<Chat
			isAnonymous={isAnonymous ?? false}
			threadId={threadId}
			userTier={userTier as Tier}
		/>
	);
}
