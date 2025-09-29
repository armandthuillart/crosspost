import { preloadQuery } from "convex/nextjs";
import { Chat } from "@/components/chat";
import { getToken } from "@/lib/auth-server";
import { api } from "../../../../convex/_generated/api";

export default async function Page({ params }: PageProps<"/c/[chatId]">) {
	const { chatId } = await params;

	const token = await getToken();
	const preloadedUser = await preloadQuery(api.auth.getUser, {}, { token });

	await preloadQuery(
		api.chat.loadChat,
		{ paginationOpts: { cursor: null, numItems: 10 }, threadId: chatId },
		{ token },
	);

	return <Chat preloadedUser={preloadedUser} />;
}
