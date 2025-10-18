import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { cookies } from "next/headers";
import { AppLegalDocuments } from "~/components/app.legal-documents.server";
import { AppShortcuts } from "~/components/app.shortcuts";
import { AppSidebar } from "~/components/app.sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { api } from "~/convex/_generated/api";
import { getToken } from "~/lib/auth-server";

export default async function ChatLayout({
	children,
}: LayoutProps<"/[locale]">) {
	const [token, cookieStore] = await Promise.all([getToken(), cookies()]);

	const isOpen = cookieStore.get("SIDEBAR")?.value;

	if (!token) {
		return (
			<SidebarProvider defaultOpen={false}>
				<AppLegalDocuments />
				<AppShortcuts />
				{children}
			</SidebarProvider>
		);
	}

	const preloadedUser = await preloadQuery(api.auth.getUser, {}, { token });
	const user = preloadedQueryResult(preloadedUser);

	if (user && user.tier !== "anonymous") {
		const preloadedChats = await preloadQuery(
			api.chats.listChats,
			{ paginationOpts: { cursor: null, numItems: 10 } },
			{ token },
		);

		return (
			<SidebarProvider defaultOpen={isOpen === "true"}>
				<AppLegalDocuments />
				<AppShortcuts />
				<AppSidebar
					preloadedChats={preloadedChats}
					preloadedUser={preloadedUser}
				/>
				{children}
			</SidebarProvider>
		);
	}

	return (
		<SidebarProvider defaultOpen={false}>
			<AppLegalDocuments />
			<AppShortcuts />
			{children}
		</SidebarProvider>
	);
}
