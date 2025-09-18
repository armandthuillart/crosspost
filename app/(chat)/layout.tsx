import { fetchQuery } from "convex/nextjs";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";

export default async function ChatLayout({
	children,
}: {
	children: ReactNode;
}) {
	const token = await getToken();

	const { isAnonymous } = await fetchQuery(
		api.betterAuth.auth.getUser,
		{},
		{ token },
	);

	return !isAnonymous ? (
		<SidebarProvider defaultOpen={false}>
			<AppSidebar />
			{children}
		</SidebarProvider>
	) : (
		children
	);
}
