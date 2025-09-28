import { preloadQuery } from "convex/nextjs";
import { Chat } from "@/components/chat";
import { getToken } from "@/lib/auth-server";
import { api } from "../../../../convex/_generated/api";

export default async function Page({ params }: PageProps<"/c/[chatId]">) {
	const token = await getToken();
	const { chatId } = await params;
	const preloadedUser = await preloadQuery(api.auth.getUser, {}, { token });

	return <Chat chatId={chatId} preloadedUser={preloadedUser} />;
}
