import { fetchQuery, preloadQuery } from "convex/nextjs";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { AppSidebar } from "~/components/app.sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { WelcomeBack } from "~/components/welcome-back";
import { api } from "~/convex/generated/api";
import { getAuthToken } from "~/lib/auth-server";
import type { User } from "~/lib/types";

interface ChatLayoutProps {
	children: ReactNode;
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
	const [authToken, cookieStore] = await Promise.all([
		getAuthToken(),
		cookies(),
	]);

	let user: User | null = null;

	if (authToken) {
		user = await fetchQuery(api.auth.getUser, {}, { token: authToken });
	}

	const isBack = cookieStore.has("remember");
	const sidebar = cookieStore.get("sidebar")?.value;
	const isAnonymous = user && user.tier === "anonymous";

	if (!user || isAnonymous) {
		return children;
	}

	const preloadedChats = await preloadQuery(
		api.chat.listChats,
		{ paginationOpts: { cursor: null, numItems: 10 } },
		{ token: authToken },
	);

	return (
		<SidebarProvider defaultOpen={sidebar === "true"}>
			<AppSidebar preloadedChats={preloadedChats} />
			{children}
			{isBack && <WelcomeBack />}
		</SidebarProvider>
	);
}
