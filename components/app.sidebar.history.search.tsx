"use client";

import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ParamsOf } from "~/.next/types/routes";
import { Button } from "~/components/ui/button";
import { SearchIcon, TrashIcon } from "~/components/ui/icons";
import { useRouter } from "~/i18n/navigation";
import { api } from "../convex/_generated/api";

export function SibebarHistorySearch({
	threadIds,
	setThreadIds,
	hasThreadIds,
}: {
	threadIds: string[] | null;
	setThreadIds: (threadIds: string[] | null) => void;
	hasThreadIds: boolean;
}) {
	const router = useRouter();
	const t = useTranslations("SidebarHistorySearch");

	const { chatId } = useParams<ParamsOf<"/[locale]/chat/[chatId]">>();

	const deleteChats = useMutation(api.chats.deleteChats).withOptimisticUpdate(
		(localStore, { threadIds }) => {
			const currentChats = localStore.getQuery(api.chats.listChats, {
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
					api.chats.listChats,
					{ paginationOpts: { cursor: null, numItems: 10 } },
					updatedResults,
				);
			}
		},
	);

	async function handleDelete() {
		if (!threadIds) return;

		const shouldNavigate = chatId && threadIds.includes(chatId as string);

		void deleteChats({ threadIds });
		setThreadIds(null);

		if (shouldNavigate) {
			router.push("/");
		}
	}

	return (
		<div className="relative flex w-full items-center gap-3">
			<div className="flex w-full items-center gap-2 pl-2.5 text-muted-foreground">
				<div className="my-2 flex size-5 shrink-0 items-center justify-center">
					<SearchIcon className="size-4 shrink-0" />
				</div>

				<input
					className="w-full text-foreground text-sm outline-none placeholder:text-muted-foreground"
					placeholder={t("search")}
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
