import { fetchQuery, preloadQuery } from "convex/nextjs";
import { getLocation } from "~/app/actions";
import { Chat } from "~/components/chat";
import { api } from "~/convex/generated/api";
import { getToken } from "~/lib/auth-server";

export default async function Page({ params }: PageProps<"/chat/[chatId]">) {
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
			initialMessages={initialMessages}
			preloadedUser={preloadedUser}
			userLocation={userLocation}
		/>
	);
}
