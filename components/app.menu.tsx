"use client";

import { useSetAtom } from "jotai";
import { useTranslations } from "next-intl";
import { AppSettings } from "~/components/app.settings";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { DrawerTrigger } from "~/components/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	HelpIcon,
	KeyboardKeyIcon,
	LogOutIcon,
	MoreIcon,
	SettingsIcon,
	SignatureIcon,
} from "~/components/ui/icons";
import { SidebarMenuButton } from "~/components/ui/sidebar";
import { SHORTCUTS } from "~/hooks/use-shortcuts";
import { usePathname, useRouter } from "~/i18n/navigation";
import { showPoliciesAtom, showShortcutsAtom } from "~/lib/atoms";
import { signOut } from "~/lib/auth-client";
import type { User } from "~/lib/types";

interface AppMenuProps {
	user: User | null;
}

export function AppMenu({ user }: AppMenuProps) {
	const t = useTranslations("AppMenu");
	const router = useRouter();
	const pathname = usePathname();

	const setShowShortcuts = useSetAtom(showShortcutsAtom);
	const setShowPolicies = useSetAtom(showPoliciesAtom);

	async function handleSignOut() {
		await signOut();

		if (pathname.startsWith("/c")) {
			router.push("/");
		} else {
			router.refresh();
		}
	}

	return (
		<AppSettings user={user ?? null}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuButton className="h-auto justify-between rounded-full pr-4 pl-2">
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
				</DropdownMenuTrigger>

				<DropdownMenuContent align="start" className="w-58" side="top">
					<DrawerTrigger asChild>
						<DropdownMenuItem>
							<SettingsIcon className="size-4" />
							{t("settings")}
						</DropdownMenuItem>
					</DrawerTrigger>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<HelpIcon className="size-4" />
							{t("help")}
						</DropdownMenuSubTrigger>

						<DropdownMenuSubContent>
							<DropdownMenuItem onClick={() => setShowPolicies(true)}>
								<SignatureIcon className="size-4" />
								{t("termsAndPolicies")}
							</DropdownMenuItem>

							<DropdownMenuItem onClick={() => setShowShortcuts(true)}>
								<KeyboardKeyIcon className="size-4" />
								{t("keyboardShortcuts")}

								<DropdownMenuShortcut>
									{SHORTCUTS.SEE_SHORTCUTS.modifier && "⌘"}
									{SHORTCUTS.SEE_SHORTCUTS.shift && "⇧"}
									{SHORTCUTS.SEE_SHORTCUTS.key}
								</DropdownMenuShortcut>
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>

					<DropdownMenuItem onClick={handleSignOut}>
						<LogOutIcon className="size-4" />
						{t("logOut")}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</AppSettings>
	);
}
