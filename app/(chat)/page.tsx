import { getToken } from "@convex-dev/better-auth/nextjs";
import { fetchAction, fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { createAuth } from "@/lib/auth";
import type { Tier } from "@/lib/types";
import { api } from "../../convex/_generated/api";

export default async function HomePage() {
	const token = await getToken(createAuth);
	const user = await fetchQuery(api.auth.getUser, {}, { token });

	const userId = user?._id;
	const isAnonymous = user?.isAnonymous;

	if (!userId) {
		return redirect("/api/auth/anonymous");
	}

	let tier: Tier = "anonymous";

	if (!isAnonymous) {
		tier = await fetchAction(api.customers.getTier, { userId }, { token });
	}

	console.log("the tier is:", tier);

	return (
		<Chat
			isAnonymous={isAnonymous ?? false}
			threadId={null}
			userId={userId}
			userTier={tier}
		/>
	);
}
