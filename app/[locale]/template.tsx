import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { AppSidebar } from "~/components/app.sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { WelcomeBack } from "~/components/welcome-back";
import { api } from "~/convex/generated/api";
import { getToken } from "~/lib/auth-server";

export default async function Template({ children }: { children: ReactNode }) {
	const [cookieStore, token] = await Promise.all([cookies(), getToken()]);

	if (!token) {
		return <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>;
	}

	const [preloadedUser, preloadedChats] = await Promise.all([
		preloadQuery(api.auth.getUser, {}, { token }),
		preloadQuery(
			api.chat.listChats,
			{ paginationOpts: { cursor: null, numItems: 10 } },
			{ token },
		),
	]);

	const user = preloadedQueryResult(preloadedUser);

	if (!user || user.tier === "anonymous") {
		return <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>;
	}

	const isBack = cookieStore.has("remember");
	const isOpen = cookieStore.get("sidebar")?.value;

	return (
		<SidebarProvider defaultOpen={isOpen === "true"}>
			<AppSidebar
				preloadedChats={preloadedChats}
				preloadedUser={preloadedUser}
			/>
			{children}
			{isBack && <WelcomeBack />}
		</SidebarProvider>
	);
}
