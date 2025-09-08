import { getToken } from "@convex-dev/better-auth/nextjs";
import { fetchQuery } from "convex/nextjs";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { createAuth } from "@/lib/auth";

export default async function ChatLayout({
	children,
}: {
	children: ReactNode;
}) {
	const [token, cookieStore] = await Promise.all([
		getToken(createAuth),
		cookies(),
	]);

	const user = await fetchQuery(api.auth.getUser, {}, { token });

	const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

	return (
		<SidebarProvider
			defaultHidden={user?.isAnonymous ?? false}
			defaultOpen={defaultOpen}
		>
			<AppSidebar />
			{children}
		</SidebarProvider>
	);
}
