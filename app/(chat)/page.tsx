import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import type { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";
import type { Tier } from "@/lib/types";
import { api } from "../../convex/_generated/api";

export default async function Page() {
	const token = await getToken();

	const user = await fetchQuery(api.auth.getUser, {}, { token });
	const userId = user?.userId;
	const isAnonymous = user?.isAnonymous ?? false;

	if (!userId) {
		return redirect("/api/auth/anonymous");
	}

	let tier: Tier = "anonymous";

	if (!isAnonymous) {
		tier = await fetchQuery(
			api.customers.getTier,
			{ userId: userId as Id<"users"> },
			{ token },
		);
	}

	return (
		<Chat
			initialMessages={[]}
			isAnonymous={isAnonymous}
			userId={userId as Id<"users">}
			userTier={tier}
		/>
	);
}
