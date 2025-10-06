"use client";

import { Settings2Icon } from "lucide-react";
import { AppSettings } from "~/components/app.settings";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { DrawerTrigger } from "~/components/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	AssistantsIcon,
	KeyboardKeyIcon,
	LifeBuoyIcon,
	LogOutIcon,
	MoreIcon,
	SignatureIcon,
} from "~/components/ui/icons";
import { SidebarMenuButton } from "~/components/ui/sidebar";
import { usePathname, useRouter } from "~/i18n/navigation";
import { signOut } from "~/lib/auth-client";
import type { User } from "~/lib/types";

interface AppMenuProps {
	user: User | null;
}

export function AppMenu({ user }: AppMenuProps) {
	const router = useRouter();
	const pathname = usePathname();

	async function handleSignOut() {
		await signOut();

		if (pathname.startsWith("/c")) {
			router.push("/");
		} else {
			router.refresh();
		}
	}

	return (
		<AppSettings>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
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
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="w-64" side="top">
					<DropdownMenuItem disabled>
						<AssistantsIcon className="size-4" />
						Customize
						<Badge className="ml-auto rounded-full" variant="selection">
							Soon
						</Badge>
					</DropdownMenuItem>

					<DrawerTrigger asChild>
						<DropdownMenuItem>
							<Settings2Icon className="size-4" />
							Settings
						</DropdownMenuItem>
					</DrawerTrigger>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<LifeBuoyIcon className="size-4" />
							Help
						</DropdownMenuSubTrigger>

						<DropdownMenuSubContent>
							<DropdownMenuItem>
								<SignatureIcon className="size-4" />
								Terms & policies
							</DropdownMenuItem>

							<DropdownMenuItem className="w-full">
								<KeyboardKeyIcon className="size-4" />
								Keyboard shortcuts
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>

					<DropdownMenuItem onClick={handleSignOut}>
						<LogOutIcon className="size-4" />
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</AppSettings>
	);
}
