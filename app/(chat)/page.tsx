import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { getToken } from "@/lib/auth-server";
import type { Tier } from "@/lib/types";
import { api } from "../../convex/_generated/api";

export default async function Page() {
	const token = await getToken();

	const { userId, isAnonymous } = await fetchQuery(
		api.auth.getUser,
		{},
		{ token },
	);

	if (!userId) {
		return redirect("/api/auth/anonymous");
	}

	let userTier: Tier = "anonymous";

	if (!isAnonymous) {
		userTier = await fetchQuery(api.customers.getTier, { userId }, { token });
	}

	return (
		<Chat
			initialMessages={[]}
			isAnonymous={isAnonymous}
			userId={userId}
			userTier={userTier}
		/>
	);
}
