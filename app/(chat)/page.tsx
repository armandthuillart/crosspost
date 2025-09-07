import { getToken } from "@convex-dev/better-auth/nextjs";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { createAuth } from "@/lib/auth";
import { api } from "../../convex/_generated/api";

export default async function HomePage() {
	const token = await getToken(createAuth);
	console.log("page: token", token);

	const user = await fetchQuery(api.auth.getUser, {}, { token });
	console.log("page: user", user);

	if (!user) {
		console.log("page: no user", "redirecting to /api/auth/anonymous");
		return redirect("/api/auth/anonymous");
	}

	console.log("page: user", "rendering chat");
	return <Chat initialMessages={[]} />;
}
