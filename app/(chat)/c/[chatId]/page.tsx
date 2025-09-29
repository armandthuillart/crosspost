import { preloadQuery } from "convex/nextjs";
import { Chat } from "~/components/chat";
import { api } from "~/convex/generated/api";
import { getToken } from "~/lib/auth-server";

export default async function Page() {
	const token = await getToken();
	const preloadedUser = await preloadQuery(api.auth.getUser, {}, { token });

	return <Chat preloadedUser={preloadedUser} />;
}
