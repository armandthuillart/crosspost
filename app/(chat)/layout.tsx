import { fetchQuery, preloadQuery } from "convex/nextjs";
import type { Preloaded } from "convex/react";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { AppSidebar } from "~/components/app.sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { WelcomeBack } from "~/components/welcome-back";
import { api } from "~/convex/generated/api";
import { getToken } from "~/lib/auth-server";
import type { User } from "~/lib/types";

interface ChatLayoutProps {
	children: ReactNode;
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
	const [token, cookieStore] = await Promise.all([getToken(), cookies()]);

	let user: User | null = null;

	if (token) {
		user = await fetchQuery(api.auth.getUser, {}, { token });
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
		{ token },
	);

	return (
		<SidebarProvider defaultOpen={sidebar === "true"}>
			<AppSidebar preloadedChats={preloadedChats} />
			{children}
			{isBack && <WelcomeBack />}
		</SidebarProvider>
	);
}
