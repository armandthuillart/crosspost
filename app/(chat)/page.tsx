import { preloadQuery } from "convex/nextjs";
import { headers } from "next/headers";
import { Chat } from "~/components/chat";
import { api } from "~/convex/generated/api";
import { getAuthToken } from "~/lib/auth-server";

export default async function Page() {
	const authToken = await getAuthToken();

	const preloadedUser = await preloadQuery(
		api.auth.getUser,
		{},
		{ token: authToken },
	);

	const { get } = await headers();
	const city = get("x-user-city")
		? decodeURIComponent(get("x-user-city")!)
		: undefined;
	const region = get("x-user-region")
		? decodeURIComponent(get("x-user-region")!)
		: undefined;
	const country = get("x-user-country")
		? decodeURIComponent(get("x-user-country")!)
		: undefined;

	return (
		<Chat
			initialMessages={[]}
			preloadedUser={preloadedUser}
			userLocation={{ city, country, region }}
		/>
	);
}
