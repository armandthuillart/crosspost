import { getToken } from "@convex-dev/better-auth/nextjs";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { createAuth } from "@/lib/auth";
import { api } from "../../convex/_generated/api";

export default async function HomePage() {
	const token = await getToken(createAuth);
	const user = await fetchQuery(api.auth.getUser, {}, { token });

	if (!user) {
		return redirect("/api/auth/anonymous");
	}

	return <Chat initialMessages={[]} />;
}
