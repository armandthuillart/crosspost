"use client";

import { usePaginatedQuery } from "convex/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { AppIcon, SearchIcon } from "~/components/ui/icons";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "~/components/ui/sidebar";
import { api } from "~/convex/generated/api";
import { appName } from "~/lib/constants";

export function AppSidebar() {
	const { push } = useRouter();

	const pathname = usePathname();

	return (
		<Sidebar>
			<SidebarHeader>
				<SibebarHistorySearch />
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									isActive={pathname === "/"}
									onClick={() => push("/")}
								>
									<AppIcon className="size-5 text-primary" />
									{appName}
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Chats</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SibebarHistory />
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="flex-row items-center justify-between">
				<div className="flex items-center gap-2">
					<Avatar className="size-6 shrink-0">
						<AvatarFallback className="bg-primary">A</AvatarFallback>
					</Avatar>

					<div className="flex w-full flex-col">
						<span className="text-sm">Armand</span>
						<span className="text-muted-foreground text-xs">Free</span>
					</div>
				</div>
				<Button className="rounded-full" size="sm" variant="outline">
					Upgrade
				</Button>
			</SidebarFooter>
		</Sidebar>
	);
}

function SibebarHistorySearch() {
	return (
		<div className="flex w-full items-center gap-2 pl-2.5 text-muted-foreground">
			<div className="my-2 flex size-5 shrink-0 items-center justify-center">
				<SearchIcon className="size-4 shrink-0" />
			</div>

			<input
				className="w-full text-foreground text-sm outline-none placeholder:text-muted-foreground"
				placeholder="Search"
			/>
		</div>
	);
}

function SibebarHistory() {
	const { threadId } = useParams();
	const { push } = useRouter();

	const { results: chats } = usePaginatedQuery(
		api.chat.listChats,
		{ paginationOpts: { cursor: null, numItems: 10 } },
		{ initialNumItems: 10 },
	);

	return chats.map(({ _id: chatId, title }) => (
		<SidebarMenuItem key={chatId}>
			<SidebarMenuButton
				className="justify-between"
				isActive={chatId === threadId}
				onClick={() => push(`/c/${chatId}`)}
			>
				<span className="truncate">{title}</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	));
}
