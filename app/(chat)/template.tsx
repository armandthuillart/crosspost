import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { AppSidebar } from "~/components/app.sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { WelcomeBack } from "~/components/welcome-back";
import { api } from "~/convex/generated/api";
import { getAuthToken } from "~/lib/auth-server";

export default async function Template({ children }: { children: ReactNode }) {
	const [authToken, cookieStore] = await Promise.all([
		getAuthToken(),
		cookies(),
	]);

	if (!authToken) {
		return <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>;
	}

	const preloadedUser = await preloadQuery(
		api.auth.getUser,
		{},
		{ token: authToken },
	);

	const user = preloadedQueryResult(preloadedUser);

	if (!user || user.tier === "anonymous") {
		return <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>;
	}

	const preloadedChats = await preloadQuery(
		api.chat.listChats,
		{ paginationOpts: { cursor: null, numItems: 10 } },
		{ token: authToken },
	);

	const isBack = cookieStore.has("remember");
	const sidebar = cookieStore.get("sidebar")?.value;

	return (
		<SidebarProvider defaultOpen={sidebar === "true"}>
			<AppSidebar
				preloadedChats={preloadedChats}
				preloadedUser={preloadedUser}
			/>
			{children}
			{isBack && <WelcomeBack />}
		</SidebarProvider>
	);
}
