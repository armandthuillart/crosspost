import type { ThreadDoc } from "@convex-dev/agent/validators";
import type { PaginationResult } from "convex/server";
import { useParams } from "next/navigation";
import type { MouseEvent } from "react";
import type { ParamsOf } from "~/.next/dev/types/routes";
import { Checkbox } from "~/components/ui/checkbox";
import { SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
import { useRouter } from "~/i18n/navigation";

export function SibebarHistory({
	chats,
	threadIds,
	setThreadIds,
}: {
	chats: PaginationResult<ThreadDoc>;
	threadIds: string[] | null;
	setThreadIds: (threadIds: string[] | null) => void;
}) {
	const { chatId: paramsChatId } =
		useParams<ParamsOf<"/[locale]/chat/[chatId]">>();
	const router = useRouter();

	function handleSelect(e: MouseEvent<HTMLButtonElement>, chatId: string) {
		e.stopPropagation();

		const currentIds = threadIds || [];

		const newIds = currentIds.includes(chatId)
			? currentIds.filter((id) => id !== chatId)
			: [...currentIds, chatId];

		setThreadIds(newIds.length > 0 ? newIds : null);
	}

	return chats.page.map(({ _id: chatId, title }) => (
		<SidebarMenuItem key={chatId}>
			<SidebarMenuButton
				className="justify-between group-hover/menu-item:bg-sidebar-accent/70 group-has-data-[state=checked]/menu-item:bg-sidebar-accent/70"
				isActive={chatId === paramsChatId}
				onClick={() => router.push(`/chat/${chatId}`)}
			>
				<span className="truncate">{title}</span>
			</SidebarMenuButton>

			<Checkbox
				checked={threadIds?.includes(chatId) || false}
				className="absolute top-2.5 right-3 bg-background not-data-[state=checked]:opacity-0 group-hover/menu-item:opacity-100"
				onClick={(e) => handleSelect(e, chatId)}
			/>
		</SidebarMenuItem>
	));
}
