"use client";

import type { ThreadDoc } from "@convex-dev/agent/validators";
import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import type { PaginationResult } from "convex/server";
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
import { AppMenu } from "~/components/app.menu";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { AppIcon, SearchIcon, TrashIcon } from "~/components/ui/icons";
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

export function AppSidebar({
	preloadedChats,
	preloadedUser,
}: {
	preloadedChats: Preloaded<typeof api.chat.listChats>;
	preloadedUser: Preloaded<typeof api.auth.getUser>;
}) {
	const chats = usePreloadedQuery(preloadedChats);
	const user = usePreloadedQuery(preloadedUser);

	const { push } = useRouter();
	const pathname = usePathname();

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
					<SidebarGroupLabel className="justify-between">
						Chats
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
									? "Clear"
									: "All"}
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

	const deleteChats = useMutation(api.chat.deleteChats).withOptimisticUpdate(
		(localStore, { threadIds }) => {
			const currentChats = localStore.getQuery(api.chat.listChats, {
				paginationOpts: { cursor: null, numItems: 10 },
			});

			if (currentChats !== undefined) {
				const updatedResults = {
					...currentChats,
					page: currentChats.page.filter(
						({ _id: chatId }) => !threadIds.includes(chatId),
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

	async function handleDelete() {
		if (!threadIds) return;

		if (chatId && threadIds.includes(chatId as string)) {
			push("/");
		}

		void deleteChats({ threadIds });
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
					className="shrink-0 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
					onClick={handleDelete}
					size="icon"
					variant="ghost"
				>
					<TrashIcon className="size-5" />
				</Button>
			)}
		</div>
	);
}

function SibebarHistory({
	chats,
	threadIds,
	setThreadIds,
}: {
	chats: PaginationResult<ThreadDoc>;
	threadIds: string[] | null;
	setThreadIds: (threadIds: string[] | null) => void;
}) {
	const { chatId: paramsChatId } = useParams<ParamsOf<"/c/[chatId]">>();
	const [ref, animate] = useAnimate();
	const { push } = useRouter();

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
