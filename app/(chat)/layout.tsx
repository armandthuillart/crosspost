import { fetchQuery } from "convex/nextjs";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WelcomeBack } from "@/components/welcome-back";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";

export default async function ChatLayout({
	children,
}: {
	children: ReactNode;
}) {
	const [token, cookieStore] = await Promise.all([getToken(), cookies()]);

	const user = await fetchQuery(api.auth.getUser, {}, { token });

	const sidebar = cookieStore.get("sidebar")?.value;
	const isBack = cookieStore.has("remember");

	return user.tier !== "anonymous" ? (
		<SidebarProvider defaultOpen={sidebar === "true"}>
			<AppSidebar />
			{children}
			{isBack && <WelcomeBack />}
		</SidebarProvider>
	) : (
		children
	);
}
