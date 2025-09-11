"use client";

import { Authenticated, AuthLoading, useQuery } from "convex/react";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { LoaderIcon } from "@/components/ui/icons";
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
			<AuthLoading>
				<div className="flex h-full items-center justify-center">
					<LoaderIcon className="m-auto size-5 animate-spin" />
				</div>
			</AuthLoading>
		</>
	);
}
