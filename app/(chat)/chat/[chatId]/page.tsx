import { getToken } from "@convex-dev/better-auth/nextjs";
import { fetchQuery } from "convex/nextjs";
import { notFound, redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { createAuth } from "@/lib/auth";
import { convertDbMessagesToUiMessages } from "@/lib/utils";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

type Params = Promise<{ chatId: string }>;

export default async function ChatPage({ params }: { params: Params }) {
	const token = await getToken(createAuth);
	const user = await fetchQuery(api.auth.getUser, {}, { token });

	if (!user) {
		return redirect("/api/auth/anonymous");
	}

	const { chatId } = await params;

	const chat = await fetchQuery(api.chat.queries.getChat, {
		chatId: chatId as Id<"chats">,
	});

	if (!chat || chat.userId !== user.userId) {
		notFound();
	}

	const dbMessages = await fetchQuery(api.chat.queries.getMessages, {
		chatId: chatId as Id<"chats">,
	});

	const uiMessages = convertDbMessagesToUiMessages(dbMessages);

	return (
		<Chat
			initialMessages={uiMessages}
			isAnonymous={user.isAnonymous ?? false}
		/>
	);
}
