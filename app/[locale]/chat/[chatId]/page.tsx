import { fetchQuery, preloadQuery } from "convex/nextjs";
import { getLocation } from "~/app/actions";
import { Chat } from "~/components/chat";
import { getToken } from "~/lib/auth-server";
import type { MyMessage } from "~/lib/types";
import { api } from "../../../../convex/_generated/api";

export default async function Page({
	params,
}: PageProps<"/[locale]/chat/[chatId]">) {
	const [userLocation, token, { chatId: threadId }] = await Promise.all([
		getLocation(),
		getToken(),
		params,
	]);

	const [preloadedUser, { page: initialMessages }] = await Promise.all([
		preloadQuery(api.auth.getUser, {}, { token }),
		fetchQuery(
			api.chat.loadChat,
			{ paginationOpts: { cursor: null, numItems: 10 }, threadId },
			{ token },
		),
	]);

	return (
		<Chat
			initialMessages={initialMessages as Array<MyMessage>}
			preloadedUser={preloadedUser}
			userLocation={userLocation}
		/>
	);
}
