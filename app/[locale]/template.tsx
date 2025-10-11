import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { AppLegalCenter } from "~/components/app.legal-center";
import { AppShortcuts } from "~/components/app.shortcuts";
import { AppSidebar } from "~/components/app.sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { getToken } from "~/lib/auth-server";
import { api } from "../../convex/_generated/api";

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

	const isOpen = cookieStore.get("sidebar")?.value;

	return (
		<SidebarProvider defaultOpen={isOpen === "true"}>
			<AppLegalCenter />
			<AppShortcuts />
			<AppSidebar
				preloadedChats={preloadedChats}
				preloadedUser={preloadedUser}
			/>
			{children}
		</SidebarProvider>
	);
}
