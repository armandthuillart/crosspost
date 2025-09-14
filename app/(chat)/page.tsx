import { generateId } from "ai";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { getToken } from "@/lib/auth-server";
import type { Tier } from "@/lib/types";
import { api } from "../../convex/_generated/api";

export default async function Page() {
	const token = await getToken();

	const user = await fetchQuery(api.auth.getUser, {}, { token });
	const userId = user?._id;
	const isAnonymous = user?.isAnonymous ?? false;

	if (!token || !userId) {
		return redirect("/api/auth/anonymous");
	}

	let userTier: Tier = "anonymous";

	if (!isAnonymous) {
		userTier = await fetchQuery(api.customers.getTier, { userId }, { token });
	}

	const optimisticId = generateId();

	return (
		<Chat
			initialMessages={[]}
			isAnonymous={isAnonymous}
			optimisticId={optimisticId}
			token={token}
			userId={userId}
			userTier={userTier}
		/>
	);
}
