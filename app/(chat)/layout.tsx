import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function ChatLayout({
	children,
}: {
	children: ReactNode;
}) {
	const cookieStore = await cookies();
	const sidebar = cookieStore.get("sidebar")?.value;

	return (
		<SidebarProvider defaultOpen={sidebar === "true"}>
			<AppSidebar />
			{children}
		</SidebarProvider>
	);
}
