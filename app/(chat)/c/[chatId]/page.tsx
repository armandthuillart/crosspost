import { preloadQuery } from "convex/nextjs";
import { headers } from "next/headers";
import { Chat } from "~/components/chat";
import { api } from "~/convex/generated/api";
import { getToken } from "~/lib/auth-server";

export default async function Page() {
	const token = await getToken();
	const preloadedUser = await preloadQuery(api.auth.getUser, {}, { token });

	const { get } = await headers();
	const city = get("x-user-city") ?? undefined;
	const countryCode = get("x-user-country") ?? undefined;

	return (
		<Chat city={city} countryCode={countryCode} preloadedUser={preloadedUser} />
	);
}
