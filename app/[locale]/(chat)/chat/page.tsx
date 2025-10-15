import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import type { Locale } from "next-intl";
import { createLoader, parseAsString } from "nuqs/server";
import { Chat } from "~/components/chat";
import { redirect } from "~/i18n/navigation";
import { getToken } from "~/lib/auth-server";
import type { MyMessage } from "~/lib/types";
import { api } from "../../../../convex/_generated/api";

export const searchParams = { message: parseAsString.withDefault("") };

export const loadSearchParams = createLoader(searchParams);

export default async function Page({
	params,
	searchParams,
}: PageProps<"/[locale]/chat">) {
	const [{ message }, token, { locale }] = await Promise.all([
		loadSearchParams(searchParams),
		getToken(),
		params,
	]);

	const preloadedUser = await preloadQuery(api.auth.getUser, {}, { token });

	if (!preloadedQueryResult(preloadedUser)) {
		redirect({
			href: "/",
			locale: locale as Locale,
		});
	}

	const initialMessages: MyMessage[] = message
		? [
				{
					_creationTime: Date.now(),
					id: "user",
					key: "user",
					order: 1,
					parts: [{ text: message as string, type: "text" }],
					role: "user",
					status: "pending",
					stepOrder: 1,
					text: message as string,
				},
				{
					_creationTime: Date.now(),
					id: "assistant",
					key: "assistant",
					order: 2,
					parts: [],
					role: "assistant",
					status: "pending",
					stepOrder: 1,
					text: "",
				},
			]
		: [];

	return (
		<Chat
			initialMessages={initialMessages}
			preloadedUser={preloadedUser}
			userLocation={{ city: "", country: "", region: "" }}
		/>
	);
}
