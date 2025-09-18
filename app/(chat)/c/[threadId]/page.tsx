import "server-only";

import { preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { getToken } from "@/lib/auth-server";
import { api } from "../../../../convex/_generated/api";

export default async function Page({ params }: PageProps<"/c/[threadId]">) {
	const token = await getToken();

	if (!token) {
		// Redirect to our proxy, not directly to "/sign-in/anonymous".
		// The proxy converts this GET into the required POST and propagates cookies.
		return redirect("/api/auth/proxy/anonymous");
	}

	const preloadedUser = await preloadQuery(api.auth.getUser, {}, { token });

	const { threadId } = await params;

	return <Chat preloadedUser={preloadedUser} threadId={threadId} />;
}
