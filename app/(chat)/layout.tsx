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

	const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

	return (
		<SidebarProvider defaultHidden={false} defaultOpen={defaultOpen}>
			<AppSidebar />
			{children}
		</SidebarProvider>
	);
}
