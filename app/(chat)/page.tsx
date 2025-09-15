import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { getToken } from "@/lib/auth-server";
import { api } from "../../convex/_generated/api";

export default async function Page() {
	const token = await getToken();

	if (!token) {
		return redirect("/api/auth/anonymous");
	}

	const { userId, userTier, isAnonymous } = await fetchQuery(
		api.auth.getUser,
		{},
		{ token },
	);

	return <Chat isAnonymous={isAnonymous} userId={userId} userTier={userTier} />;
}
