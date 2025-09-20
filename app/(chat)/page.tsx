import { fetchMutation, preloadQuery } from "convex/nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { getToken } from "@/lib/auth-server";
import { api } from "../../convex/_generated/api";

export default async function Page() {
	const [token, cookieStore] = await Promise.all([getToken(), cookies()]);

	if (!token) {
		// Redirect to our proxy, not directly to "/sign-in/anonymous".
		// The proxy converts this GET into the required POST and propagates cookies.
		return redirect("/api/auth/proxy/anonymous");
	}

	const preloadedUser = await preloadQuery(api.auth.getUser, {}, { token });

	let threadId = cookieStore.get("chat")?.value;

	if (!threadId) {
		threadId = await fetchMutation(api.chat.createChat, {}, { token });
	}

	return <Chat preloadedUser={preloadedUser} threadId={threadId} />;
}
