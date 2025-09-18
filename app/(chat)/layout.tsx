import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
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

	if (!token) {
		// Redirect to our proxy, not directly to "/sign-in/anonymous".
		// The proxy converts this GET into the required POST and propagates cookies.
		return redirect("/api/auth/anonymous");
	}

	const { isAnonymous } = await fetchQuery(
		api.auth.getUser,
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
