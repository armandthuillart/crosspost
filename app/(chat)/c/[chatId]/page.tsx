import { fetchQuery } from "convex/nextjs";
import { notFound, redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import type { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";
import type { Tier } from "@/lib/types";
import { toUIMessages } from "@/lib/utils";
import { api } from "../../../../convex/_generated/api";

export default async function Page({ params }: PageProps<"/c/[chatId]">) {
	const { chatId } = (await params) as { chatId: Id<"chats"> };

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

	const chat = await fetchQuery(api.chat.getChat, { chatId }, { token });

	if (!chat || chat.userId !== user.userId) {
		notFound();
	}

	const initialMessages = await fetchQuery(api.chat.listMessages, {
		chatId,
	});

	return (
		<Chat
			initialMessages={toUIMessages(initialMessages ?? [])}
			isAnonymous={isAnonymous}
			userId={userId as Id<"users">}
			userTier={tier}
		/>
	);
}
