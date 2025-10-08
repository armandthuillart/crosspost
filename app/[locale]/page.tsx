import { preloadQuery } from "convex/nextjs";
import { getLocation } from "~/app/actions";
import { Chat } from "~/components/chat";
import { getToken } from "~/lib/auth-server";
import { api } from "../../convex/_generated/api";

export default async function HomePage() {
	const [{ city, region, country }, token] = await Promise.all([
		getLocation(),
		getToken(),
	]);

	const preloadedUser = await preloadQuery(api.auth.getUser, {}, { token });

	return (
		<Chat
			initialMessages={[]}
			preloadedUser={preloadedUser}
			userLocation={{ city, country, region }}
		/>
	);
}
