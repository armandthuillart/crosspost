import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WelcomeBack } from "@/components/welcome-back";

export default async function ChatLayout({
	children,
}: {
	children: ReactNode;
}) {
	const cookieStore = await cookies();
	const sidebar = cookieStore.get("sidebar")?.value;
	const isBack = cookieStore.has("remember");

	return (
		<SidebarProvider defaultOpen={sidebar === "true"}>
			<AppSidebar />
			{children}

			{isBack && <WelcomeBack />}
		</SidebarProvider>
	);
}
