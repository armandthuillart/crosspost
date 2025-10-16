import { fetchQuery, preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import type { Locale } from "next-intl";
import { getLocation } from "~/app/actions";
import { Chat } from "~/components/chat";
import { redirect } from "~/i18n/navigation";
import { getToken } from "~/lib/auth-server";
import { isChatSDKError } from "~/lib/errors";
import type { MyMessage } from "~/lib/types";
import { tryCatch } from "~/lib/utils";
import { api } from "../../../../../convex/_generated/api";

export default async function ChatPage({
	params,
}: PageProps<"/[locale]/chat/[chatId]">) {
	const [userLocation, token, { chatId: threadId, locale }] = await Promise.all(
		[getLocation(), getToken(), params],
	);

	const preloadedUser = await preloadQuery(api.auth.getUser, {}, { token });

	if (!preloadedQueryResult(preloadedUser)) {
		redirect({
			href: "/",
			locale: locale as Locale,
		});
	}

	const { data, error } = await tryCatch(
		fetchQuery(
			api.chats.loadChat,
			{ paginationOpts: { cursor: null, numItems: 10 }, threadId },
			{ token },
		),
	);

	if (error) {
		if (isChatSDKError(error)) {
			const { type } = error.data;

			if (type === "not_found") {
				notFound();
			}

			if (type === "unauthorized") {
				redirect({
					href: "/",
					locale: locale as Locale,
				});
			}
		}
	}

	// Ensure initialMessages is always an array to prevent crashes
	const initialMessages = (data?.page as Array<MyMessage>) ?? [];

	return (
		<Chat
			initialMessages={initialMessages}
			preloadedUser={preloadedUser}
			userLocation={userLocation}
		/>
	);
}
