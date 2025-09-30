"use client";

import {
	type Preloaded,
	useMutation,
	usePreloadedQuery,
	useQuery,
} from "convex/react";
import {
	AnimatePresence,
	type AnimationOptions,
	stagger,
	type Target,
	useAnimate,
} from "motion/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { type MouseEvent, useState } from "react";
import type { ParamsOf } from "~/.next/types/routes";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Checkbox } from "~/components/ui/checkbox";
import {
	AppIcon,
	ArchiveIcon,
	MoreIcon,
	SearchIcon,
} from "~/components/ui/icons";
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
import { Button } from "./ui/button";

export function AppSidebar({
	preloadedChats,
}: {
	preloadedChats: Preloaded<typeof api.chat.listChats>;
}) {
	const { push } = useRouter();
	const pathname = usePathname();
	const user = useQuery(api.auth.getUser);

	const [threadIds, setThreadIds] = useState<string[] | null>(null);

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
							<SibebarHistory
								preloadedChats={preloadedChats}
								setThreadIds={setThreadIds}
								threadIds={threadIds}
							/>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenuButton className="h-auto justify-between rounded-full pr-4">
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

function SibebarHistorySearch({
	threadIds,
	setThreadIds,
	hasThreadIds,
}: {
	threadIds: string[] | null;
	setThreadIds: (threadIds: string[] | null) => void;
	hasThreadIds: boolean;
}) {
	const { chatId } = useParams<ParamsOf<"/c/[chatId]">>();
	const { push } = useRouter();

	const archiveChats = useMutation(api.chat.archiveChats).withOptimisticUpdate(
		(localStore, { threadIds }) => {
			const currentChats = localStore.getQuery(api.chat.listChats, {
				paginationOpts: { cursor: null, numItems: 10 },
			});

			if (currentChats !== undefined) {
				const updatedResults = {
					...currentChats,
					page: currentChats.page.map((chat) =>
						threadIds.includes(chat._id)
							? { ...chat, status: "archived" as const }
							: chat,
					),
				};

				localStore.setQuery(
					api.chat.listChats,
					{ paginationOpts: { cursor: null, numItems: 10 } },
					updatedResults,
				);
			}
		},
	);

	async function handleArchive() {
		if (!threadIds) return;

		if (chatId && threadIds.includes(chatId as string)) {
			push("/");
		}

		void archiveChats({ threadIds });
		setThreadIds(null);
	}

	return (
		<div className="relative flex w-full items-center gap-3">
			<div className="flex w-full items-center gap-2 pl-2.5 text-muted-foreground">
				<div className="my-2 flex size-5 shrink-0 items-center justify-center">
					<SearchIcon className="size-4 shrink-0" />
				</div>

				<input
					className="w-full text-foreground text-sm outline-none placeholder:text-muted-foreground"
					placeholder="Search"
				/>
			</div>

			{hasThreadIds && (
				<Button
					className="shrink-0 text-muted-foreground"
					onClick={handleArchive}
					size="icon"
					variant="ghost"
				>
					<ArchiveIcon className="size-5" />
				</Button>
			)}
		</div>
	);
}

function SibebarHistory({
	threadIds,
	setThreadIds,
	preloadedChats,
}: {
	threadIds: string[] | null;
	setThreadIds: (threadIds: string[] | null) => void;
	preloadedChats: Preloaded<typeof api.chat.listChats>;
}) {
	const [ref, animate] = useAnimate();
	const { chatId: paramsChatId } = useParams<ParamsOf<"/c/[chatId]">>();
	const { push } = useRouter();

	const chats = usePreloadedQuery(preloadedChats);

	const activeChats =
		chats?.page.filter(({ status }) => status === "active") || [];

	function handleSelect(e: MouseEvent<HTMLButtonElement>, chatId: string) {
		e.stopPropagation();

		const currentIds = threadIds || [];

		const newIds = currentIds.includes(chatId)
			? currentIds.filter((id) => id !== chatId)
			: [...currentIds, chatId];

		setThreadIds(newIds.length > 0 ? newIds : null);

		const hasMultipleCheckboxes = activeChats.length > 1;
		const allSelected = newIds.length === activeChats.length;

		if (hasMultipleCheckboxes && allSelected) {
			const lastCompletedIndex = activeChats.findIndex(
				({ _id: chatId }) => !currentIds.includes(chatId),
			);

			const { floor, random } = Math;

			const animations: Array<{
				options: AnimationOptions;
				keyframes: Target;
			}> = [
				// Scale animation
				{
					keyframes: { scale: [1, 1.25, 1] },
					options: {
						delay: stagger(0.075, { from: lastCompletedIndex }),
						duration: 0.35,
					},
				},
				// Shimmy animation
				{
					keyframes: { x: [0, 2, -2, 0] },
					options: {
						delay: stagger(0.1, { from: lastCompletedIndex }),
						duration: 0.4,
					},
				},
				// Shake animation
				{
					keyframes: { rotate: [0, 10, -10, 0] },
					options: {
						delay: stagger(0.1, { from: lastCompletedIndex }),
						duration: 0.5,
					},
				},
			];

			const selected = animations[floor(random() * animations.length)];

			animate('[data-slot="checkbox"]', selected.keyframes, {
				...selected.options,
				ease: [0.32, 0.72, 0, 1],
			});
		}
	}

	return (
		<div ref={ref}>
			<AnimatePresence initial={false} mode="popLayout">
				{activeChats.map(({ _id: chatId, title }) => (
					<SidebarMenuItem
						animate={{ height: "auto" }}
						exit={{ height: 0 }}
						initial={{ height: 0 }}
						key={chatId}
						layout="position"
						transition={{
							duration: 0.5,
							ease: [0.32, 0.72, 0, 1],
							layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
						}}
					>
						<SidebarMenuButton
							className="justify-between group-hover/menu-item:bg-sidebar-accent/70 group-has-data-[state=checked]/menu-item:bg-sidebar-accent/70"
							isActive={chatId === paramsChatId}
							onClick={() => push(`/c/${chatId}`)}
						>
							<span className="truncate">{title}</span>
						</SidebarMenuButton>

						<Checkbox
							checked={threadIds?.includes(chatId) || false}
							className="absolute top-2.5 right-3 bg-background not-data-[state=checked]:opacity-0 group-hover/menu-item:opacity-100"
							onClick={(e) => handleSelect(e, chatId)}
						/>
					</SidebarMenuItem>
				))}
			</AnimatePresence>
		</div>
	);
}
