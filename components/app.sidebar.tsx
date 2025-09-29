"use client";

import { usePaginatedQuery, useQuery } from "convex/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { AppIcon, MoreIcon, SearchIcon } from "~/components/ui/icons";
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

	const user = useQuery(api.auth.getUser);

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

			<SidebarFooter>
				<SidebarMenuButton className="h-auto justify-between pr-4">
					<div className="flex items-center gap-2.5 overflow-hidden">
						<Avatar>
							<AvatarFallback>
								{user?.firstName && user?.lastName
									? user.firstName.charAt(0) + user.lastName.charAt(0)
									: (user?.email?.charAt(0) ?? "?")}
							</AvatarFallback>
						</Avatar>
						<span className="truncate font-medium text-sm">
							{user?.firstName} {user?.lastName}
						</span>
					</div>
					<MoreIcon className="size-6" />
				</SidebarMenuButton>
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
