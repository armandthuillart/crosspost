"use client";

import {
	Authenticated,
	AuthLoading,
	Unauthenticated,
	useQuery,
} from "convex/react";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";

export default function ChatLayout({ children }: { children: ReactNode }) {
	const user = useQuery(api.auth.getUser, {});
	const isAnonymous = user?.isAnonymous;

	return (
		<>
			<Authenticated>
				{!isAnonymous ? (
					<SidebarProvider defaultOpen={false}>
						<AppSidebar />
						{children}
					</SidebarProvider>
				) : (
					children
				)}
			</Authenticated>
			<Unauthenticated>Not authenticated</Unauthenticated>
			<AuthLoading>Loading...</AuthLoading>
		</>
	);
}
