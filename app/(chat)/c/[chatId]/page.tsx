import { fetchQuery } from "convex/nextjs";
import { notFound, redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { getToken } from "@/lib/auth-server";
import type { Tier } from "@/lib/types";
import { toUIMessages } from "@/lib/utils";
import { api } from "../../../../convex/_generated/api";

export default async function Page({ params }: PageProps<"/c/[chatId]">) {
	const { chatId: optimisticId } = await params;

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

	const chat = await fetchQuery(api.chat.getChat, { optimisticId }, { token });

	if (!chat || chat.userId !== userId) {
		notFound();
	}

	const chatId = chat._id;
	const messages = await fetchQuery(api.chat.loadChat, { chatId }, { token });

	return (
		<Chat
			initialMessages={toUIMessages(messages)}
			isAnonymous={isAnonymous}
			optimisticId={optimisticId}
			token={token}
			userId={userId}
			userTier={userTier}
		/>
	);
}
