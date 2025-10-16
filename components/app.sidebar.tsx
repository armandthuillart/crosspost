"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AppMenu } from "~/components/app.menu";
import { SibebarHistory } from "~/components/app.sidebar.history";
import { SibebarHistorySearch } from "~/components/app.sidebar.history.search";
import { Button } from "~/components/ui/button";
import { AppIcon } from "~/components/ui/icons";
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
import { usePathname, useRouter } from "~/i18n/navigation";
import { appName } from "~/lib/constants";
import type { api } from "../convex/_generated/api";

export function AppSidebar({
	preloadedChats,
	preloadedUser,
}: {
	preloadedChats: Preloaded<typeof api.chats.listChats>;
	preloadedUser: Preloaded<typeof api.auth.getUser>;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const chats = usePreloadedQuery(preloadedChats);
	const user = usePreloadedQuery(preloadedUser);
	const t = useTranslations("AppSidebar");

	const [threadIds, setThreadIds] = useState<string[] | null>(null);
	const hasThreadIds = !!threadIds;

	return (
		<Sidebar>
			<SidebarHeader>
				<SibebarHistorySearch
					hasThreadIds={!!threadIds}
					setThreadIds={setThreadIds}
					threadIds={threadIds}
				/>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									isActive={pathname === "/"}
									onClick={() => router.push("/")}
								>
									<AppIcon className="size-5 text-primary" />
									{appName}
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel className="justify-between">
						{t("chats")}
						{hasThreadIds && (
							<Button
								className="not-hover:text-muted-foreground"
								onClick={() => {
									if (threadIds && threadIds.length === chats?.page.length) {
										setThreadIds(null);
									} else {
										setThreadIds(
											chats?.page.map(({ _id: chatId }) => chatId) || [],
										);
									}
								}}
								variant="link"
							>
								{threadIds && threadIds.length === chats?.page.length
									? t("clear")
									: t("all")}
							</Button>
						)}
					</SidebarGroupLabel>

					<SidebarGroupContent>
						<SidebarMenu>
							<SibebarHistory
								chats={chats}
								setThreadIds={setThreadIds}
								threadIds={threadIds}
							/>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<AppMenu user={user ?? null} />
			</SidebarFooter>
		</Sidebar>
	);
}
