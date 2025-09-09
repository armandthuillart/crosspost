import { getToken } from "@convex-dev/better-auth/nextjs";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { createAuth } from "@/lib/auth";
import { api } from "../../../../convex/_generated/api";

type Params = Promise<{ threadId: string }>;

export default async function ChatPage({ params }: { params: Params }) {
	const token = await getToken(createAuth);
	const user = await fetchQuery(api.auth.getUser, {}, { token });

	if (!user) {
		return redirect("/api/auth/anonymous");
	}

	const { threadId } = await params;

	return <Chat isAnonymous={user.isAnonymous ?? false} threadId={threadId} />;
}
